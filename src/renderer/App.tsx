import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

function ThemeAwareHome() {
  return (
    <main className="theme-aware-app">
      <section className="design-frame" data-node-id="6:3">
        <div className="title-drag-region" aria-hidden="true" />
        <p className="window-title" data-node-id="8:25">
          ThemeAware
        </p>
        <div className="accent-card" data-node-id="6:7">
          <article className="upload-panel upload-panel-light" data-node-id="8:29">
            <p className="upload-panel-text" data-node-id="8:33">
              Upload Light
              <br />
              Theme Image
            </p>
          </article>
          <article className="upload-panel upload-panel-dark" data-node-id="8:32">
            <p className="upload-panel-text" data-node-id="8:36">
              Upload Light
              <br />
              Theme Image
            </p>
          </article>
          <div className="accent-divider" />
        </div>
      </section>
    </main>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ThemeAwareHome />} />
      </Routes>
    </Router>
  );
}
