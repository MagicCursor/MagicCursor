import * as React from 'react';
import {
  getSettings,
  saveSettings,
  DEFAULT_SETTINGS,
  CursorSettings,
} from '../utils/storage';

import './styles.scss';

const Options: React.FC = () => {
  const [settings, setSettings] =
    React.useState<CursorSettings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = React.useState(false);

  React.useEffect(() => {
    getSettings().then(setSettings);
  }, []);

  const handleChange = (
    key: keyof CursorSettings,
    value: number | boolean
  ): void => {
    const newSettings = {...settings, [key]: value};
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

  return (
    <div className="options-container">
      <header>
        <h1>✨ Magic Cursor Settings</h1>
        <p>Customize your fluid mouse trail experience</p>
        <p className="auto-save-note">
          💾 Changes are saved automatically as you adjust them
        </p>
      </header>

      <div className="settings-grid">
        <section className="settings-section">
          <h2>General</h2>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) => handleChange('enabled', e.target.checked)}
              />
              <span>Enable Magic Cursor</span>
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.shading}
                onChange={(e) => handleChange('shading', e.target.checked)}
              />
              <span>Enable 3D Shading</span>
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.transparent}
                onChange={(e) => handleChange('transparent', e.target.checked)}
              />
              <span>Transparent Background</span>
            </label>
          </div>
        </section>

        <section className="settings-section">
          <h2>Visual Quality</h2>
          <div className="setting-item">
            <label>
              <span>Simulation Resolution</span>
              <span className="value">{settings.simResolution}</span>
            </label>
            <input
              type="range"
              min="64"
              max="512"
              step="32"
              value={settings.simResolution}
              onChange={(e) =>
                handleChange('simResolution', parseInt(e.target.value))
              }
            />
            <small>Higher = better quality, lower performance</small>
          </div>
          <div className="setting-item">
            <label>
              <span>Dye Resolution</span>
              <span className="value">{settings.dyeResolution}</span>
            </label>
            <input
              type="range"
              min="256"
              max="2048"
              step="128"
              value={settings.dyeResolution}
              onChange={(e) =>
                handleChange('dyeResolution', parseInt(e.target.value))
              }
            />
            <small>Color detail quality</small>
          </div>
        </section>

        <section className="settings-section">
          <h2>Fluid Behavior</h2>
          <div className="setting-item">
            <label>
              <span>Pressure</span>
              <span className="value">{settings.pressure.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={settings.pressure}
              onChange={(e) =>
                handleChange('pressure', parseFloat(e.target.value))
              }
            />
            <small>Fluid pressure intensity</small>
          </div>
          <div className="setting-item">
            <label>
              <span>Curl (Vorticity)</span>
              <span className="value">{settings.curl}</span>
            </label>
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              value={settings.curl}
              onChange={(e) => handleChange('curl', parseInt(e.target.value))}
            />
            <small>Swirling motion strength</small>
          </div>
          <div className="setting-item">
            <label>
              <span>Density Dissipation</span>
              <span className="value">
                {settings.densityDissipation.toFixed(1)}
              </span>
            </label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={settings.densityDissipation}
              onChange={(e) =>
                handleChange('densityDissipation', parseFloat(e.target.value))
              }
            />
            <small>How fast colors fade</small>
          </div>
          <div className="setting-item">
            <label>
              <span>Velocity Dissipation</span>
              <span className="value">
                {settings.velocityDissipation.toFixed(1)}
              </span>
            </label>
            <input
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={settings.velocityDissipation}
              onChange={(e) =>
                handleChange('velocityDissipation', parseFloat(e.target.value))
              }
            />
            <small>How fast motion slows down</small>
          </div>
        </section>

        <section className="settings-section">
          <h2>Mouse Interaction</h2>
          <div className="setting-item">
            <label>
              <span>Splat Force</span>
              <span className="value">{settings.splatForce}</span>
            </label>
            <input
              type="range"
              min="1000"
              max="15000"
              step="500"
              value={settings.splatForce}
              onChange={(e) =>
                handleChange('splatForce', parseInt(e.target.value))
              }
            />
            <small>Mouse movement impact strength</small>
          </div>
          <div className="setting-item">
            <label>
              <span>Splat Radius</span>
              <span className="value">{settings.splatRadius.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.01"
              value={settings.splatRadius}
              onChange={(e) =>
                handleChange('splatRadius', parseFloat(e.target.value))
              }
            />
            <small>Size of mouse trail effect</small>
          </div>
          <div className="setting-item">
            <label>
              <span>Color Change Speed</span>
              <span className="value">{settings.colorUpdateSpeed}</span>
            </label>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={settings.colorUpdateSpeed}
              onChange={(e) =>
                handleChange('colorUpdateSpeed', parseInt(e.target.value))
              }
            />
            <small>How fast colors cycle</small>
          </div>
        </section>

        <section className="settings-section">
          <h2>Advanced</h2>
          <div className="setting-item">
            <label>
              <span>Pressure Iterations</span>
              <span className="value">{settings.pressureIterations}</span>
            </label>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={settings.pressureIterations}
              onChange={(e) =>
                handleChange('pressureIterations', parseInt(e.target.value))
              }
            />
            <small>Simulation accuracy (higher = slower)</small>
          </div>
        </section>
      </div>

      {saved && <div className="save-indicator">✓ Auto-saved!</div>}

      <div className="actions">
        <button type="button" className="btn-secondary" onClick={handleReset}>
          Reset to Defaults
        </button>
      </div>
    </div>
  );
};

export default Options;
