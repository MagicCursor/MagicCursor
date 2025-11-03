# Changelog

## Version 1.1.0 - Enhanced Features Update

### 🎯 Major Features

#### 1. Click-Through Mode
- ✅ Fully functional click-through toggle via system tray
- ✅ Visual notification when toggling (shows for 2 seconds)
- ✅ Tray menu text updates to reflect current state
- ✅ Works on both Windows and macOS
- ✅ State management with proper event handling

#### 2. True Fullscreen (F11)
- ✅ Press F11 to toggle fullscreen mode
- ✅ **Windows**: Covers entire monitor including taskbar using Win32 API
- ✅ Proper monitor detection and positioning
- ✅ Borderless fullscreen with always-on-top behavior
- ✅ Works seamlessly with transparent overlay

#### 3. Configurable Fluid Properties
- ✅ Beautiful AMOLED black settings panel
- ✅ Accessible via system tray "Settings" menu
- ✅ Real-time configuration updates
- ✅ Persistent settings (saved to localStorage)
- ✅ Three presets: Subtle, Default, Intense

**Configurable Parameters:**
- Pressure (0.0 - 1.0)
- Curl (0 - 30)
- Splat Radius (0.05 - 0.5)
- Splat Force (1000 - 20000)
- Density Dissipation (0.1 - 10)
- Velocity Dissipation (0.1 - 10)
- Color Update Speed (1 - 50)
- Shading (on/off)

#### 4. AMOLED Black Flat Design
- ✅ Pure black (#000000) background
- ✅ Minimal, flat design aesthetic
- ✅ Smooth animations and transitions
- ✅ Clean typography and spacing
- ✅ Optimized for OLED displays
- ✅ Subtle hover effects and interactions

### 🎨 UI/UX Improvements

- **Settings Panel**: Modern, minimal design with smooth animations
- **Notification System**: Visual feedback for click-through toggle
- **Preset System**: Quick access to common configurations
- **Keyboard Shortcuts**: F11 for fullscreen, ESC to close settings
- **Responsive Controls**: Smooth slider interactions with visual feedback

### 🔧 Technical Improvements

#### Backend (Rust)
- Enhanced Windows API integration for true fullscreen
- Monitor detection and positioning
- State management for click-through mode
- Event system for frontend communication
- Improved system tray menu with dynamic text updates

#### Frontend (React/TypeScript)
- New Settings component with full configuration UI
- ClickThroughIndicator component for visual feedback
- Event listeners for Tauri backend communication
- localStorage integration for persistent settings
- Proper z-index management for overlay layers

### 📦 New Files

**Components:**
- `src/components/Settings.tsx` - Settings panel component
- `src/components/Settings.css` - AMOLED black styling
- `src/components/ClickThroughIndicator.tsx` - Notification component
- `src/components/ClickThroughIndicator.css` - Notification styling

**Documentation:**
- `FEATURES.md` - Comprehensive feature documentation
- `BUILD_INSTRUCTIONS.md` - Build and development guide
- `CHANGELOG.md` - This file

### 🔄 Modified Files

**Backend:**
- `src-tauri/src/main.rs` - Enhanced with fullscreen, state management, and events
- `src-tauri/Cargo.toml` - Added Win32 Graphics API dependency
- `src-tauri/tauri.conf.json` - Added fullscreen permission

**Frontend:**
- `src/App.tsx` - Integrated settings and click-through indicator
- `src/components/MagicMouse.tsx` - Adjusted z-index and pointer events

### 🐛 Bug Fixes

- Fixed click-through not working properly on Windows
- Fixed overlay not covering taskbar in fullscreen mode
- Fixed pointer events interfering with settings panel
- Fixed z-index conflicts between components

### 🚀 Performance

- Settings are cached in localStorage (no repeated parsing)
- Efficient event handling with proper cleanup
- Optimized re-renders with React state management
- Smooth 60 FPS fluid simulation maintained

### 📝 Known Limitations

- Fullscreen mode is optimized for Windows (uses native API)
- macOS and Linux use standard fullscreen API
- Settings panel requires overlay to be visible

### 🎯 Next Steps (Future Enhancements)

- [ ] Add more color schemes
- [ ] Export/import configuration profiles
- [ ] Keyboard shortcuts customization
- [ ] Multi-monitor support improvements
- [ ] Performance profiling tools
- [ ] Additional fluid simulation presets

---

## How to Use

1. **Build the app**: `npm run tauri:build`
2. **Run in dev mode**: `npm run tauri:dev`
3. **Access settings**: Right-click tray icon → Settings
4. **Toggle click-through**: Right-click tray icon → Enable/Disable Click-Through
5. **Fullscreen**: Press F11
6. **Close settings**: Press ESC or click outside

See `FEATURES.md` for detailed feature documentation and `BUILD_INSTRUCTIONS.md` for build instructions.
