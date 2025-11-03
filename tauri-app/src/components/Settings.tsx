import { useEffect, useState } from 'react';
import './Settings.css';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  config: FluidConfig;
  onConfigChange: (config: FluidConfig) => void;
}

export interface FluidConfig {
  PRESSURE: number;
  CURL: number;
  SPLAT_RADIUS: number;
  SPLAT_FORCE: number;
  DENSITY_DISSIPATION: number;
  VELOCITY_DISSIPATION: number;
  COLOR_UPDATE_SPEED: number;
  SHADING: boolean;
}

export default function Settings({
  isOpen,
  onClose,
  config,
  onConfigChange,
}: SettingsProps): JSX.Element | null {
  const [localConfig, setLocalConfig] = useState<FluidConfig>(config);

  useEffect(() => {
    setLocalConfig(config);
  }, [config]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (key: keyof FluidConfig, value: number | boolean): void => {
    const newConfig = { ...localConfig, [key]: value };
    setLocalConfig(newConfig);
    onConfigChange(newConfig);
  };

  const presets = {
    default: {
      PRESSURE: 0.1,
      CURL: 3,
      SPLAT_RADIUS: 0.2,
      SPLAT_FORCE: 6000,
      DENSITY_DISSIPATION: 3.5,
      VELOCITY_DISSIPATION: 2,
      COLOR_UPDATE_SPEED: 10,
      SHADING: true,
    },
    subtle: {
      PRESSURE: 0.05,
      CURL: 1,
      SPLAT_RADIUS: 0.15,
      SPLAT_FORCE: 3000,
      DENSITY_DISSIPATION: 5,
      VELOCITY_DISSIPATION: 3,
      COLOR_UPDATE_SPEED: 5,
      SHADING: true,
    },
    intense: {
      PRESSURE: 0.2,
      CURL: 10,
      SPLAT_RADIUS: 0.3,
      SPLAT_FORCE: 12000,
      DENSITY_DISSIPATION: 1,
      VELOCITY_DISSIPATION: 0.5,
      COLOR_UPDATE_SPEED: 20,
      SHADING: true,
    },
  };

  const applyPreset = (preset: keyof typeof presets): void => {
    const newConfig = presets[preset];
    setLocalConfig(newConfig);
    onConfigChange(newConfig);
  };

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-panel" onClick={(e) => e.stopPropagation()}>
        <div className="settings-header">
          <h2>Fluid Settings</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="settings-content">
          <div className="presets-section">
            <h3>Presets</h3>
            <div className="preset-buttons">
              <button onClick={() => applyPreset('subtle')}>Subtle</button>
              <button onClick={() => applyPreset('default')}>Default</button>
              <button onClick={() => applyPreset('intense')}>Intense</button>
            </div>
          </div>

          <div className="settings-group">
            <label>
              <span>Pressure</span>
              <span className="value">{localConfig.PRESSURE.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={localConfig.PRESSURE}
              onChange={(e) => handleChange('PRESSURE', parseFloat(e.target.value))}
            />
          </div>

          <div className="settings-group">
            <label>
              <span>Curl</span>
              <span className="value">{localConfig.CURL.toFixed(1)}</span>
            </label>
            <input
              type="range"
              min="0"
              max="30"
              step="0.5"
              value={localConfig.CURL}
              onChange={(e) => handleChange('CURL', parseFloat(e.target.value))}
            />
          </div>

          <div className="settings-group">
            <label>
              <span>Splat Radius</span>
              <span className="value">{localConfig.SPLAT_RADIUS.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min="0.05"
              max="0.5"
              step="0.01"
              value={localConfig.SPLAT_RADIUS}
              onChange={(e) => handleChange('SPLAT_RADIUS', parseFloat(e.target.value))}
            />
          </div>

          <div className="settings-group">
            <label>
              <span>Splat Force</span>
              <span className="value">{localConfig.SPLAT_FORCE.toFixed(0)}</span>
            </label>
            <input
              type="range"
              min="1000"
              max="20000"
              step="100"
              value={localConfig.SPLAT_FORCE}
              onChange={(e) => handleChange('SPLAT_FORCE', parseFloat(e.target.value))}
            />
          </div>

          <div className="settings-group">
            <label>
              <span>Density Dissipation</span>
              <span className="value">{localConfig.DENSITY_DISSIPATION.toFixed(1)}</span>
            </label>
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={localConfig.DENSITY_DISSIPATION}
              onChange={(e) => handleChange('DENSITY_DISSIPATION', parseFloat(e.target.value))}
            />
          </div>

          <div className="settings-group">
            <label>
              <span>Velocity Dissipation</span>
              <span className="value">{localConfig.VELOCITY_DISSIPATION.toFixed(1)}</span>
            </label>
            <input
              type="range"
              min="0.1"
              max="10"
              step="0.1"
              value={localConfig.VELOCITY_DISSIPATION}
              onChange={(e) => handleChange('VELOCITY_DISSIPATION', parseFloat(e.target.value))}
            />
          </div>

          <div className="settings-group">
            <label>
              <span>Color Update Speed</span>
              <span className="value">{localConfig.COLOR_UPDATE_SPEED.toFixed(0)}</span>
            </label>
            <input
              type="range"
              min="1"
              max="50"
              step="1"
              value={localConfig.COLOR_UPDATE_SPEED}
              onChange={(e) => handleChange('COLOR_UPDATE_SPEED', parseFloat(e.target.value))}
            />
          </div>

          <div className="settings-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={localConfig.SHADING}
                onChange={(e) => handleChange('SHADING', e.target.checked)}
              />
              <span>Enable Shading</span>
            </label>
          </div>
        </div>

        <div className="settings-footer">
          <p className="hint">Press ESC to close</p>
        </div>
      </div>
    </div>
  );
}
