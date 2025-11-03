import {useState, useEffect, useRef} from 'react';
import './ColorCustomizer.css';

export interface CustomColor {
  id: string;
  name: string;
  hue: number;
  saturation: number;
  brightness: number;
  weight: number;
  opacity: number;
}

export interface ColorTheme {
  id: string;
  name: string;
  colors: CustomColor[];
  blendMode: 'smooth' | 'distinct' | 'random' | 'radial' | 'wave';
  speed: number;
  intensity: number;
  rotation: number;
  scale: number;
}

interface ColorCustomizerProps {
  onClose: () => void;
  onSave: (theme: ColorTheme) => void;
  initialTheme?: ColorTheme;
}

export default function ColorCustomizer({
  onClose,
  onSave,
  initialTheme,
}: ColorCustomizerProps): JSX.Element {
  const [theme, setTheme] = useState<ColorTheme>(
    initialTheme || {
      id: Date.now().toString(),
      name: 'Custom Theme',
      colors: [
        {
          id: '1',
          name: 'Color 1',
          hue: 0.5,
          saturation: 1.0,
          brightness: 1.0,
          weight: 1.0,
          opacity: 1.0,
        },
      ],
      blendMode: 'smooth',
      speed: 10,
      intensity: 1.0,
      rotation: 0,
      scale: 1.0,
    }
  );

  const [colorPickerMode, setColorPickerMode] = useState<'wheel' | 'slider'>(
    'wheel'
  );
  const [showAdvanced, setShowAdvanced] = useState(false);
  const colorWheelRef = useRef<HTMLCanvasElement>(null);

  const [selectedColorId, setSelectedColorId] = useState<string>(
    theme.colors[0]?.id || '1'
  );
  const [previewAnimation, setPreviewAnimation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPreviewAnimation((prev) => (prev + 0.01) % 1);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const selectedColor = theme.colors.find((c) => c.id === selectedColorId);

  const updateColor = (id: string, updates: Partial<CustomColor>): void => {
    setTheme((prev) => ({
      ...prev,
      colors: prev.colors.map((c) => (c.id === id ? {...c, ...updates} : c)),
    }));
  };

  const addColor = (): void => {
    const newColor: CustomColor = {
      id: Date.now().toString(),
      name: `Color ${theme.colors.length + 1}`,
      hue: Math.random(),
      saturation: 1.0,
      brightness: 1.0,
      weight: 1.0,
      opacity: 1.0,
    };
    setTheme((prev) => ({
      ...prev,
      colors: [...prev.colors, newColor],
    }));
    setSelectedColorId(newColor.id);
  };

  const generateComplementary = (): void => {
    if (!selectedColor) return;
    const newColor: CustomColor = {
      id: Date.now().toString(),
      name: `${selectedColor.name} Complement`,
      hue: (selectedColor.hue + 0.5) % 1,
      saturation: selectedColor.saturation,
      brightness: selectedColor.brightness,
      weight: selectedColor.weight,
      opacity: selectedColor.opacity,
    };
    setTheme((prev) => ({
      ...prev,
      colors: [...prev.colors, newColor],
    }));
  };

  const generateAnalogous = (): void => {
    if (!selectedColor) return;
    const offset = 0.083; // 30 degrees
    const newColors: CustomColor[] = [
      {
        id: Date.now().toString(),
        name: `${selectedColor.name} Analogous 1`,
        hue: (selectedColor.hue + offset) % 1,
        saturation: selectedColor.saturation,
        brightness: selectedColor.brightness,
        weight: selectedColor.weight,
        opacity: selectedColor.opacity,
      },
      {
        id: (Date.now() + 1).toString(),
        name: `${selectedColor.name} Analogous 2`,
        hue: (selectedColor.hue - offset + 1) % 1,
        saturation: selectedColor.saturation,
        brightness: selectedColor.brightness,
        weight: selectedColor.weight,
        opacity: selectedColor.opacity,
      },
    ];
    setTheme((prev) => ({
      ...prev,
      colors: [...prev.colors, ...newColors],
    }));
  };

  const generateTriadic = (): void => {
    if (!selectedColor) return;
    const offset = 0.333; // 120 degrees
    const newColors: CustomColor[] = [
      {
        id: Date.now().toString(),
        name: `${selectedColor.name} Triadic 1`,
        hue: (selectedColor.hue + offset) % 1,
        saturation: selectedColor.saturation,
        brightness: selectedColor.brightness,
        weight: selectedColor.weight,
        opacity: selectedColor.opacity,
      },
      {
        id: (Date.now() + 1).toString(),
        name: `${selectedColor.name} Triadic 2`,
        hue: (selectedColor.hue + offset * 2) % 1,
        saturation: selectedColor.saturation,
        brightness: selectedColor.brightness,
        weight: selectedColor.weight,
        opacity: selectedColor.opacity,
      },
    ];
    setTheme((prev) => ({
      ...prev,
      colors: [...prev.colors, ...newColors],
    }));
  };

  const randomizeColors = (): void => {
    setTheme((prev) => ({
      ...prev,
      colors: prev.colors.map((c) => ({
        ...c,
        hue: Math.random(),
        saturation: 0.7 + Math.random() * 0.3,
        brightness: 0.7 + Math.random() * 0.3,
      })),
    }));
  };

  const removeColor = (id: string): void => {
    if (theme.colors.length <= 1) return;
    setTheme((prev) => ({
      ...prev,
      colors: prev.colors.filter((c) => c.id !== id),
    }));
    if (selectedColorId === id) {
      setSelectedColorId(theme.colors[0].id);
    }
  };

  const duplicateColor = (id: string): void => {
    const colorToDuplicate = theme.colors.find((c) => c.id === id);
    if (!colorToDuplicate) return;
    const newColor: CustomColor = {
      ...colorToDuplicate,
      id: Date.now().toString(),
      name: `${colorToDuplicate.name} Copy`,
    };
    setTheme((prev) => ({
      ...prev,
      colors: [...prev.colors, newColor],
    }));
  };

  const hslToRgb = (h: number, s: number, l: number): string => {
    const hue = h * 360;
    return `hsl(${hue}, ${s * 100}%, ${l * 50}%)`;
  };

  const getPreviewGradient = (): string => {
    if (theme.colors.length === 1) {
      const c = theme.colors[0];
      return hslToRgb(c.hue, c.saturation, c.brightness);
    }

    const stops = theme.colors
      .map((c, i) => {
        const position = (i / (theme.colors.length - 1)) * 100;
        return `${hslToRgb(c.hue, c.saturation, c.brightness)} ${position}%`;
      })
      .join(', ');

    return `linear-gradient(90deg, ${stops})`;
  };

  const handleSave = (): void => {
    onSave(theme);
    onClose();
  };

  const presetThemes: Partial<ColorTheme>[] = [
    {
      name: 'Sunset',
      colors: [
        {
          id: '1',
          name: 'Orange',
          hue: 0.08,
          saturation: 1,
          brightness: 1,
          weight: 1,
          opacity: 1,
        },
        {
          id: '2',
          name: 'Pink',
          hue: 0.95,
          saturation: 1,
          brightness: 1,
          weight: 1,
          opacity: 1,
        },
        {
          id: '3',
          name: 'Purple',
          hue: 0.75,
          saturation: 1,
          brightness: 1,
          weight: 1,
          opacity: 1,
        },
      ],
      blendMode: 'smooth',
    },
    {
      name: 'Ocean',
      colors: [
        {
          id: '1',
          name: 'Cyan',
          hue: 0.5,
          saturation: 1,
          brightness: 1,
          weight: 1,
          opacity: 1,
        },
        {
          id: '2',
          name: 'Blue',
          hue: 0.6,
          saturation: 1,
          brightness: 1,
          weight: 1,
          opacity: 1,
        },
        {
          id: '3',
          name: 'Teal',
          hue: 0.48,
          saturation: 0.8,
          brightness: 1,
          weight: 1,
          opacity: 1,
        },
      ],
      blendMode: 'wave',
    },
    {
      name: 'Forest',
      colors: [
        {
          id: '1',
          name: 'Green',
          hue: 0.33,
          saturation: 1,
          brightness: 1,
          weight: 1,
          opacity: 1,
        },
        {
          id: '2',
          name: 'Lime',
          hue: 0.25,
          saturation: 1,
          brightness: 1,
          weight: 1,
          opacity: 1,
        },
        {
          id: '3',
          name: 'Emerald',
          hue: 0.4,
          saturation: 0.9,
          brightness: 1,
          weight: 1,
          opacity: 1,
        },
      ],
      blendMode: 'smooth',
    },
    {
      name: 'Candy',
      colors: [
        {
          id: '1',
          name: 'Pink',
          hue: 0.92,
          saturation: 1,
          brightness: 1,
          weight: 1,
          opacity: 1,
        },
        {
          id: '2',
          name: 'Yellow',
          hue: 0.15,
          saturation: 1,
          brightness: 1,
          weight: 1,
          opacity: 1,
        },
        {
          id: '3',
          name: 'Cyan',
          hue: 0.5,
          saturation: 1,
          brightness: 1,
          weight: 1,
          opacity: 1,
        },
        {
          id: '4',
          name: 'Magenta',
          hue: 0.83,
          saturation: 1,
          brightness: 1,
          weight: 1,
          opacity: 1,
        },
      ],
      blendMode: 'random',
    },
    {
      name: 'Neon',
      colors: [
        {
          id: '1',
          name: 'Electric Blue',
          hue: 0.55,
          saturation: 1,
          brightness: 1,
          weight: 1,
          opacity: 1,
        },
        {
          id: '2',
          name: 'Hot Pink',
          hue: 0.92,
          saturation: 1,
          brightness: 1,
          weight: 1,
          opacity: 1,
        },
        {
          id: '3',
          name: 'Lime',
          hue: 0.28,
          saturation: 1,
          brightness: 1,
          weight: 1,
          opacity: 1,
        },
      ],
      blendMode: 'distinct',
    },
    {
      name: 'Aurora',
      colors: [
        {
          id: '1',
          name: 'Teal',
          hue: 0.48,
          saturation: 0.9,
          brightness: 0.9,
          weight: 1,
          opacity: 0.8,
        },
        {
          id: '2',
          name: 'Purple',
          hue: 0.75,
          saturation: 0.8,
          brightness: 0.9,
          weight: 1,
          opacity: 0.8,
        },
        {
          id: '3',
          name: 'Green',
          hue: 0.35,
          saturation: 0.85,
          brightness: 0.9,
          weight: 1,
          opacity: 0.8,
        },
      ],
      blendMode: 'radial',
    },
    {
      name: 'Monochrome',
      colors: [
        {
          id: '1',
          name: 'White',
          hue: 0,
          saturation: 0,
          brightness: 1,
          weight: 1,
          opacity: 1,
        },
        {
          id: '2',
          name: 'Gray',
          hue: 0,
          saturation: 0,
          brightness: 0.5,
          weight: 1,
          opacity: 1,
        },
      ],
      blendMode: 'smooth',
    },
    {
      name: 'Fire & Ice',
      colors: [
        {
          id: '1',
          name: 'Fire',
          hue: 0.05,
          saturation: 1,
          brightness: 1,
          weight: 1,
          opacity: 1,
        },
        {
          id: '2',
          name: 'Ice',
          hue: 0.55,
          saturation: 0.8,
          brightness: 1,
          weight: 1,
          opacity: 1,
        },
      ],
      blendMode: 'distinct',
    },
  ];

  const applyPreset = (preset: Partial<ColorTheme>): void => {
    setTheme((prev) => ({
      ...prev,
      name: preset.name || prev.name,
      colors: preset.colors || prev.colors,
      blendMode: preset.blendMode || prev.blendMode,
    }));
    if (preset.colors && preset.colors.length > 0) {
      setSelectedColorId(preset.colors[0].id);
    }
  };

  // Draw interactive color wheel
  useEffect(() => {
    if (!colorWheelRef.current || !selectedColor) return;

    const canvas = colorWheelRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw color wheel
    for (let angle = 0; angle < 360; angle++) {
      const startAngle = ((angle - 90) * Math.PI) / 180;
      const endAngle = ((angle + 1 - 90) * Math.PI) / 180;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = `hsl(${angle}, 100%, 50%)`;
      ctx.fill();
    }

    // Draw saturation/brightness gradient
    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      radius
    );
    gradient.addColorStop(
      0,
      `hsla(0, 0%, ${selectedColor.brightness * 100}%, 1)`
    );
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw current color indicator
    const angle = ((selectedColor.hue * 360 - 90) * Math.PI) / 180;
    const indicatorRadius = radius * selectedColor.saturation;
    const indicatorX = centerX + Math.cos(angle) * indicatorRadius;
    const indicatorY = centerY + Math.sin(angle) * indicatorRadius;

    ctx.beginPath();
    ctx.arc(indicatorX, indicatorY, 8, 0, Math.PI * 2);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.stroke();
  }, [selectedColor, colorPickerMode]);

  const handleColorWheelClick = (
    e: React.MouseEvent<HTMLCanvasElement>
  ): void => {
    if (!colorWheelRef.current || !selectedColor) return;

    const canvas = colorWheelRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 10;

    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > radius) return;

    const angle = ((Math.atan2(dy, dx) * 180) / Math.PI + 90 + 360) % 360;
    const hue = angle / 360;
    const saturation = Math.min(distance / radius, 1);

    updateColor(selectedColor.id, {hue, saturation});
  };

  const exportTheme = (): void => {
    const json = JSON.stringify(theme, null, 2);
    const blob = new Blob([json], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${theme.name.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importTheme = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        setTheme(imported);
        if (imported.colors && imported.colors.length > 0) {
          setSelectedColorId(imported.colors[0].id);
        }
      } catch (error) {
        console.error('Failed to import theme:', error);
        alert('Invalid theme file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="color-customizer-overlay" onClick={onClose}>
      <div
        className="color-customizer-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="customizer-header">
          <button className="back-btn" onClick={onClose}>
            ← Back
          </button>
          <input
            type="text"
            className="theme-name-input"
            value={theme.name}
            onChange={(e) =>
              setTheme((prev) => ({...prev, name: e.target.value}))
            }
            placeholder="Theme Name"
          />
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
        </div>

        <div className="customizer-content">
          {/* Preview Section */}
          <div className="preview-section">
            <div
              className="preview-canvas"
              style={{
                background: getPreviewGradient(),
                transform: `rotate(${previewAnimation * 360}deg)`,
              }}
            >
              <div className="preview-overlay">
                <span className="preview-label">Preview</span>
              </div>
            </div>
          </div>

          {/* Preset Themes */}
          <div className="presets-section">
            <h3>Quick Presets</h3>
            <div className="preset-grid">
              {presetThemes.map((preset, index) => (
                <button
                  key={index}
                  className="preset-btn"
                  onClick={() => applyPreset(preset)}
                >
                  <div
                    className="preset-preview"
                    style={{
                      background:
                        preset.colors && preset.colors.length > 1
                          ? `linear-gradient(135deg, ${preset.colors
                              .map((c) =>
                                hslToRgb(c.hue, c.saturation, c.brightness)
                              )
                              .join(', ')})`
                          : preset.colors
                            ? hslToRgb(
                                preset.colors[0].hue,
                                preset.colors[0].saturation,
                                preset.colors[0].brightness
                              )
                            : '#000',
                    }}
                  />
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Color List */}
          <div className="colors-section">
            <div className="section-header">
              <h3>Colors ({theme.colors.length})</h3>
              <button className="add-color-btn" onClick={addColor}>
                + Add Color
              </button>
            </div>
            <div className="color-list">
              {theme.colors.map((color) => (
                <div
                  key={color.id}
                  className={`color-item ${
                    selectedColorId === color.id ? 'active' : ''
                  }`}
                  onClick={() => setSelectedColorId(color.id)}
                >
                  <div
                    className="color-swatch"
                    style={{
                      background: hslToRgb(
                        color.hue,
                        color.saturation,
                        color.brightness
                      ),
                    }}
                  />
                  <input
                    type="text"
                    className="color-name"
                    value={color.name}
                    onChange={(e) =>
                      updateColor(color.id, {name: e.target.value})
                    }
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="color-actions">
                    <button
                      className="icon-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateColor(color.id);
                      }}
                      title="Duplicate"
                    >
                      ⎘
                    </button>
                    {theme.colors.length > 1 && (
                      <button
                        className="icon-btn delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeColor(color.id);
                        }}
                        title="Delete"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Color Editor */}
          {selectedColor && (
            <div className="color-editor">
              <div className="editor-header">
                <h3>Edit {selectedColor.name}</h3>
                <div className="picker-mode-toggle">
                  <button
                    className={colorPickerMode === 'wheel' ? 'active' : ''}
                    onClick={() => setColorPickerMode('wheel')}
                    title="Color Wheel"
                  >
                    ⭕
                  </button>
                  <button
                    className={colorPickerMode === 'slider' ? 'active' : ''}
                    onClick={() => setColorPickerMode('slider')}
                    title="Sliders"
                  >
                    ☰
                  </button>
                </div>
              </div>

              {/* Interactive Color Wheel */}
              {colorPickerMode === 'wheel' && (
                <div className="color-wheel-picker">
                  <canvas
                    ref={colorWheelRef}
                    width={200}
                    height={200}
                    onClick={handleColorWheelClick}
                    style={{cursor: 'crosshair'}}
                  />
                  <div className="wheel-info">
                    <span>H: {Math.round(selectedColor.hue * 360)}°</span>
                    <span>
                      S: {Math.round(selectedColor.saturation * 100)}%
                    </span>
                    <span>
                      B: {Math.round(selectedColor.brightness * 100)}%
                    </span>
                  </div>
                </div>
              )}

              {/* Slider Mode */}
              {colorPickerMode === 'slider' && (
                <>
                  {/* Hue */}
                  <div className="control-group">
                    <label>
                      <span>Hue</span>
                      <span className="value">
                        {Math.round(selectedColor.hue * 360)}°
                      </span>
                    </label>
                    <input
                      type="range"
                      className="hue-slider"
                      min="0"
                      max="1"
                      step="0.001"
                      value={selectedColor.hue}
                      onChange={(e) =>
                        updateColor(selectedColor.id, {
                          hue: parseFloat(e.target.value),
                        })
                      }
                      style={{
                        background:
                          'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
                      }}
                    />
                  </div>

                  {/* Saturation */}
                  <div className="control-group">
                    <label>
                      <span>Saturation</span>
                      <span className="value">
                        {Math.round(selectedColor.saturation * 100)}%
                      </span>
                    </label>
                    <input
                      type="range"
                      className="saturation-slider"
                      min="0"
                      max="1"
                      step="0.01"
                      value={selectedColor.saturation}
                      onChange={(e) =>
                        updateColor(selectedColor.id, {
                          saturation: parseFloat(e.target.value),
                        })
                      }
                      style={{
                        background: `linear-gradient(to right, 
                          hsl(${selectedColor.hue * 360}, 0%, 50%), 
                          hsl(${selectedColor.hue * 360}, 100%, 50%))`,
                      }}
                    />
                  </div>

                  {/* Brightness */}
                  <div className="control-group">
                    <label>
                      <span>Brightness</span>
                      <span className="value">
                        {Math.round(selectedColor.brightness * 100)}%
                      </span>
                    </label>
                    <input
                      type="range"
                      className="brightness-slider"
                      min="0"
                      max="1"
                      step="0.01"
                      value={selectedColor.brightness}
                      onChange={(e) =>
                        updateColor(selectedColor.id, {
                          brightness: parseFloat(e.target.value),
                        })
                      }
                      style={{
                        background: `linear-gradient(to right, 
                          hsl(${selectedColor.hue * 360}, ${selectedColor.saturation * 100}%, 0%), 
                          hsl(${selectedColor.hue * 360}, ${selectedColor.saturation * 100}%, 50%))`,
                      }}
                    />
                  </div>
                </>
              )}

              {/* Common Controls */}
              <div className="control-group">
                <label>
                  <span>Opacity</span>
                  <span className="value">
                    {Math.round(selectedColor.opacity * 100)}%
                  </span>
                </label>
                <input
                  type="range"
                  className="opacity-slider"
                  min="0"
                  max="1"
                  step="0.01"
                  value={selectedColor.opacity}
                  onChange={(e) =>
                    updateColor(selectedColor.id, {
                      opacity: parseFloat(e.target.value),
                    })
                  }
                />
              </div>

              <div className="control-group">
                <label>
                  <span>Weight (Frequency)</span>
                  <span className="value">
                    {Math.round(selectedColor.weight * 100)}%
                  </span>
                </label>
                <input
                  type="range"
                  className="weight-slider"
                  min="0"
                  max="1"
                  step="0.01"
                  value={selectedColor.weight}
                  onChange={(e) =>
                    updateColor(selectedColor.id, {
                      weight: parseFloat(e.target.value),
                    })
                  }
                />
              </div>

              {/* Color Harmony Tools */}
              <div className="harmony-tools">
                <h4>Color Harmony</h4>
                <div className="harmony-buttons">
                  <button
                    onClick={generateComplementary}
                    title="Add complementary color"
                  >
                    Complementary
                  </button>
                  <button
                    onClick={generateAnalogous}
                    title="Add analogous colors"
                  >
                    Analogous
                  </button>
                  <button onClick={generateTriadic} title="Add triadic colors">
                    Triadic
                  </button>
                  <button
                    onClick={randomizeColors}
                    title="Randomize all colors"
                  >
                    🎲 Randomize
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Theme Settings */}
          <div className="theme-settings">
            <div className="settings-header">
              <h3>Theme Settings</h3>
              <button
                className="toggle-advanced"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? '▼ Basic' : '▶ Advanced'}
              </button>
            </div>

            <div className="control-group">
              <label>
                <span>Blend Mode</span>
              </label>
              <div className="blend-mode-buttons">
                <button
                  className={`mode-btn ${
                    theme.blendMode === 'smooth' ? 'active' : ''
                  }`}
                  onClick={() =>
                    setTheme((prev) => ({...prev, blendMode: 'smooth'}))
                  }
                >
                  Smooth
                </button>
                <button
                  className={`mode-btn ${
                    theme.blendMode === 'distinct' ? 'active' : ''
                  }`}
                  onClick={() =>
                    setTheme((prev) => ({...prev, blendMode: 'distinct'}))
                  }
                >
                  Distinct
                </button>
                <button
                  className={`mode-btn ${
                    theme.blendMode === 'random' ? 'active' : ''
                  }`}
                  onClick={() =>
                    setTheme((prev) => ({...prev, blendMode: 'random'}))
                  }
                >
                  Random
                </button>
                <button
                  className={`mode-btn ${
                    theme.blendMode === 'radial' ? 'active' : ''
                  }`}
                  onClick={() =>
                    setTheme((prev) => ({...prev, blendMode: 'radial'}))
                  }
                >
                  Radial
                </button>
                <button
                  className={`mode-btn ${
                    theme.blendMode === 'wave' ? 'active' : ''
                  }`}
                  onClick={() =>
                    setTheme((prev) => ({...prev, blendMode: 'wave'}))
                  }
                >
                  Wave
                </button>
              </div>
            </div>

            <div className="control-group">
              <label>
                <span>Color Change Speed</span>
                <span className="value">{theme.speed}</span>
              </label>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={theme.speed}
                onChange={(e) =>
                  setTheme((prev) => ({
                    ...prev,
                    speed: parseInt(e.target.value),
                  }))
                }
              />
            </div>

            {showAdvanced && (
              <>
                <div className="control-group">
                  <label>
                    <span>Intensity</span>
                    <span className="value">
                      {Math.round(theme.intensity * 100)}%
                    </span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={theme.intensity}
                    onChange={(e) =>
                      setTheme((prev) => ({
                        ...prev,
                        intensity: parseFloat(e.target.value),
                      }))
                    }
                  />
                </div>

                <div className="control-group">
                  <label>
                    <span>Rotation</span>
                    <span className="value">{theme.rotation}°</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="1"
                    value={theme.rotation}
                    onChange={(e) =>
                      setTheme((prev) => ({
                        ...prev,
                        rotation: parseInt(e.target.value),
                      }))
                    }
                  />
                </div>

                <div className="control-group">
                  <label>
                    <span>Scale</span>
                    <span className="value">
                      {Math.round(theme.scale * 100)}%
                    </span>
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={theme.scale}
                    onChange={(e) =>
                      setTheme((prev) => ({
                        ...prev,
                        scale: parseFloat(e.target.value),
                      }))
                    }
                  />
                </div>
              </>
            )}

            {/* Import/Export */}
            <div className="import-export">
              <h4>Import/Export</h4>
              <div className="import-export-buttons">
                <button onClick={exportTheme}>📥 Export Theme</button>
                <label className="import-btn">
                  📤 Import Theme
                  <input
                    type="file"
                    accept=".json"
                    onChange={importTheme}
                    style={{display: 'none'}}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
