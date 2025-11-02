import {browser} from 'webextension-polyfill-ts';
import {DEFAULT_SETTINGS, saveSettings} from '../utils/storage';

browser.runtime.onInstalled.addListener(async (details): Promise<void> => {
  if (details.reason === 'install') {
    // First time installation
    console.log('✨ Magic Cursor installed!');
    await saveSettings(DEFAULT_SETTINGS);

    // Open options page on first install
    browser.tabs.create({url: 'options.html'});
  } else if (details.reason === 'update') {
    // Extension updated
    console.log('✨ Magic Cursor updated!');
  }
});
