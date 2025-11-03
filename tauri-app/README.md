# Magic Cursor Desktop ✨

A beautiful, configurable GPU-accelerated fluid cursor effect as a transparent desktop overlay with AMOLED black design.

![Version](https://img.shields.io/badge/version-1.1.0-blue)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)
![License](https://img.shields.io/badge/license-MIT-green)

## 🌟 Features

### Core Features
- 🎨 **Transparent Overlay**: Runs as a transparent window over your entire desktop
- 🖱️ **Click-Through Mode**: Toggle to interact with apps below (with visual feedback)
- 🖥️ **True Fullscreen (F11)**: Covers entire monitor including taskbar
- ⚙️ **Configurable Properties**: 8 parameters + 3 presets via beautiful settings panel
- 🌑 **AMOLED Black Design**: Pure black flat design optimized for OLED displays
- 🎯 **System Tray Integration**: Quick access to all features
- 💾 **Persistent Settings**: Auto-saved configurations
- ⚡ **GPU Accelerated**: WebGL2-powered fluid simulation
- 🪶 **Lightweight**: Native performance with Tauri
- 🔄 **Cross-Platform**: Works on Windows, macOS, and Linux

### New in v1.1.0
✅ **Click-Through Toggle** - Works perfectly with visual notifications  
✅ **F11 Fullscreen** - Covers entire screen including taskbar on Windows  
✅ **Settings Panel** - Beautiful AMOLED black UI with real-time updates  
✅ **Preset System** - Subtle, Default, and Intense configurations  
✅ **Visual Feedback** - Smooth animations and notifications

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **Rust** (latest stable version)
  - Install from: https://rustup.rs/
- **Platform-specific dependencies**:
  
  ### Windows
  - Microsoft Visual Studio C++ Build Tools
  - WebView2 (usually pre-installed on Windows 10/11)

  ### macOS
  - Xcode Command Line Tools: `xcode-select --install`

  ### Linux (Debian/Ubuntu)
  ```bash
  sudo apt update
  sudo apt install libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    file \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev
  ```

## Installation

1. **Navigate to the tauri-app directory**:
   ```bash
   cd tauri-app
   ```

2. **Install dependencies**:
   ```bash
   yarn install
   ```

3. **Run in development mode**:
   ```bash
   yarn run tauri:dev
   ```

4. **Build for production**:
   ```bash
   yarn run tauri:build
   ```

   The built application will be in `src-tauri/target/release/bundle/`

## 🎮 Usage

### System Tray Controls

Right-click the Magic Cursor icon in your system tray:

- **Show**: Make the overlay visible
- **Hide**: Hide the overlay
- **Enable/Disable Click-Through**: Toggle mouse interaction (shows notification)
- **Settings**: Open the configuration panel
- **Quit**: Exit the application

### Keyboard Shortcuts

- **F11**: Toggle fullscreen mode (covers entire monitor including taskbar)
- **ESC**: Close settings panel

### Settings Panel

Access via system tray → Settings:

**Configurable Parameters:**
- Pressure (0.0 - 1.0)
- Curl (0 - 30)
- Splat Radius (0.05 - 0.5)
- Splat Force (1000 - 20000)
- Density Dissipation (0.1 - 10)
- Velocity Dissipation (0.1 - 10)
- Color Update Speed (1 - 50)
- Shading (on/off)

**Quick Presets:**
- **Subtle**: Gentle, minimal effect
- **Default**: Balanced, visually appealing
- **Intense**: Dramatic, high-energy

All settings are automatically saved and persist across restarts.

### Default Behavior

- The overlay starts with **click-through disabled** (fluid responds to mouse)
- The window is **always on top** of other applications
- The effect follows your mouse cursor automatically
- Settings are loaded from previous session

## ⚙️ Configuration

### Via Settings Panel (Recommended)

Use the beautiful AMOLED black settings panel accessible from the system tray:
1. Right-click tray icon
2. Click "Settings"
3. Adjust sliders or choose a preset
4. Changes apply instantly and save automatically

### Via Code (Advanced)

You can also customize default values in `src/App.tsx`:

```tsx
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
```

### Parameter Guide

- **PRESSURE**: Pressure solver strength (0.0 - 1.0)
- **CURL**: Vorticity/swirl strength (0 - 30)
- **SPLAT_RADIUS**: Size of the cursor effect (0.05 - 0.5)
- **SPLAT_FORCE**: Strength of the cursor effect (1000 - 20000)
- **DENSITY_DISSIPATION**: How quickly color fades (0.1 - 10)
- **VELOCITY_DISSIPATION**: How quickly motion slows (0.1 - 10)
- **COLOR_UPDATE_SPEED**: How fast colors cycle (1 - 50)
- **SHADING**: Enable 3D-like shading effect (boolean)

## 📚 Documentation

- **[Quick Start Guide](QUICKSTART.md)** - Get started in 3 steps
- **[Features Documentation](FEATURES.md)** - Complete feature guide
- **[Build Instructions](BUILD_INSTRUCTIONS.md)** - Detailed build guide
- **[UI Guide](UI_GUIDE.md)** - Visual interface reference
- **[Project Structure](PROJECT_STRUCTURE.md)** - Code organization
- **[Changelog](CHANGELOG.md)** - Version history
- **[Implementation Summary](IMPLEMENTATION_SUMMARY.md)** - Technical details

## 📁 Project Structure

```
tauri-app/
├── src/                              # React frontend
│   ├── components/
│   │   ├── MagicMouse.tsx           # Main fluid effect component
│   │   ├── Settings.tsx             # Settings panel (NEW)
│   │   ├── Settings.css             # AMOLED styling (NEW)
│   │   ├── ClickThroughIndicator.tsx # Notification (NEW)
│   │   └── ClickThroughIndicator.css # Notification styling (NEW)
│   ├── App.tsx                      # App entry point (UPDATED)
│   ├── main.tsx                     # React entry point
│   └── index.css                    # Global styles
├── src-tauri/                       # Rust backend
│   ├── src/
│   │   └── main.rs                  # Tauri main process (ENHANCED)
│   ├── Cargo.toml                   # Rust dependencies (UPDATED)
│   └── tauri.conf.json              # Tauri configuration (UPDATED)
├── Documentation/                   # Comprehensive docs
├── index.html                       # HTML template
├── package.json                     # Node dependencies
└── vite.config.ts                   # Vite configuration
```

## Development

### Hot Reload

The development server supports hot reload. Changes to React components will update automatically.

### Debugging

- **Frontend**: Open DevTools with `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (macOS)
- **Backend**: Check console output in the terminal

## Building for Distribution

### Windows
```bash
yarn run tauri:build
```
Creates: `.exe` installer and `.msi` in `src-tauri/target/release/bundle/`

### macOS
```bash
yarn run tauri:build
```
Creates: `.app` and `.dmg` in `src-tauri/target/release/bundle/`

### Linux
```bash
yarn run tauri:build
```
Creates: `.deb`, `.AppImage` in `src-tauri/target/release/bundle/`

## 🐛 Troubleshooting

### Settings won't open
- Make sure the overlay is visible (not hidden via tray)
- Try clicking "Show" in the system tray first

### Click-through not working
- Toggle it off and on again via the tray menu
- Check for the visual notification when toggling
- On Linux, ensure your window manager supports input shapes

### Fullscreen not covering taskbar
- Press F11 again to re-trigger fullscreen mode
- On Windows, this should cover the entire monitor including taskbar

### Window not transparent
- **Windows**: Ensure you're running Windows 10 or later
- **Linux**: Some window managers don't support transparency. Try a compositor like `picom`

### High CPU usage
- Use the "Subtle" preset in settings
- Disable shading in the settings panel
- Lower dissipation values for faster fade

## 💡 Performance Tips

1. **Use Presets**: Start with "Subtle" for best performance
2. **Disable Shading**: Toggle off in settings if experiencing lag
3. **Adjust Dissipation**: Higher values = faster fade = better performance
4. **Close When Not Needed**: Use system tray to hide or quit

## 🎨 Design Philosophy

This application features a **pure AMOLED black design**:
- Pure black (#000000) background for OLED displays
- Flat, minimal aesthetic
- Smooth animations and transitions
- High contrast for readability
- Touch-friendly controls
- Professional typography

## 🚀 What's New in v1.1.0

✅ **Click-Through Toggle** - Fully functional with visual feedback  
✅ **F11 Fullscreen** - True fullscreen covering entire monitor  
✅ **Settings Panel** - Beautiful AMOLED black configuration UI  
✅ **Preset System** - Quick access to common configurations  
✅ **Persistent Settings** - Auto-saved to localStorage  
✅ **Visual Notifications** - Smooth feedback for state changes  
✅ **Enhanced Windows Support** - Win32 API for perfect fullscreen  

See [CHANGELOG.md](CHANGELOG.md) for complete version history.

## 🤝 Contributing

Contributions are welcome! Please read the documentation before submitting PRs.

## 📄 License

MIT License - See the main project LICENSE file

## 🙏 Credits

Based on the Magic Cursor browser extension. Fluid simulation inspired by WebGL fluid dynamics implementations.

---

**Ready to use!** See [QUICKSTART.md](QUICKSTART.md) to get started in 3 steps. 🚀
