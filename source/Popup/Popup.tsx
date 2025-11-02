import * as React from "react";
import { browser, Tabs } from "webextension-polyfill-ts";
import {
  getSettings,
  saveSettings,
  DEFAULT_SETTINGS,
  CursorSettings,
} from "../utils/storage";

import "./styles.scss";

function openWebPage(url: string): Promise<Tabs.Tab> {
  return browser.tabs.create({ url });
}

const Popup: React.FC = () => {
  const [settings, setSettings] =
    React.useState<CursorSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = React.useState(true);
  const [showSettings, setShowSettings] = React.useState(false);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    getSettings().then((loadedSettings) => {
      setSettings(loadedSettings);
      setLoading(false);
    });
  }, []);

  const handleChange = (
    key: keyof CursorSettings,
    value: number | boolean
  ): void => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveSettings(newSettings).then(() => {
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    });
  };

  const handleReset = async (): Promise<void> => {
    setSettings(DEFAULT_SETTINGS);
    await saveSettings(DEFAULT_SETTINGS);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const openOptions = (): void => {
    openWebPage("options.html").catch(console.error);
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
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e): void => handleChange("enabled", e.target.checked)}
          />
          <span className="slider" />
        </label>
        <span className="toggle-label">
          {settings.enabled ? "Enabled" : "Disabled"}
        </span>
      </div>

      <div className="status">
        {settings.enabled ? (
          <p className="status-enabled">
            ✓ Magic Cursor is active on all websites
          </p>
        ) : (
          <p className="status-disabled">Magic Cursor is currently disabled</p>
        )}
      </div>

      <button
        type="button"
        className="btn-settings-toggle"
        onClick={(): void => setShowSettings(!showSettings)}
      >
        {showSettings ? "▲ Hide Settings" : "▼ Show Settings"}
      </button>

      {showSettings && (
        <div className="settings-panel">
          <div className="settings-section">
            <h3>Visual Quality</h3>
            <div className="setting-item">
              <label>
                <span>Simulation Quality</span>
                <span className="value">{settings.simResolution}</span>
              </label>
              <input
                type="range"
                min="64"
                max="256"
                step="32"
                value={settings.simResolution}
                onChange={(e): void =>
                  handleChange("simResolution", parseInt(e.target.value, 10))
                }
              />
            </div>
            <div className="setting-item">
              <label>
                <span>Color Detail</span>
                <span className="value">{settings.dyeResolution}</span>
              </label>
              <input
                type="range"
                min="512"
                max="2048"
                step="128"
                value={settings.dyeResolution}
                onChange={(e): void =>
                  handleChange("dyeResolution", parseInt(e.target.value, 10))
                }
              />
            </div>
          </div>

          <div className="settings-section">
            <h3>Fluid Behavior</h3>
            <div className="setting-item">
              <label>
                <span>Swirl Strength</span>
                <span className="value">{settings.curl}</span>
              </label>
              <input
                type="range"
                min="0"
                max="30"
                step="1"
                value={settings.curl}
                onChange={(e): void =>
                  handleChange("curl", parseInt(e.target.value, 10))
                }
              />
            </div>
            <div className="setting-item">
              <label>
                <span>Fade Speed</span>
                <span className="value">
                  {settings.densityDissipation.toFixed(1)}
                </span>
              </label>
              <input
                type="range"
                min="0.5"
                max="8"
                step="0.5"
                value={settings.densityDissipation}
                onChange={(e): void =>
                  handleChange("densityDissipation", parseFloat(e.target.value))
                }
              />
            </div>
          </div>

          <div className="settings-section">
            <h3>Mouse Trail</h3>
            <div className="setting-item">
              <label>
                <span>Trail Strength</span>
                <span className="value">{settings.splatForce}</span>
              </label>
              <input
                type="range"
                min="2000"
                max="12000"
                step="500"
                value={settings.splatForce}
                onChange={(e): void =>
                  handleChange("splatForce", parseInt(e.target.value, 10))
                }
              />
            </div>
            <div className="setting-item">
              <label>
                <span>Trail Size</span>
                <span className="value">{settings.splatRadius.toFixed(2)}</span>
              </label>
              <input
                type="range"
                min="0.05"
                max="0.4"
                step="0.01"
                value={settings.splatRadius}
                onChange={(e): void =>
                  handleChange("splatRadius", parseFloat(e.target.value))
                }
              />
            </div>
            <div className="setting-item">
              <label>
                <span>Color Speed</span>
                <span className="value">{settings.colorUpdateSpeed}</span>
              </label>
              <input
                type="range"
                min="1"
                max="30"
                step="1"
                value={settings.colorUpdateSpeed}
                onChange={(e): void =>
                  handleChange("colorUpdateSpeed", parseInt(e.target.value, 10))
                }
              />
            </div>
          </div>

          <div className="settings-section">
            <h3>Effects</h3>
            <div className="setting-item checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={settings.shading}
                  onChange={(e): void =>
                    handleChange("shading", e.target.checked)
                  }
                />
                <span>3D Shading</span>
              </label>
            </div>
            <div className="setting-item checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={settings.transparent}
                  onChange={(e): void =>
                    handleChange("transparent", e.target.checked)
                  }
                />
                <span>Transparent Background</span>
              </label>
            </div>
          </div>

          <div className="settings-actions">
            <button type="button" className="btn-reset" onClick={handleReset}>
              Reset Defaults
            </button>
            <button
              type="button"
              className="btn-advanced"
              onClick={openOptions}
            >
              Advanced Settings
            </button>
          </div>

          {saved && <div className="save-indicator">✓ Saved!</div>}
        </div>
      )}

      <div className="footer">
        <a
          href="https://github.com/magic-cursor/magic-cursor"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>
    </section>
  );
};

export default Popup;
