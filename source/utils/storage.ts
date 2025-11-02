import {browser} from 'webextension-polyfill-ts';

export interface CursorSettings {
  enabled: boolean;
  simResolution: number;
  dyeResolution: number;
  densityDissipation: number;
  velocityDissipation: number;
  pressure: number;
  pressureIterations: number;
  curl: number;
  splatRadius: number;
  splatForce: number;
  shading: boolean;
  colorUpdateSpeed: number;
  transparent: boolean;
}

export const DEFAULT_SETTINGS: CursorSettings = {
  enabled: true,
  simResolution: 128,
  dyeResolution: 1024,
  densityDissipation: 3.5,
  velocityDissipation: 2,
  pressure: 0.1,
  pressureIterations: 20,
  curl: 3,
  splatRadius: 0.2,
  splatForce: 6000,
  shading: true,
  colorUpdateSpeed: 10,
  transparent: true,
};

export async function getSettings(): Promise<CursorSettings> {
  try {
    const result = await browser.storage.sync.get('cursorSettings');
    return {...DEFAULT_SETTINGS, ...result.cursorSettings};
  } catch (error) {
    console.error('Error loading settings:', error);
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(
  settings: Partial<CursorSettings>
): Promise<void> {
  try {
    const current = await getSettings();
    const updated = {...current, ...settings};
    await browser.storage.sync.set({cursorSettings: updated});
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

export function onSettingsChanged(
  callback: (settings: CursorSettings) => void
): void {
  browser.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync' && changes.cursorSettings) {
      callback(changes.cursorSettings.newValue);
    }
  });
}
