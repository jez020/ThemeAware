/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import settings from 'electron-settings';


export class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let settingsWindow: BrowserWindow | null = null;

// Initialize default settings on app startup

// Initialize default settings on app startup
const initializeDefaultSettings = async () => {
  const DEFAULT_SETTINGS = {
    startMinimized: false,
    startOnLogin: false,
  };

  // Check if settings exist, if not create defaults
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    const existing = await settings.get(key);
    if (existing === undefined) {
      await settings.set(key, value);
    }
  }
};

// Keep stored setting aligned with the real macOS login item state on startup.
const syncLoginItemSetting = async () => {
  const { openAtLogin } = app.getLoginItemSettings();
  await settings.set('startOnLogin', openAtLogin);
};

ipcMain.on('AppName', async (event, arg) => {
  const appName = app.getName();
  event.reply('AppName', appName);
});

ipcMain.on('OpenSettings', async (event, arg) => {
  createSettingsWindow();
});


/**
 *  ! Current settings
 * startMinimized: boolean - whether the app should start minimized or not
 * startOnLogin: boolean - whether the app should start on login or not
 * */

ipcMain.on('GetSettings', async (event, target) => {
  const settingsData = await settings.get(target);
  event.reply('GetSettings', target, settingsData);
});

ipcMain.on('SetSettings', async (event, target, value) => {
  if (target === 'startMinimized') {
    // Validate value type
    if (typeof value !== 'boolean') {
      event.reply('SetSettings', target, { success: false, message: 'Invalid value type' });
      return;
    }
    await settings.set(target, value);
    const settingsData = await settings.get(target);
    event.reply('SetSettings', target, { success: true, settingsData });
  } else if (target === 'startOnLogin') {
    // Validate value type
    if (typeof value !== 'boolean') {
      event.reply('SetSettings', target, { success: false, message: 'Invalid value type' });
      return;
    }

    // Configure startup settings
    app.setLoginItemSettings({
      openAtLogin: value, // true to add, false to remove
      path: app.getPath('exe'), // Path to your executable
      args: [] // Optional arguments
    });
    await settings.set(target, value);
    const settingsData = await settings.get(target);
    event.reply('SetSettings', target, { success: true, settingsData });
  }
});


// Set needed variables for development and production

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
const isMacOS = process.platform === 'darwin';
export const enableAutoUpdates = true;
const startMinimized = settings.getSync('startMinimized') || false;

if (isDebug) {
  require('electron-debug').default();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

export const createSettingsWindow = async () => {
  await syncLoginItemSetting();
  if (!settingsWindow) {
    settingsWindow = new BrowserWindow({
      width: 457,
      height: 537,
      resizable: false,
      titleBarStyle: 'hiddenInset',
      webPreferences: {
        preload: app.isPackaged
          ? path.join(__dirname, 'preload.js')
          : path.join(__dirname, '../../.erb/dll/preload.js'),
      },
    });
    settingsWindow.loadURL(resolveHtmlPath('index.html') + '#/settings');
  } else {
    settingsWindow.focus();
  }

  settingsWindow.on('closed', () => {
    settingsWindow = null;
  });
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 800,
    height: 600,
    resizable: false,
    titleBarStyle: 'hiddenInset',
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });
  mainWindow.loadURL(resolveHtmlPath('index.html') + '#/');

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (startMinimized) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  if (enableAutoUpdates) {
    new AppUpdater();
  }
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // macOS convention: keep the app running after the last window is closed.
  if (!isMacOS) {
    app.quit();
  }
});

app
  .whenReady()
  .then(async () => {
    if (!isMacOS) {
      log.warn(`${app.getName()} is a macOS-only application. Quitting on unsupported platform.`);
      app.quit();
      return;
    }

    await initializeDefaultSettings();
    await syncLoginItemSetting();
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);


