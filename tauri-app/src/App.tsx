import {useEffect, useState} from 'react';
import {listen} from '@tauri-apps/api/event';
import {invoke} from '@tauri-apps/api/tauri';
import {platform} from '@tauri-apps/api/os';
import MagicMouse from './components/MagicMouse';
import Settings, {FluidConfig} from './components/Settings';
import ClickThroughIndicator from './components/ClickThroughIndicator';
import Welcome from './components/Welcome';
import AndroidHome from './components/AndroidHome';
import ControlPanel, {
  ColorPreset,
  COLOR_PRESETS,
} from './components/ControlPanel';
import ColorCustomizer, {ColorTheme} from './components/ColorCustomizer';

function App(): JSX.Element {
  const [isAndroid, setIsAndroid] = useState(false);
  const [showAndroidHome, setShowAndroidHome] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(false);
  const [isColorCustomizerOpen, setIsColorCustomizerOpen] = useState(false);
  const [wasClickThroughEnabled, setWasClickThroughEnabled] = useState(true);
  const [colorPreset, setColorPreset] = useState<ColorPreset>(COLOR_PRESETS[0]);
  const [customTheme, setCustomTheme] = useState<ColorTheme | null>(null);
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
    // Detect platform
    platform()
      .then((platformName) => {
        const isAndroidPlatform = platformName === 'android';
        setIsAndroid(isAndroidPlatform);

        // On Android, show home screen first
        if (isAndroidPlatform) {
          setShowAndroidHome(true);
          return;
        }

        // Desktop: Check if this is first launch
        const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
        if (!hasSeenWelcome) {
          setShowWelcome(true);
          localStorage.setItem('hasSeenWelcome', 'true');

          // Disable click-through during welcome screen
          invoke('set_click_through', {enabled: false}).catch(console.error);
        }
      })
      .catch(console.error);

    // Load saved config from localStorage
    const savedConfig = localStorage.getItem('fluidConfig');
    if (savedConfig) {
      try {
        setConfig(JSON.parse(savedConfig));
      } catch (e) {
        console.error('Failed to load config:', e);
      }
    }

    // Load saved color preset
    const savedPreset = localStorage.getItem('colorPreset');
    if (savedPreset) {
      try {
        const preset = JSON.parse(savedPreset);
        setColorPreset(preset);
      } catch (e) {
        console.error('Failed to load color preset:', e);
      }
    }

    // Load saved custom theme
    const savedTheme = localStorage.getItem('customTheme');
    if (savedTheme) {
      try {
        const theme = JSON.parse(savedTheme);
        setCustomTheme(theme);
      } catch (e) {
        console.error('Failed to load custom theme:', e);
      }
    }

    // Listen for settings open event from tray
    const unlistenSettings = listen('open-settings', async () => {
      // Get current click-through state before opening settings
      try {
        const currentState = await invoke<boolean>('get_click_through_state');
        setWasClickThroughEnabled(currentState);

        // Disable click-through so user can interact with settings
        if (currentState) {
          await invoke('set_click_through', {enabled: false});
        }
      } catch (e) {
        console.error('Failed to get/set click-through state:', e);
      }

      setIsSettingsOpen(true);
    });

    // Listen for color presets open event from tray
    const unlistenColorPresets = listen('open-color-presets', async () => {
      // Get current click-through state before opening control panel
      try {
        const currentState = await invoke<boolean>('get_click_through_state');
        setWasClickThroughEnabled(currentState);

        // Disable click-through so user can interact with control panel
        if (currentState) {
          await invoke('set_click_through', {enabled: false});
        }
      } catch (e) {
        console.error('Failed to get/set click-through state:', e);
      }

      setIsControlPanelOpen(true);
    });

    // Listen for theme customizer open event from tray
    const unlistenThemeCustomizer = listen(
      'open-theme-customizer',
      async () => {
        try {
          const currentState = await invoke<boolean>('get_click_through_state');
          setWasClickThroughEnabled(currentState);

          if (currentState) {
            await invoke('set_click_through', {enabled: false});
          }
        } catch (e) {
          console.error('Failed to get/set click-through state:', e);
        }

        setIsColorCustomizerOpen(true);
      }
    );

    // Listen for welcome open event from tray
    const unlistenWelcome = listen('open-welcome', async () => {
      // Get current click-through state before opening welcome
      try {
        const currentState = await invoke<boolean>('get_click_through_state');
        setWasClickThroughEnabled(currentState);

        // Disable click-through so user can interact with welcome
        if (currentState) {
          await invoke('set_click_through', {enabled: false});
        }
      } catch (e) {
        console.error('Failed to get/set click-through state:', e);
      }

      setShowWelcome(true);
    });

    // Listen for F11 key to toggle fullscreen
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'F11') {
        e.preventDefault();
        invoke('toggle_fullscreen').catch(console.error);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      unlistenSettings.then((fn) => fn());
      unlistenColorPresets.then((fn) => fn());
      unlistenThemeCustomizer.then((fn) => fn());
      unlistenWelcome.then((fn) => fn());
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleConfigChange = (newConfig: FluidConfig): void => {
    setConfig(newConfig);
    localStorage.setItem('fluidConfig', JSON.stringify(newConfig));
  };

  const handleSettingsClose = async (): Promise<void> => {
    setIsSettingsOpen(false);

    // Re-enable click-through if it was enabled before opening settings
    if (wasClickThroughEnabled) {
      try {
        await invoke('set_click_through', {enabled: true});
      } catch (e) {
        console.error('Failed to restore click-through state:', e);
      }
    }
  };

  const handleWelcomeComplete = async (): Promise<void> => {
    setShowWelcome(false);
    // Re-enable click-through if it was enabled before opening welcome
    if (wasClickThroughEnabled) {
      try {
        await invoke('set_click_through', {enabled: true});
      } catch (e) {
        console.error('Failed to restore click-through state:', e);
      }
    }
  };

  const handlePresetChange = (preset: ColorPreset): void => {
    setColorPreset(preset);
    localStorage.setItem('colorPreset', JSON.stringify(preset));
  };

  const handleControlPanelClose = async (): Promise<void> => {
    setIsControlPanelOpen(false);

    // Re-enable click-through if it was enabled before opening control panel
    if (wasClickThroughEnabled) {
      try {
        await invoke('set_click_through', {enabled: true});
      } catch (e) {
        console.error('Failed to restore click-through state:', e);
      }
    }
  };

  const handleAndroidPermissionGranted = (): void => {
    setShowAndroidHome(false);
  };

  const handleThemeSave = (theme: ColorTheme): void => {
    setCustomTheme(theme);
    localStorage.setItem('customTheme', JSON.stringify(theme));
  };

  const handleColorCustomizerClose = async (): Promise<void> => {
    setIsColorCustomizerOpen(false);

    if (wasClickThroughEnabled) {
      try {
        await invoke('set_click_through', {enabled: true});
      } catch (e) {
        console.error('Failed to restore click-through state:', e);
      }
    }
  };

  // Get current color settings (from custom theme or preset)
  const getCurrentColorSettings = () => {
    if (customTheme && customTheme.colors.length > 0) {
      // Use custom theme
      const hues = customTheme.colors.map((c) => c.hue);
      const avgSaturation =
        customTheme.colors.reduce((sum, c) => sum + c.saturation, 0) /
        customTheme.colors.length;
      const avgBrightness =
        customTheme.colors.reduce((sum, c) => sum + c.brightness, 0) /
        customTheme.colors.length;

      return {
        colorHueRange: [Math.min(...hues), Math.max(...hues)] as [
          number,
          number,
        ],
        colorSaturation: avgSaturation,
        colorBrightness: avgBrightness,
      };
    }

    // Use preset
    return {
      colorHueRange: colorPreset.hueRange,
      colorSaturation: colorPreset.saturation,
      colorBrightness: colorPreset.brightness,
    };
  };

  const colorSettings = getCurrentColorSettings();

  // Android UI
  if (isAndroid) {
    if (showAndroidHome) {
      return (
        <AndroidHome onPermissionGranted={handleAndroidPermissionGranted} />
      );
    }

    // Android overlay mode - full screen effect
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: 999999,
          pointerEvents: 'none',
        }}
      >
        <MagicMouse
          PRESSURE={config.PRESSURE}
          CURL={config.CURL}
          SPLAT_RADIUS={config.SPLAT_RADIUS}
          SPLAT_FORCE={config.SPLAT_FORCE}
          DENSITY_DISSIPATION={config.DENSITY_DISSIPATION}
          VELOCITY_DISSIPATION={config.VELOCITY_DISSIPATION}
          COLOR_UPDATE_SPEED={config.COLOR_UPDATE_SPEED}
          SHADING={config.SHADING}
          colorHueRange={colorSettings.colorHueRange}
          colorSaturation={colorSettings.colorSaturation}
          colorBrightness={colorSettings.colorBrightness}
        />
      </div>
    );
  }

  // Desktop/Main UI
  return (
    <>
      {showWelcome && <Welcome onComplete={handleWelcomeComplete} />}
      <MagicMouse
        PRESSURE={config.PRESSURE}
        CURL={config.CURL}
        SPLAT_RADIUS={config.SPLAT_RADIUS}
        SPLAT_FORCE={config.SPLAT_FORCE}
        DENSITY_DISSIPATION={config.DENSITY_DISSIPATION}
        VELOCITY_DISSIPATION={config.VELOCITY_DISSIPATION}
        COLOR_UPDATE_SPEED={config.COLOR_UPDATE_SPEED}
        SHADING={config.SHADING}
        colorHueRange={colorSettings.colorHueRange}
        colorSaturation={colorSettings.colorSaturation}
        colorBrightness={colorSettings.colorBrightness}
      />
      <Settings
        isOpen={isSettingsOpen}
        onClose={handleSettingsClose}
        config={config}
        onConfigChange={handleConfigChange}
      />
      {isControlPanelOpen && (
        <div className="modal-overlay" onClick={handleControlPanelClose}>
          <div onClick={(e) => e.stopPropagation()}>
            <ControlPanel
              onPresetChange={handlePresetChange}
              currentPreset={colorPreset}
              onOpenCustomizer={() => {
                setIsControlPanelOpen(false);
                setIsColorCustomizerOpen(true);
              }}
            />
          </div>
        </div>
      )}
      {isColorCustomizerOpen && (
        <ColorCustomizer
          onClose={handleColorCustomizerClose}
          onSave={handleThemeSave}
          initialTheme={customTheme || undefined}
        />
      )}
      {!isAndroid && <ClickThroughIndicator />}
    </>
  );
}

export default App;
