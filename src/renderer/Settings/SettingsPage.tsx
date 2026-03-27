import TitleBar from './components/TitleBar';
import Navigation from './components/Navigation';
import './SettingsPage.css';
import Content from './components/Content';

export default function SettingsPage() {
  return (
    <div className="settings-root" data-node-id="13:133">
      <div className="utility-panel" data-node-id="9:840">
        <header className="utility-header" data-node-id="I9:840;586:181">
          <TitleBar emoji="⚙️" title="Settings" />
          <Navigation />
        </header>
        <Content />
      </div>
    </div>
  );
}
