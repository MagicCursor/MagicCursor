import React from 'react';
import ReactDOM from 'react-dom';
import SplashCursor from './magic-mouse';
import {getSettings, onSettingsChanged, CursorSettings} from '../utils/storage';

(async function init(): Promise<void> {
  // Load settings
  const settings = await getSettings();

  // Create container for our overlay
  const containerId = '__magic_mouse_container__';
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    // Ensure the container itself does not block pointer events
    container.style.pointerEvents = 'none';
    // Append to body
    document.body.appendChild(container);
  }

  // Render function
  const render = (currentSettings: CursorSettings): void => {
    if (currentSettings.enabled) {
      ReactDOM.render(
        <SplashCursor
          SIM_RESOLUTION={currentSettings.simResolution}
          DYE_RESOLUTION={currentSettings.dyeResolution}
          DENSITY_DISSIPATION={currentSettings.densityDissipation}
          VELOCITY_DISSIPATION={currentSettings.velocityDissipation}
          PRESSURE={currentSettings.pressure}
          PRESSURE_ITERATIONS={currentSettings.pressureIterations}
          CURL={currentSettings.curl}
          SPLAT_RADIUS={currentSettings.splatRadius}
          SPLAT_FORCE={currentSettings.splatForce}
          SHADING={currentSettings.shading}
          COLOR_UPDATE_SPEED={currentSettings.colorUpdateSpeed}
          TRANSPARENT={currentSettings.transparent}
        />,
        container
      );
    } else {
      ReactDOM.unmountComponentAtNode(container!);
    }
  };

  // Initial render
  render(settings);

  // Listen for settings changes
  onSettingsChanged((newSettings) => {
    render(newSettings);
  });
})();

export {};
