import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import MainApp from './MainApp/MainPage';
import SettingsPage from './Settings/SettingsPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </Router>
  );
}
