import { useState, useEffect } from 'react';
import './Content.css';
import ContentCheckbox from './ContentCheckbox';

interface ElectronAPI {
  ipcRenderer: {
    sendMessage(channel: string, ...args: unknown[]): void;
    on(
      channel: string,
      func: (...args: unknown[]) => void,
    ): (() => void) | undefined;
    once(channel: string, func: (...args: unknown[]) => void): void;
  };
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

export default function Content() {
  const [startMinimized, setStartMinimized] = useState(false);
  const [startOnLogin, setStartOnLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from main process on mount
  useEffect(() => {
    setIsLoading(true);
    window.electron?.ipcRenderer?.on(
      'GetSettings',
      (target: string, value: any) => {
        if (target === 'startMinimized') {
          setStartMinimized(Boolean(value));
        } else if (target === 'startOnLogin') {
          setStartOnLogin(Boolean(value));
        }
        setIsLoading(false);
      },
    );
    window.electron?.ipcRenderer?.sendMessage('GetSettings', 'startMinimized');
    window.electron?.ipcRenderer?.sendMessage('GetSettings', 'startOnLogin');
  }, []);

  /* The `handleSaveSettings` function is a callback function that is triggered when the "Save
  Settings" button is clicked. Inside this function, it sends a message to the main process using
  Electron's IPC (Inter-Process Communication) mechanism to update the application settings with the
  new value of `startMinimized`. This allows the user to save their preference for whether the app
  should start minimized or not. */
  const handleSaveSettings = () => {
    window.electron?.ipcRenderer?.sendMessage(
      'SetSettings',
      'startMinimized',
      startMinimized,
    );
    window.electron?.ipcRenderer?.sendMessage(
      'SetSettings',
      'startOnLogin',
      startOnLogin,
    );
  };

  if (isLoading) {
    return <div className="utility-content">Loading settings...</div>;
  }

  return (
    <div className="utility-content">
      <ContentCheckbox
        checkboxId="startMinimized"
        currentBoolean={startMinimized}
        updateBoolean={setStartMinimized}
        labelText="Start app minimized"
      />
      <ContentCheckbox
        checkboxId="startOnLogin"
        currentBoolean={startOnLogin}
        updateBoolean={setStartOnLogin}
        labelText="Start on login"
      />
      <button
        type="button"
        className="settings-save-button"
        data-node-id="13:544"
        onClick={handleSaveSettings}
      >
        Save Settings
      </button>
    </div>
  );
}
