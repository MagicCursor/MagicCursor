import * as React from 'react';
import {browser, Tabs} from 'webextension-polyfill-ts';
import {getSettings, saveSettings} from '../utils/storage';

import './styles.scss';

function openWebPage(url: string): Promise<Tabs.Tab> {
  return browser.tabs.create({url});
}

const Popup: React.FC = () => {
  const [enabled, setEnabled] = React.useState(true);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getSettings().then((settings) => {
      setEnabled(settings.enabled);
      setLoading(false);
    });
  }, []);

  const toggleEnabled = async (): Promise<void> => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    await saveSettings({enabled: newEnabled});
  };

  const openOptions = (): void => {
    openWebPage('options.html').catch(console.error);
  };

  if (loading) {
    return (
      <section id="popup">
        <div className="loading">Loading...</div>
      </section>
    );
  }

  return (
    <section id="popup">
      <div className="header">
        <h1>✨ Magic Cursor</h1>
        <p>Fluid Mouse Trail</p>
      </div>

      <div className="toggle-container">
        <label className="toggle-switch">
          <input type="checkbox" checked={enabled} onChange={toggleEnabled} />
          <span className="slider" />
        </label>
        <span className="toggle-label">{enabled ? 'Enabled' : 'Disabled'}</span>
      </div>

      <div className="status">
        {enabled ? (
          <p className="status-enabled">
            ✓ Magic Cursor is active on all websites
          </p>
        ) : (
          <p className="status-disabled">Magic Cursor is currently disabled</p>
        )}
      </div>

      <button type="button" className="btn-options" onClick={openOptions}>
        ⚙️ Customize Settings
      </button>

      <div className="footer">
        <a
          href="https://github.com/magic-cursor/magic-cursor"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <span>•</span>
        <button
          type="button"
          className="link-button"
          onClick={(): void => {
            openWebPage('options.html').catch(console.error);
          }}
        >
          Help
        </button>
      </div>
    </section>
  );
};

export default Popup;
