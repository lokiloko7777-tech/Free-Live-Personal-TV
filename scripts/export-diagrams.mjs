import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const docsGithubDir = path.join(root, 'docs', 'github');
const diagramsDir = path.join(docsGithubDir, 'diagrams');
const outputDir = path.join(diagramsDir, 'export');

const topLevelDiagramFiles = [
  path.join(docsGithubDir, 'architecture-overview.md'),
  path.join(docsGithubDir, 'request-lifecycle.md')
];

const excludedDiagramFiles = new Set(['README.md', 'STYLE-GUIDE.md']);

function collectDiagramMarkdownFiles() {
  const local = fs.readdirSync(diagramsDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => name.endsWith('.md') && !excludedDiagramFiles.has(name))
    .map((name) => path.join(diagramsDir, name));

  return [...local, ...topLevelDiagramFiles].filter((filePath) => fs.existsSync(filePath));
}

function extractMermaidBlock(markdown) {
  const match = markdown.match(/```mermaid\s*([\s\S]*?)```/m);
  if (!match) {
    return '';
  }
  return match[1].trim();
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: options.quiet ? 'pipe' : 'inherit',
    cwd: root,
    env: process.env
  });

  if (result.status !== 0) {
    return false;
  }

  return true;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(url, { attempts = 5, initialDelayMs = 500 } = {}) {
  let lastError = null;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return response;
      }
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }

    if (attempt < attempts) {
      const delay = initialDelayMs * attempt;
      await sleep(delay);
    }
  }

  throw lastError || new Error(`Fetch failed: ${url}`);
}

function canUseLocalRenderer() {
  const tempInput = path.join(os.tmpdir(), `flpt-local-check-${Date.now()}.mmd`);
  const tempOutput = path.join(os.tmpdir(), `flpt-local-check-${Date.now()}.svg`);
  fs.writeFileSync(tempInput, 'flowchart LR\nA-->B\n', 'utf8');
  const ok = run('npx', ['--yes', '@mermaid-js/mermaid-cli@10.9.1', '-i', tempInput, '-o', tempOutput], { quiet: true });
  fs.rmSync(tempInput, { force: true });
  fs.rmSync(tempOutput, { force: true });
  return ok;
}

function toBase64Url(text) {
  return Buffer.from(text, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

async function exportWithMermaidInk(mermaid, svgOut, pngOut) {
  const encoded = toBase64Url(mermaid);
  const svgUrl = `https://mermaid.ink/svg/${encoded}`;
  const pngUrl = `https://mermaid.ink/img/${encoded}?type=png`;

  const svgResp = await fetchWithRetry(svgUrl);
  const svgText = await svgResp.text();
  fs.writeFileSync(svgOut, svgText, 'utf8');

  const pngResp = await fetchWithRetry(pngUrl);
  const pngArrayBuffer = await pngResp.arrayBuffer();
  fs.writeFileSync(pngOut, Buffer.from(pngArrayBuffer));
}

async function exportWithKroki(mermaid, svgOut, pngOut) {
  const svgResp = await fetchWithRetry('https://kroki.io/mermaid/svg', {
    attempts: 4,
    initialDelayMs: 600
  }).catch(async () => {
    const response = await fetch('https://kroki.io/mermaid/svg', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      body: mermaid
    });
    if (!response.ok) {
      throw new Error(`Kroki SVG failed: ${response.status}`);
    }
    return response;
  });

  const svgText = await svgResp.text();
  fs.writeFileSync(svgOut, svgText, 'utf8');

  const pngResp = await fetch('https://kroki.io/mermaid/png', {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    body: mermaid
  });
  if (!pngResp.ok) {
    throw new Error(`Kroki PNG failed: ${pngResp.status}`);
  }
  const pngArrayBuffer = await pngResp.arrayBuffer();
  fs.writeFileSync(pngOut, Buffer.from(pngArrayBuffer));
}

async function exportRemoteWithFallbacks(mermaid, svgOut, pngOut, relFile) {
  try {
    await exportWithMermaidInk(mermaid, svgOut, pngOut);
    console.warn(`Using mermaid.ink fallback for ${relFile}`);
    return;
  } catch (error) {
    console.warn(`mermaid.ink failed for ${relFile}: ${error.message || error}`);
  }

  await exportWithKroki(mermaid, svgOut, pngOut);
  console.warn(`Using kroki.io fallback for ${relFile}`);
}

function sanitizeBaseName(filePath) {
  const relative = path.relative(docsGithubDir, filePath).replace(/\\/g, '/');
  return relative.replace(/\.md$/i, '').replace(/\//g, '__');
}

function ensureCleanOutputDir() {
  fs.rmSync(outputDir, { recursive: true, force: true });
  fs.mkdirSync(outputDir, { recursive: true });
}

async function main() {
  const files = collectDiagramMarkdownFiles();
  if (!files.length) {
    console.log('No diagram markdown files found.');
    return;
  }

  ensureCleanOutputDir();
  const localRenderer = canUseLocalRenderer();
  console.log(`Renderer mode: ${localRenderer ? 'local mermaid-cli' : 'remote mermaid.ink fallback'}`);

  let exportedCount = 0;
  let failedCount = 0;

  for (const filePath of files) {
    const markdown = fs.readFileSync(filePath, 'utf8');
    const mermaid = extractMermaidBlock(markdown);
    if (!mermaid) {
      console.warn(`Skipping (no mermaid block): ${path.relative(root, filePath)}`);
      continue;
    }

    const baseName = sanitizeBaseName(filePath);
    const tempFile = path.join(os.tmpdir(), `flpt-${baseName}-${Date.now()}.mmd`);
    fs.writeFileSync(tempFile, `${mermaid}\n`, 'utf8');

    const svgOut = path.join(outputDir, `${baseName}.svg`);
    const pngOut = path.join(outputDir, `${baseName}.png`);

    const localSvgOk = localRenderer
      ? run('npx', ['--yes', '@mermaid-js/mermaid-cli@10.9.1', '-i', tempFile, '-o', svgOut, '-b', 'transparent'])
      : false;
    const localPngOk = localSvgOk
      ? run('npx', ['--yes', '@mermaid-js/mermaid-cli@10.9.1', '-i', tempFile, '-o', pngOut, '-b', 'transparent', '--scale', '2'])
      : false;

    try {
      if (!localSvgOk || !localPngOk) {
        await exportRemoteWithFallbacks(mermaid, svgOut, pngOut, path.relative(root, filePath));
      }

      exportedCount += 1;
      console.log(`Exported: ${path.relative(root, svgOut)} + ${path.relative(root, pngOut)}`);
    } catch (error) {
      failedCount += 1;
      console.error(`Failed export for ${path.relative(root, filePath)}: ${error.message || error}`);
    } finally {
      fs.rmSync(tempFile, { force: true });
    }
  }

  console.log(`Done. Exported ${exportedCount} diagram(s) to ${path.relative(root, outputDir)}${failedCount ? `, failed ${failedCount}` : ''}`);
  if (failedCount > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
