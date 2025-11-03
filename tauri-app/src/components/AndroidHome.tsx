import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import Settings, { FluidConfig } from './Settings';
import { ColorPreset, COLOR_PRESETS } from './ThemeCustomizer';
import './AndroidHome.css';

interface AndroidHomeProps {
  onPermissionGranted: () => void;
}

function AndroidHome({ onPermissionGranted }: AndroidHomeProps): JSX.Element {
  const [hasPermission, setHasPermission] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<ColorPreset>(COLOR_PRESETS[0]);
  const [config, setConfig] = useState<FluidConfig>({
    PRESSURE: 0.1,
    CURL: 3,
    SPLAT_RADIUS: 0.2,
    SPLAT_FORCE: 6000,
    DENSITY_DISSIPATION: 3.5,
    VELOCITY_DISSIPATION: 2,
    COLOR_UPDATE_SPEED: 10,
    SHADING: true,
  });

  useEffect(() => {
    checkOverlayPermission();
    // Load saved settings
    const savedConfig = localStorage.getItem('fluidConfig');
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (e) {
        console.error('Failed to load config:', e);
      }
    }
    const savedPreset = localStorage.getItem('colorPreset');
    if (savedPreset) {
      try {
        setSelectedPreset(JSON.parse(savedPreset));
      } catch (e) {
        console.error('Failed to load preset:', e);
      }
    }
  }, []);

  const checkOverlayPermission = async (): Promise<void> => {
    try {
      const granted = await invoke<boolean>('check_overlay_permission');
      setHasPermission(granted);
      if (granted) {
        setTimeout(() => onPermissionGranted(), 1000);
      }
    } catch (e) {
      console.error('Failed to check overlay permission:', e);
    } finally {
      setIsChecking(false);
    }
  };

  const requestPermission = async (): Promise<void> => {
    try {
      await invoke('request_overlay_permission');
      setTimeout(() => checkOverlayPermission(), 500);
    } catch (e) {
      console.error('Failed to request overlay permission:', e);
    }
  };

  const startOverlay = (): void => {
    onPermissionGranted();
  };

  const handleConfigChange = (newConfig: FluidConfig): void => {
    setConfig(newConfig);
    localStorage.setItem('fluidConfig', JSON.stringify(newConfig));
  };

  const handlePresetChange = (preset: ColorPreset): void => {
    setSelectedPreset(preset);
    localStorage.setItem('colorPreset', JSON.stringify(preset));
  };

  if (showSettings) {
    return (
      <Settings
        isOpen={true}
        onClose={() => setShowSettings(false)}
        config={config}
        onConfigChange={handleConfigChange}
      />
    );
  }

  if (showColorPicker) {
    return (
      <div className="android-home">
        <div className="color-picker-panel">
          <div className="panel-header">
            <button className="back-btn" onClick={() => setShowColorPicker(false)}>
              ← Back
            </button>
            <h2>Color Themes</h2>
          </div>
          <div className="color-presets-grid">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.name}
                className={`color-preset-card ${selectedPreset.name === preset.name ? 'active' : ''}`}
                onClick={() => {
                  handlePresetChange(preset);
                  setShowColorPicker(false);
                }}
              >
                <div
                  className="preset-preview"
                  style={{
                    background: `linear-gradient(135deg, 
                    hsl(${(preset.hueRange?.[0] ?? 0) * 360}, ${(preset.saturation ?? 1) * 100}%, ${(preset.brightness ?? 0.5) * 50}%), 
                    hsl(${(preset.hueRange?.[1] ?? 1) * 360}, ${(preset.saturation ?? 1) * 100}%, ${(preset.brightness ?? 0.5) * 50}%))`,
                  }}
                ></div>
                <div className="preset-name">{preset.name}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="android-home">
      <div className="glass-container">
        <div className="neon-border"></div>

        <div className="logo-section">
          <div className="logo-glow"></div>
          <h1 className="app-title">
            <span className="title-magic">Magic</span>
            <span className="title-cursor">Cursor</span>
          </h1>
          <p className="app-subtitle">Touch Effects Overlay</p>
        </div>

        <div className="feature-grid">
          <button className="feature-card" onClick={() => setShowColorPicker(true)}>
            <div className="feature-icon">🎨</div>
            <div className="feature-text">Colors</div>
          </button>
          <button className="feature-card" onClick={() => setShowSettings(true)}>
            <div className="feature-icon">⚙️</div>
            <div className="feature-text">Settings</div>
          </button>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <div className="feature-text">Optimized</div>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌈</div>
            <div className="feature-text">Fluid</div>
          </div>
        </div>

        {isChecking ? (
          <div className="loading-section">
            <div className="spinner"></div>
            <p>Checking permissions...</p>
          </div>
        ) : !hasPermission ? (
          <div className="permission-section">
            <div className="permission-icon">🔒</div>
            <h2>Overlay Permission Required</h2>
            <p>Magic Cursor needs permission to display effects over other apps</p>
            <button className="neon-button" onClick={requestPermission}>
              <span className="button-glow"></span>
              <span className="button-text">Grant Permission</span>
            </button>
          </div>
        ) : (
          <div className="ready-section">
            <div className="success-icon">✓</div>
            <h2>Ready to Go!</h2>
            <p>All permissions granted</p>
            <button className="neon-button start-button" onClick={startOverlay}>
              <span className="button-glow"></span>
              <span className="button-text">Start Magic Cursor</span>
            </button>
          </div>
        )}

        <div className="footer-text">Tap cards above to customize</div>
      </div>
    </div>
  );
}

export default AndroidHome;
