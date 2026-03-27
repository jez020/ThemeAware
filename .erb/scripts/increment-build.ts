import fs from 'fs';
import path from 'path';

interface BuildVersion {
  version: string;
  buildNumber: number;
}

const buildVersionPath = path.join(
  __dirname,
  '../../.buildversion'
);

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
    console.log('No build version file found, creating one...');
    const initial: BuildVersion = { version: '0.1', buildNumber: 1 };
    fs.writeFileSync(buildVersionPath, JSON.stringify(initial, null, 2));
    return initial;
  }
}

function incrementBuildVersion(): BuildVersion {
  const buildVersion = getBuildVersion();
  buildVersion.buildNumber += 1;
  fs.writeFileSync(buildVersionPath, JSON.stringify(buildVersion, null, 2));
  return buildVersion;
}

function updatePackageJson(buildVersion: BuildVersion): void {
  const packageJson = JSON.parse(
    fs.readFileSync(packageJsonPath, 'utf-8')
  );
  const fullVersion = `${buildVersion.version}.${buildVersion.buildNumber}`;
  packageJson.build.buildVersion = fullVersion;
  packageJson.version = fullVersion;
  // Set minimum macOS version to 12.0
  if (!packageJson.build.mac) {
    packageJson.build.mac = {};
  }
  packageJson.build.mac.minimumSystemVersion = '12.0';
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

  const appPackageJson = JSON.parse(
    fs.readFileSync(appPackageJsonPath, 'utf-8')
  );
  appPackageJson.version = fullVersion;
  fs.writeFileSync(appPackageJsonPath, JSON.stringify(appPackageJson, null, 2));

  console.log(
    `Updated buildVersion to: ${fullVersion} (build #${buildVersion.buildNumber})`
  );
  console.log(`Updated app version to: ${fullVersion}`);
  console.log(`Set minimumSystemVersion to: 12.0`);
}

// Main execution
const updated = incrementBuildVersion();
updatePackageJson(updated);
console.log(`Build version incremented to: ${updated.buildNumber}`);
