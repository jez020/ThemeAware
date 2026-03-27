import fs from 'fs';
import path from 'path';

interface BuildVersion {
  version: string;
  buildNumber: number;
}

const buildVersionPath = path.join(__dirname, '../../.buildversion');
const packageJsonPath = path.join(__dirname, '../../package.json');
const appPackageJsonPath = path.join(
  __dirname,
  '../../release/app/package.json'
);

function getBuildVersion(): BuildVersion {
  try {
    const content = fs.readFileSync(buildVersionPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error('Missing .buildversion. Run increment-build at least once.');
  }
}

function setReleaseVersion(version: string): void {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  packageJson.version = version;
  packageJson.build.buildVersion = version;

  if (!packageJson.build.mac) {
    packageJson.build.mac = {};
  }
  packageJson.build.mac.minimumSystemVersion = '12.0';

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  const appPackageJson = JSON.parse(
    fs.readFileSync(appPackageJsonPath, 'utf-8')
  );
  appPackageJson.version = version;
  fs.writeFileSync(appPackageJsonPath, JSON.stringify(appPackageJson, null, 2));

  console.log(`Set release version to: ${version}`);
  console.log(`Set app version to: ${version}`);
  console.log('Set minimumSystemVersion to: 12.0');
}

const { version } = getBuildVersion();
setReleaseVersion(version);
