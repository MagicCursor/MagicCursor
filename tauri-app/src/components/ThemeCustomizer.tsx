import { useState, useEffect, useRef } from 'react';
import { appWindow } from '@tauri-apps/api/window';
import './ThemeCustomizer.css';

export interface HSLColor {
  h: number; // 0-1
  s: number; // 0-1
  l: number; // 0-1
}

export interface ColorPreset {
  name: string;
  icon: string;
  colors: [HSLColor, HSLColor, HSLColor];
  hueRange?: [number, number];
  saturation?: number;
  brightness?: number;
}

interface ThemeCustomizerProps {
  onClose: () => void;
  onColorChange: (hueRange: [number, number], saturation: number, brightness: number) => void;
  initialHueRange?: [number, number];
  initialSaturation?: number;
  initialBrightness?: number;
}

export const COLOR_PRESETS: ColorPreset[] = [
  {
    name: 'Rainbow',
    icon: '🌈',
    colors: [
      { h: 0, s: 1.0, l: 0.5 }, // Red
      { h: 0.33, s: 1.0, l: 0.5 }, // Green
      { h: 0.66, s: 1.0, l: 0.5 }, // Blue
    ],
    hueRange: [0, 1.0],
    saturation: 1.0,
    brightness: 0.5,
  },
  {
    name: 'Cyberpunk',
    icon: '🌃',
    colors: [
      { h: 0.83, s: 1.0, l: 0.5 }, // Magenta
      { h: 0.5, s: 1.0, l: 0.5 }, // Cyan
      { h: 0.92, s: 1.0, l: 0.6 }, // Hot Pink
    ],
    hueRange: [0.5, 0.92],
    saturation: 1.0,
    brightness: 0.55,
  },
  {
    name: 'Red Velvet',
    icon: '🌹',
    colors: [
      { h: 0.98, s: 0.83, l: 0.47 }, // Crimson
      { h: 0, s: 1.0, l: 0.27 }, // Dark Red
      { h: 0.04, s: 1.0, l: 0.5 }, // Orange Red
    ],
    hueRange: [0, 0.04],
    saturation: 0.9,
    brightness: 0.4,
  },
  {
    name: 'Moonlight',
    icon: '🌙',
    colors: [
      { h: 0.58, s: 0.73, l: 0.73 }, // Light Blue
      { h: 0.72, s: 0.68, l: 0.78 }, // Light Purple
      { h: 0.45, s: 0.73, l: 0.8 }, // Mint
    ],
    hueRange: [0.45, 0.72],
    saturation: 0.71,
    brightness: 0.77,
  },
  {
    name: 'Sunlight',
    icon: '☀️',
    colors: [
      { h: 0.14, s: 1.0, l: 0.5 }, // Gold
      { h: 0.11, s: 1.0, l: 0.5 }, // Orange
      { h: 0.09, s: 1.0, l: 0.5 }, // Dark Orange
    ],
    hueRange: [0.09, 0.14],
    saturation: 1.0,
    brightness: 0.5,
  },
];

export default function ThemeCustomizer({
  onClose,
  onColorChange,
  initialHueRange,
  initialSaturation,
  initialBrightness,
}: ThemeCustomizerProps): JSX.Element {
  // Initialize colors from initial values or first preset
  const initColors = (): [HSLColor, HSLColor, HSLColor] => {
    if (initialHueRange && initialSaturation !== undefined && initialBrightness !== undefined) {
      const mid = (initialHueRange[0] + initialHueRange[1]) / 2;
      return [
        { h: initialHueRange[0], s: initialSaturation, l: initialBrightness },
        { h: mid, s: initialSaturation, l: initialBrightness },
        { h: initialHueRange[1], s: initialSaturation, l: initialBrightness },
      ];
    }
    return COLOR_PRESETS[0].colors;
  };

  const [colors, setColors] = useState<[HSLColor, HSLColor, HSLColor]>(initColors());
  const [selectedPreset, setSelectedPreset] = useState<string | null>(
    initialHueRange ? null : COLOR_PRESETS[0].name
  );

  const wheelRefs = [
    useRef<HTMLCanvasElement>(null),
    useRef<HTMLCanvasElement>(null),
    useRef<HTMLCanvasElement>(null),
  ];

  // Disable click-through when customizer is open
  useEffect(() => {
    const disableClickThrough = async (): Promise<void> => {
      try {
        await appWindow.setIgnoreCursorEvents(false);
      } catch (error) {
        console.error('Failed to disable click-through:', error);
      }
    };

    void disableClickThrough();

    return () => {
      const restoreClickThrough = async (): Promise<void> => {
        try {
          await appWindow.setIgnoreCursorEvents(true);
        } catch (error) {
          console.error('Failed to restore click-through:', error);
        }
      };
      void restoreClickThrough();
    };
  }, []);

  // Notify parent of color changes
  useEffect(() => {
    // Calculate hue range from the 3 colors
    const hues = colors.map((c) => c.h);
    const minHue = Math.min(...hues);
    const maxHue = Math.max(...hues);

    // Calculate average saturation and brightness
    const avgSaturation = colors.reduce((sum, c) => sum + c.s, 0) / colors.length;
    const avgBrightness = colors.reduce((sum, c) => sum + c.l, 0) / colors.length;

    onColorChange([minHue, maxHue], avgSaturation, avgBrightness);
  }, [colors, onColorChange]);

  const hslToString = (color: HSLColor): string => {
    return `hsl(${color.h * 360}, ${color.s * 100}%, ${color.l * 100}%)`;
  };

  const drawColorWheel = (canvas: HTMLCanvasElement, color: HSLColor): void => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;

    ctx.clearRect(0, 0, size, size);

    // Draw color wheel
    for (let angle = 0; angle < 360; angle += 1) {
      const startAngle = ((angle - 90) * Math.PI) / 180;
      const endAngle = ((angle + 1 - 90) * Math.PI) / 180;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();

      ctx.fillStyle = `hsl(${angle}, 100%, 50%)`;
      ctx.fill();
    }

    // Draw saturation gradient
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw current color indicator
    const angle = ((color.h * 360 - 90) * Math.PI) / 180;
    const indicatorRadius = radius * color.s;
    const indicatorX = centerX + Math.cos(angle) * indicatorRadius;
    const indicatorY = centerY + Math.sin(angle) * indicatorRadius;

    // Outer white ring
    ctx.beginPath();
    ctx.arc(indicatorX, indicatorY, 8, 0, Math.PI * 2);
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Inner black ring
    ctx.beginPath();
    ctx.arc(indicatorX, indicatorY, 8, 0, Math.PI * 2);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  // Draw all color wheels
  useEffect(() => {
    wheelRefs.forEach((ref, index) => {
      if (ref.current) {
        drawColorWheel(ref.current, colors[index]);
      }
    });
  }, [colors]);

  const handleWheelClick = (e: React.MouseEvent<HTMLCanvasElement>, index: number): void => {
    const canvas = wheelRefs[index].current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 10;

    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > radius) return;

    // Calculate hue from angle
    const angle = ((Math.atan2(dy, dx) * 180) / Math.PI + 90 + 360) % 360;
    const hue = angle / 360;

    // Calculate saturation from distance
    const saturation = Math.min(distance / radius, 1);

    // Keep current lightness
    const currentL = colors[index].l;

    const newColor: HSLColor = { h: hue, s: saturation, l: currentL };

    const newColors: [HSLColor, HSLColor, HSLColor] = [...colors] as [HSLColor, HSLColor, HSLColor];
    newColors[index] = newColor;
    setColors(newColors);
    setSelectedPreset(null); // Deselect preset on manual change
  };

  const handlePresetClick = (preset: ColorPreset): void => {
    setColors(preset.colors);
    setSelectedPreset(preset.name);
  };

  const handleSave = (): void => {
    onClose();
  };

  return (
    <div
      className="theme-customizer-overlay"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
      role="button"
      tabIndex={0}
    >
      <div
        className="theme-customizer-panel"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        role="dialog"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="theme-header">
          <button type="button" className="back-btn" onClick={onClose}>
            ← Back
          </button>
          <h2>Theme Customizer</h2>
          <button type="button" className="save-btn" onClick={handleSave}>
            Apply
          </button>
        </div>

        {/* Top Split - Presets */}
        <div className="presets-section">
          <h3>Presets</h3>
          <div className="presets-list">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                className={`preset-item ${selectedPreset === preset.name ? 'active' : ''}`}
                onClick={() => handlePresetClick(preset)}
              >
                <div className="preset-icon-container">
                  <div
                    className="preset-gradient"
                    style={{
                      background: `conic-gradient(
                        ${hslToString(preset.colors[0])} 0deg 120deg,
                        ${hslToString(preset.colors[1])} 120deg 240deg,
                        ${hslToString(preset.colors[2])} 240deg 360deg
                      )`,
                    }}
                  />
                  <span className="preset-emoji">{preset.icon}</span>
                </div>
                <span className="preset-name">{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Split - Color Wheels */}
        <div className="color-wheels-section">
          <h3>Custom Colors</h3>
          <div className="wheels-container">
            {colors.map((color, index) => (
              <div key={`color-${index}`} className="wheel-item">
                <canvas
                  ref={wheelRefs[index]}
                  width={150}
                  height={150}
                  onClick={(e) => handleWheelClick(e, index)}
                  style={{ cursor: 'crosshair' }}
                />
                <div className="color-info">
                  <span className="color-label">Color {index + 1}</span>
                  <div
                    className="color-preview"
                    style={{
                      backgroundColor: hslToString(color),
                    }}
                  />
                  <span className="color-value">
                    H: {Math.round(color.h * 360)}° S: {Math.round(color.s * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
