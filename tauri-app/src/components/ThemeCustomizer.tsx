import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
  const [globalBrightness, setGlobalBrightness] = useState<number>(
    initialBrightness !== undefined ? initialBrightness : 0.5
  );

  const wheelRefs = [
    useRef<HTMLCanvasElement>(null),
    useRef<HTMLCanvasElement>(null),
    useRef<HTMLCanvasElement>(null),
  ];

  // Cache for color wheel backgrounds - use canvas elements instead of ImageData
  const wheelBackgroundCache = useRef<Map<number, HTMLCanvasElement>>(new Map());
  const updateTimeoutRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);

  // Memoize color calculations to prevent unnecessary recalculations
  const colorParams = useMemo(() => {
    const hues = colors.map((c) => c.h);
    const minHue = Math.min(...hues);
    const maxHue = Math.max(...hues);
    const avgSaturation = colors.reduce((sum, c) => sum + c.s, 0) / colors.length;
    const avgBrightness = colors.reduce((sum, c) => sum + c.l, 0) / colors.length;

    return { minHue, maxHue, avgSaturation, avgBrightness };
  }, [colors]);

  // Notify parent of color changes with proper debouncing
  useEffect(() => {
    if (updateTimeoutRef.current !== null) {
      clearTimeout(updateTimeoutRef.current);
    }

    updateTimeoutRef.current = window.setTimeout(() => {
      onColorChange(
        [colorParams.minHue, colorParams.maxHue],
        colorParams.avgSaturation,
        globalBrightness
      );
    }, 150); // Debounce to 150ms for better performance

    return () => {
      if (updateTimeoutRef.current !== null) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, [colorParams, globalBrightness, onColorChange]);

  const hslToString = useCallback((color: HSLColor): string => {
    return `hsl(${color.h * 360}, ${color.s * 100}%, ${color.l * 100}%)`;
  }, []);

  // Create and cache color wheel background using conic-gradient for better performance
  const createColorWheelBackground = useCallback((size: number): HTMLCanvasElement => {
    const bgCanvas = document.createElement('canvas');
    const dpr = window.devicePixelRatio || 1;
    bgCanvas.width = size * dpr;
    bgCanvas.height = size * dpr;
    bgCanvas.style.width = `${size}px`;
    bgCanvas.style.height = `${size}px`;

    const ctx = bgCanvas.getContext('2d', { willReadFrequently: false, alpha: true });
    if (!ctx) return bgCanvas;

    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 10;

    // Use conic gradient for much better performance
    const gradient = ctx.createConicGradient(0, centerX, centerY);
    for (let i = 0; i <= 360; i += 30) {
      gradient.addColorStop(i / 360, `hsl(${i}, 100%, 50%)`);
    }

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw saturation gradient
    const radialGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
    radialGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    radialGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = radialGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    return bgCanvas;
  }, []);

  const drawColorWheel = useCallback(
    (canvas: HTMLCanvasElement, color: HSLColor, wheelIndex: number): void => {
      const ctx = canvas.getContext('2d', {
        willReadFrequently: false,
        alpha: true,
      });
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const size = 150; // Logical size
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      canvas.style.width = `${size}px`;
      canvas.style.height = `${size}px`;

      ctx.scale(dpr, dpr);

      const centerX = size / 2;
      const centerY = size / 2;
      const radius = size / 2 - 10;

      // Get or create cached background
      let cachedBackground = wheelBackgroundCache.current.get(wheelIndex);

      if (!cachedBackground) {
        cachedBackground = createColorWheelBackground(size);
        wheelBackgroundCache.current.set(wheelIndex, cachedBackground);
      }

      // Draw cached background
      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(cachedBackground, 0, 0, size, size);

      // Draw current color indicator (only dynamic part)
      // Convert hue to angle: 0° at top, rotating clockwise
      const angleDeg = color.h * 360 - 90; // Subtract 90 to start from top
      const angle = (angleDeg * Math.PI) / 180;
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
    },
    [createColorWheelBackground]
  );

  // Draw all color wheels with performance optimization
  useEffect(() => {
    // Cancel any pending animation frame
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }

    // Use requestAnimationFrame for smoother rendering
    rafIdRef.current = requestAnimationFrame(() => {
      wheelRefs.forEach((ref, index) => {
        if (ref.current) {
          drawColorWheel(ref.current, colors[index], index);
        }
      });
      rafIdRef.current = null;
    });

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [colors, drawColorWheel]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear all caches
      wheelBackgroundCache.current.clear();

      if (updateTimeoutRef.current !== null) {
        clearTimeout(updateTimeoutRef.current);
      }

      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // Use ref to avoid recreating callback on every color change
  const colorsRef = useRef(colors);
  useEffect(() => {
    colorsRef.current = colors;
  }, [colors]);

  const handleWheelClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>, index: number): void => {
      const canvas = wheelRefs[index].current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const x = (e.clientX - rect.left) * dpr;
      const y = (e.clientY - rect.top) * dpr;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = canvas.width / 2 - 10 * dpr;

      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > radius) return;

      // Calculate hue from angle - atan2 returns angle from positive x-axis
      // We need to rotate by -90 degrees to start from top (red at top)
      const angleRad = Math.atan2(dy, dx);
      const angleDeg = ((angleRad * 180) / Math.PI + 90 + 360) % 360;
      const hue = angleDeg / 360;

      // Calculate saturation from distance
      const saturation = Math.min(distance / radius, 1);

      // Keep current lightness from ref
      const currentL = colorsRef.current[index].l;

      const newColor: HSLColor = { h: hue, s: saturation, l: currentL };

      setColors((prevColors) => {
        const newColors: [HSLColor, HSLColor, HSLColor] = [...prevColors] as [
          HSLColor,
          HSLColor,
          HSLColor,
        ];
        newColors[index] = newColor;
        return newColors;
      });
      setSelectedPreset(null); // Deselect preset on manual change
    },
    [] // No dependencies - uses ref instead
  );

  const handlePresetClick = useCallback((preset: ColorPreset): void => {
    setColors(preset.colors);
    setSelectedPreset(preset.name);
    if (preset.brightness !== undefined) {
      setGlobalBrightness(preset.brightness);
    }
    // No need to clear cache - backgrounds are static
  }, []);

  const handleBrightnessChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const newBrightness = parseFloat(e.target.value);
    setGlobalBrightness(newBrightness);

    // Update all colors with new brightness
    setColors((prevColors) => {
      return prevColors.map((color) => ({
        ...color,
        l: newBrightness,
      })) as [HSLColor, HSLColor, HSLColor];
    });
    setSelectedPreset(null);
  }, []);

  const handleSave = useCallback((): void => {
    onClose();
  }, [onClose]);

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

          {/* Brightness Control */}
          <div className="brightness-control">
            <label htmlFor="brightness-slider">
              <span>Brightness</span>
              <span className="brightness-value">{Math.round(globalBrightness * 100)}%</span>
            </label>
            <input
              id="brightness-slider"
              type="range"
              min="0.1"
              max="0.9"
              step="0.01"
              value={globalBrightness}
              onChange={handleBrightnessChange}
              className="brightness-slider"
            />
          </div>

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
