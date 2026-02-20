import fs from 'node:fs';
import path from 'node:path';

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const appUrl = (process.env.FLPT_APP_URL || '').trim();
const publicIp = (process.env.FLPT_PUBLIC_IP || '').trim();
const publicUrl = (process.env.FLPT_PUBLIC_URL || '').trim();
const localIp = (process.env.FLPT_LOCAL_IP || '').trim();
const localIpsRaw = (process.env.FLPT_LOCAL_IPS || '').trim();
const localUrl = (process.env.FLPT_LOCAL_URL || '').trim();
const appPortRaw = (process.env.FLPT_APP_PORT || '').trim();
const appSchemeRaw = (process.env.FLPT_APP_SCHEME || '').trim().toLowerCase();

function isValidIpv4(value) {
  const parts = String(value || '').split('.');
  return parts.length === 4 && parts.every((part) => /^\d+$/.test(part) && Number(part) >= 0 && Number(part) <= 255);
}

function parsePort(value) {
  if (!value) {
    return 8080;
  }
  if (!/^\d+$/.test(value)) {
    return null;
  }
  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    return null;
  }
  return port;
}

function normalizeBaseUrl(value) {
  if (!value) {
    return '';
  }

  try {
    const parsed = new URL(value);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return '';
    }
    return parsed.origin;
  } catch {
    return '';
  }
}

function makeUrlFromIp(ip, scheme, port) {
  if (!isValidIpv4(ip)) {
    return '';
  }
  return `${scheme}://${ip}:${port}`;
}

const appScheme = appSchemeRaw === 'https' ? 'https' : 'http';
const appPort = parsePort(appPortRaw);

if (appPort === null) {
  console.error('Invalid FLPT_APP_PORT. Use an integer from 1 to 65535.');
  process.exit(1);
}

const derivedAppUrl = publicIp ? `${appScheme}://${publicIp}:${appPort}` : '';
const selectedAppUrl = appUrl || derivedAppUrl;
const derivedPublicUrl = publicIp ? makeUrlFromIp(publicIp, appScheme, appPort) : '';
const localIps = localIpsRaw
  .split(',')
  .map((entry) => entry.trim())
  .filter(Boolean);

let parsed = null;
if (selectedAppUrl) {
  try {
    parsed = new URL(selectedAppUrl);
  } catch {
    console.error('Invalid FLPT_APP_URL/FLPT_PUBLIC_IP combination. Use FLPT_APP_URL or FLPT_PUBLIC_IP with optional FLPT_APP_PORT and FLPT_APP_SCHEME.');
    process.exit(1);
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    console.error('FLPT_APP_URL must start with http:// or https://');
    process.exit(1);
  }
}

const isHttp = parsed ? parsed.protocol === 'http:' : true;

const config = {
  appId: 'com.flpt.app',
  appName: 'Free Live Personal TV',
  webDir: 'web',
  server: {
    cleartext: true
  },
  android: {
    allowMixedContent: true
  }
};

if (parsed) {
  config.server.url = parsed.toString();
  config.server.cleartext = isHttp;
  config.android.allowMixedContent = isHttp;
}

if (publicIp && !isValidIpv4(publicIp)) {
  console.error('Invalid FLPT_PUBLIC_IP. Use IPv4 format like 203.0.113.10');
  process.exit(1);
}

if (localIp && !isValidIpv4(localIp)) {
  console.error('Invalid FLPT_LOCAL_IP. Use IPv4 format like 192.168.1.50');
  process.exit(1);
}

if (localIps.some((entry) => !isValidIpv4(entry))) {
  console.error('Invalid FLPT_LOCAL_IPS. Use comma-separated IPv4 values like 192.168.1.10,192.168.1.11');
  process.exit(1);
}

if (publicUrl && !normalizeBaseUrl(publicUrl)) {
  console.error('Invalid FLPT_PUBLIC_URL. Use full URL like https://tv.example.com');
  process.exit(1);
}

if (localUrl && !normalizeBaseUrl(localUrl)) {
  console.error('Invalid FLPT_LOCAL_URL. Use full URL like http://192.168.1.50:8080');
  process.exit(1);
}

const runtimeCandidates = [];
const seenRuntimeCandidates = new Set();
const pushRuntimeCandidate = (value) => {
  const normalized = normalizeBaseUrl(value);
  if (!normalized || seenRuntimeCandidates.has(normalized)) {
    return;
  }
  seenRuntimeCandidates.add(normalized);
  runtimeCandidates.push(normalized);
};

pushRuntimeCandidate(localUrl);
pushRuntimeCandidate(makeUrlFromIp(localIp, appScheme, appPort));
for (const ip of localIps) {
  pushRuntimeCandidate(makeUrlFromIp(ip, appScheme, appPort));
}
pushRuntimeCandidate(publicUrl);
pushRuntimeCandidate(appUrl);
pushRuntimeCandidate(derivedPublicUrl);

const runtimeConfigPath = path.join(rootDir, 'web', 'runtime-config.js');
const runtimeConfig = `window.__FLPT_RUNTIME_CONFIG__ = Object.freeze(${JSON.stringify({ preferredApiBaseUrls: runtimeCandidates }, null, 2)});\n`;
fs.writeFileSync(runtimeConfigPath, runtimeConfig, 'utf8');

const configPath = path.join(rootDir, 'capacitor.config.json');
fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
if (parsed) {
  if (appUrl) {
    console.log(`Wrote ${configPath} with FLPT_APP_URL=${appUrl}`);
  } else {
    console.log(`Wrote ${configPath} with FLPT_PUBLIC_IP=${publicIp}, FLPT_APP_SCHEME=${appScheme}, FLPT_APP_PORT=${appPort}`);
  }
} else {
  console.log(`Wrote ${configPath} in bundled-app mode (dynamic backend discovery)`);
}
console.log(`Wrote ${runtimeConfigPath} with ${runtimeCandidates.length} preferred endpoint(s)`);
