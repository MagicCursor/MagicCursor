import { useEffect, useState } from 'react';
import { listen } from '@tauri-apps/api/event';
import { invoke } from '@tauri-apps/api/tauri';
import { platform } from '@tauri-apps/api/os';
import MagicMouse from './components/MagicMouse';
import Settings, { FluidConfig } from './components/Settings';
import ClickThroughIndicator from './components/ClickThroughIndicator';
import Welcome from './components/Welcome';
import AndroidHome from './components/AndroidHome';
import ThemeCustomizer from './components/ThemeCustomizer';

function App(): JSX.Element {
  const [isAndroid, setIsAndroid] = useState(false);
  const [showAndroidHome, setShowAndroidHome] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isThemeCustomizerOpen, setIsThemeCustomizerOpen] = useState(false);
  const [wasClickThroughEnabled, setWasClickThroughEnabled] = useState(true);
  const [colorHueRange, setColorHueRange] = useState<[number, number]>([0, 1]);
  const [colorSaturation, setColorSaturation] = useState(1.0);
  const [colorBrightness, setColorBrightness] = useState(1.0);
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
          invoke('set_click_through', { enabled: false }).catch(console.error);
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

    // Load saved color settings
    const savedHueRange = localStorage.getItem('colorHueRange');
    const savedSaturation = localStorage.getItem('colorSaturation');
    const savedBrightness = localStorage.getItem('colorBrightness');

    if (savedHueRange) {
      try {
        setColorHueRange(JSON.parse(savedHueRange));
      } catch (e) {
        console.error('Failed to load hue range:', e);
      }
    }

    if (savedSaturation) {
      try {
        setColorSaturation(parseFloat(savedSaturation));
      } catch (e) {
        console.error('Failed to load saturation:', e);
      }
    }

    if (savedBrightness) {
      try {
        setColorBrightness(parseFloat(savedBrightness));
      } catch (e) {
        console.error('Failed to load brightness:', e);
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
          await invoke('set_click_through', { enabled: false });
        }
      } catch (e) {
        console.error('Failed to get/set click-through state:', e);
      }

      setIsSettingsOpen(true);
    });

    // Listen for theme customizer open event from tray
    const unlistenThemeCustomizer = listen('open-theme-customizer', async () => {
      try {
        const currentState = await invoke<boolean>('get_click_through_state');
        setWasClickThroughEnabled(currentState);

        if (currentState) {
          await invoke('set_click_through', { enabled: false });
        }
      } catch (e) {
        console.error('Failed to get/set click-through state:', e);
      }

      setIsThemeCustomizerOpen(true);
    });

    // Also listen for old color presets event for backwards compatibility
    const unlistenColorPresets = listen('open-color-presets', async () => {
      try {
        const currentState = await invoke<boolean>('get_click_through_state');
        setWasClickThroughEnabled(currentState);

        if (currentState) {
          await invoke('set_click_through', { enabled: false });
        }
      } catch (e) {
        console.error('Failed to get/set click-through state:', e);
      }

      setIsThemeCustomizerOpen(true);
    });

    // Listen for welcome open event from tray
    const unlistenWelcome = listen('open-welcome', async () => {
      // Get current click-through state before opening welcome
      try {
        const currentState = await invoke<boolean>('get_click_through_state');
        setWasClickThroughEnabled(currentState);

        // Disable click-through so user can interact with welcome
        if (currentState) {
          await invoke('set_click_through', { enabled: false });
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
        await invoke('set_click_through', { enabled: true });
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
        await invoke('set_click_through', { enabled: true });
      } catch (e) {
        console.error('Failed to restore click-through state:', e);
      }
    }
  };

  const handleAndroidPermissionGranted = (): void => {
    setShowAndroidHome(false);
  };

  const handleColorChange = (
    hueRange: [number, number],
    saturation: number,
    brightness: number
  ): void => {
    setColorHueRange(hueRange);
    setColorSaturation(saturation);
    setColorBrightness(brightness);

    // Save to localStorage
    localStorage.setItem('colorHueRange', JSON.stringify(hueRange));
    localStorage.setItem('colorSaturation', saturation.toString());
    localStorage.setItem('colorBrightness', brightness.toString());
  };

  const handleThemeCustomizerClose = async (): Promise<void> => {
    setIsThemeCustomizerOpen(false);

    if (wasClickThroughEnabled) {
      try {
        await invoke('set_click_through', { enabled: true });
      } catch (e) {
        console.error('Failed to restore click-through state:', e);
      }
    }
  };

  // Android UI
  if (isAndroid) {
    if (showAndroidHome) {
      return <AndroidHome onPermissionGranted={handleAndroidPermissionGranted} />;
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
          colorHueRange={colorHueRange}
          colorSaturation={colorSaturation}
          colorBrightness={colorBrightness}
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
        colorHueRange={colorHueRange}
        colorSaturation={colorSaturation}
        colorBrightness={colorBrightness}
      />
      <Settings
        isOpen={isSettingsOpen}
        onClose={handleSettingsClose}
        config={config}
        onConfigChange={handleConfigChange}
      />
      {isThemeCustomizerOpen && (
        <ThemeCustomizer
          onClose={handleThemeCustomizerClose}
          onColorChange={handleColorChange}
          initialHueRange={colorHueRange}
          initialSaturation={colorSaturation}
          initialBrightness={colorBrightness}
        />
      )}
      {!isAndroid && <ClickThroughIndicator />}
    </>
  );
}

export default App;
