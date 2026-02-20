import fs from 'node:fs';
import path from 'node:path';

const rootDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const androidDir = path.join(rootDir, 'android');

if (!fs.existsSync(androidDir)) {
  console.log('Android project not found yet (android/). Skipping local.properties generation.');
  process.exit(0);
}

const sdkPathRaw = (process.env.ANDROID_SDK_ROOT || process.env.ANDROID_HOME || '').trim();
if (!sdkPathRaw) {
  console.warn('ANDROID_SDK_ROOT / ANDROID_HOME is not set. local.properties was not generated.');
  process.exit(0);
}

const sdkPathResolved = path.resolve(sdkPathRaw);
if (!fs.existsSync(sdkPathResolved)) {
  console.warn(`Android SDK path does not exist: ${sdkPathResolved}`);
  process.exit(0);
}

const escapedSdkPath = sdkPathResolved.replace(/\\/g, '\\\\').replace(/:/g, '\\:');
const content = `sdk.dir=${escapedSdkPath}\n`;
const localPropsPath = path.join(androidDir, 'local.properties');

fs.writeFileSync(localPropsPath, content, 'utf8');
console.log(`Wrote ${localPropsPath} from ${sdkPathResolved}`);
