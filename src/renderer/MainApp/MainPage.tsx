import { useState, useEffect } from 'react';
import './MainPage.css';
import UploadWrapper from './components/UploadWrapper';
import OptionButtons from './components/OptionButtons';

export default function MainApp() {
  const [appName, setAppName] = useState<string>('Getting App Name...'); // Example of using
  useEffect(() => {
    window.electron?.ipcRenderer.once('AppName', (arg) => {
      if (typeof arg === 'string') setAppName(arg);
    });
    window.electron?.ipcRenderer.sendMessage('AppName', []);
  }, []);

  return (
    <main className="theme-aware-app">
      <section className="design-frame" data-node-id="6:3">
        <div className="title-drag-region" aria-hidden="true" />
        <p className="window-title" data-node-id="8:25">
          {appName}
        </p>
        <UploadWrapper />
        <OptionButtons />
      </section>
    </main>
  );
}
