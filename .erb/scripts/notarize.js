const { execFile } = require('node:child_process');
const fs = require('node:fs/promises');
const path = require('node:path');
const { promisify } = require('node:util');

const execFileAsync = promisify(execFile);

exports.default = async function notarizeMacos(context) {
  const { electronPlatformName, appOutDir } = context;
  if (electronPlatformName !== 'darwin') {
    return;
  }

  if (
    !(
      'APPLE_ID' in process.env &&
      'APPLE_ID_PASS' in process.env &&
      'APPLE_TEAM_ID' in process.env
    )
  ) {
    console.warn(
      'Skipping notarizing step. APPLE_ID, APPLE_ID_PASS, and APPLE_TEAM_ID env variables must be set',
    );
    return;
  }

  const appName = context.packager.appInfo.productFilename;
  const appPath = `${appOutDir}/${appName}.app`;
  const zipPath = path.join(appOutDir, `${appName}.zip`);

  // notarytool requires an archive payload, so zip the app bundle first.
  await execFileAsync(
    'ditto',
    ['-c', '-k', '--sequesterRsrc', '--keepParent', `${appName}.app`, zipPath],
    {
      cwd: appOutDir,
      maxBuffer: 10 * 1024 * 1024,
    },
  );

  const notarizeArgs = [
    'notarytool',
    'submit',
    zipPath,
    '--apple-id',
    process.env.APPLE_ID,
    '--password',
    process.env.APPLE_ID_PASS,
    '--team-id',
    process.env.APPLE_TEAM_ID,
    '--wait',
    '--output-format',
    'json',
  ];

  try {
    const { stdout, stderr } = await execFileAsync('xcrun', notarizeArgs, {
      maxBuffer: 10 * 1024 * 1024,
    });

    let notarizeResult;
    try {
      notarizeResult = JSON.parse(stdout);
    } catch {
      throw new Error(
        `Notarization returned non-JSON output.\n\nstdout:\n${stdout}\n\nstderr:\n${stderr}`,
      );
    }

    if (notarizeResult.status !== 'Accepted') {
      throw new Error(
        `Notarization failed with status "${notarizeResult.status}".\n\nstdout:\n${stdout}\n\nstderr:\n${stderr}`,
      );
    }

    await execFileAsync('xcrun', ['stapler', 'staple', appPath], {
      maxBuffer: 10 * 1024 * 1024,
    });
  } finally {
    await fs.rm(zipPath, { force: true });
  }
};
