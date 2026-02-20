import fs from 'node:fs';
import path from 'node:path';

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const appUrl = (process.env.FLPT_APP_URL || '').trim();

let parsed = null;
if (appUrl) {
  try {
    parsed = new URL(appUrl);
  } catch {
    console.error('Invalid FLPT_APP_URL. Use a full URL like http://192.168.1.10:8080 or https://your-domain.com');
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

const configPath = path.join(rootDir, 'capacitor.config.json');
fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
if (parsed) {
  console.log(`Wrote ${configPath} with FLPT_APP_URL=${appUrl}`);
} else {
  console.log(`Wrote ${configPath} in bundled-app mode (dynamic backend discovery)`);
}
