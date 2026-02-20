import fs from 'node:fs';
import path from 'node:path';

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const appUrl = (process.env.FLPT_APP_URL || '').trim();
const publicIp = (process.env.FLPT_PUBLIC_IP || '').trim();
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

const appScheme = appSchemeRaw === 'https' ? 'https' : 'http';
const appPort = parsePort(appPortRaw);

if (appPort === null) {
  console.error('Invalid FLPT_APP_PORT. Use an integer from 1 to 65535.');
  process.exit(1);
}

const derivedAppUrl = publicIp ? `${appScheme}://${publicIp}:${appPort}` : '';
const selectedAppUrl = appUrl || derivedAppUrl;

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
