const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

exports.default = async function notarizeMacos(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') {
    return;
  }

  const appName = context.packager.appInfo.productFilename;
  const appPath = path.join(appOutDir, `${appName}.app`);
  const zipPath = path.join(appOutDir, `${appName}.zip`);

  if (!fs.existsSync(appPath)) {
    console.warn(`Skipping notarizing step. App not found at ${appPath}`);
    return;
  }

  const keychainProfile = process.env.APPLE_NOTARY_PROFILE;
  const appleId = process.env.APPLE_ID;
  const appleIdPassword =
    process.env.APPLE_APP_SPECIFIC_PASSWORD || process.env.APPLE_ID_PASS;
  const teamId = process.env.APPLE_TEAM_ID;

  if (!keychainProfile && !(appleId && appleIdPassword && teamId)) {
    console.warn(
      'Skipping notarizing step. Set APPLE_NOTARY_PROFILE or APPLE_ID + APPLE_APP_SPECIFIC_PASSWORD (or APPLE_ID_PASS) + APPLE_TEAM_ID.',
    );
    return;
  }

  // notarytool expects zip/pkg/dmg. Zip the app bundle before upload.
  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
  }

  execFileSync(
    'ditto',
    ['-c', '-k', '--sequesterRsrc', '--keepParent', appPath, zipPath],
    {
      stdio: 'inherit',
    },
  );

  const submitArgs = ['notarytool', 'submit', zipPath, '--wait'];

  if (keychainProfile) {
    submitArgs.push('--keychain-profile', keychainProfile);
  } else {
    submitArgs.push('--apple-id', appleId);
    submitArgs.push('--password', appleIdPassword);
    submitArgs.push('--team-id', teamId);
  }

  try {
    console.log(
      `Submitting ${appName}.zip for notarization using xcrun notarytool...`,
    );
    execFileSync('xcrun', submitArgs, { stdio: 'inherit' });
  } catch (error) {
    console.error('Notarization submission failed.');
    console.error(
      'Check credentials, team ID, and whether xcrun notarytool is available.',
    );
    throw error;
  }

  console.log(`Stapling notarization ticket to ${appName}.app...`);
  execFileSync('xcrun', ['stapler', 'staple', appPath], { stdio: 'inherit' });
};
