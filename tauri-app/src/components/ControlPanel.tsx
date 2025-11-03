import './ControlPanel.css';

export interface ColorPreset {
  name: string;
  hueRange: [number, number];
  saturation: number;
  brightness: number;
  icon: string;
}

interface ControlPanelProps {
  onPresetChange: (preset: ColorPreset) => void;
  currentPreset: ColorPreset;
  onOpenCustomizer?: () => void;
}

export const COLOR_PRESETS: ColorPreset[] = [
  {
    name: 'Rainbow',
    hueRange: [0, 1],
    saturation: 1.0,
    brightness: 1.0,
    icon: '🌈',
  },
  {
    name: 'Neon Pink',
    hueRange: [0.9, 1.0],
    saturation: 1.0,
    brightness: 1.0,
    icon: '💖',
  },
  {
    name: 'Cyber Blue',
    hueRange: [0.5, 0.65],
    saturation: 1.0,
    brightness: 1.0,
    icon: '💎',
  },
  {
    name: 'Toxic Green',
    hueRange: [0.25, 0.35],
    saturation: 1.0,
    brightness: 1.0,
    icon: '☢️',
  },
  {
    name: 'Purple Dream',
    hueRange: [0.7, 0.85],
    saturation: 1.0,
    brightness: 1.0,
    icon: '🔮',
  },
  {
    name: 'Fire',
    hueRange: [0.0, 0.15],
    saturation: 1.0,
    brightness: 1.0,
    icon: '🔥',
  },
  {
    name: 'Ice',
    hueRange: [0.5, 0.6],
    saturation: 0.8,
    brightness: 1.0,
    icon: '❄️',
  },
  {
    name: 'Gold',
    hueRange: [0.12, 0.18],
    saturation: 1.0,
    brightness: 1.0,
    icon: '✨',
  },
];

export default function ControlPanel({
  onPresetChange,
  currentPreset,
  onOpenCustomizer,
}: ControlPanelProps): JSX.Element {
  return (
    <div className="control-panel">
      {currentPreset && (
        <div className="control-content">
          <div className="control-header">
            <h2>Color Presets</h2>
            <div className="current-preset">
              <span className="preset-icon">{currentPreset.icon}</span>
              <span className="preset-name">{currentPreset.name}</span>
            </div>
          </div>

          <div className="presets-grid">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                className={`preset-card ${
                  currentPreset.name === preset.name ? 'active' : ''
                }`}
                onClick={() => onPresetChange(preset)}
              >
                <div className="preset-icon-large">{preset.icon}</div>
                <div className="preset-info">
                  <span className="preset-label">{preset.name}</span>
                  <div
                    className="preset-preview"
                    style={{
                      background: `linear-gradient(135deg, 
                        hsl(${preset.hueRange[0] * 360}, ${preset.saturation * 100}%, ${preset.brightness * 50}%), 
                        hsl(${preset.hueRange[1] * 360}, ${preset.saturation * 100}%, ${preset.brightness * 50}%))`,
                    }}
                  />
                </div>
              </button>
            ))}
          </div>

          <div className="control-footer">
            <p className="hint">Choose a color theme for your cursor effects</p>
            {onOpenCustomizer && (
              <button className="customizer-btn" onClick={onOpenCustomizer}>
                🎨 Create Custom Theme
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
