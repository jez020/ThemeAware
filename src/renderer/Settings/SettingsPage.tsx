import TitleBar from './components/TitleBar';
import Navigation from './components/Navigation';
import './SettingsPage.css';

export default function SettingsPage() {
  return (
    <div className="utility-panel" data-node-id="9:840">
      <header className="utility-header" data-node-id="I9:840;586:181">
        <TitleBar emoji="⚙️" title="Settings" />
        <Navigation text1="General" />
      </header>
      <div className="utility-content" />
    </div>
  );
}
