# Magic Cursor Desktop

A beautiful GPU-accelerated fluid cursor effect as a transparent desktop overlay application built with Tauri.

## Features

- 🎨 **Transparent Overlay**: Runs as a transparent window over your entire desktop
- 🖱️ **Click-Through**: Mouse events pass through to applications below
- 🎯 **System Tray**: Control the app from your system tray
- ⚡ **GPU Accelerated**: WebGL-powered fluid simulation
- 🪶 **Lightweight**: Native performance with Tauri
- 🔄 **Cross-Platform**: Works on Windows, macOS, and Linux

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
   npm install
   ```

3. **Run in development mode**:
   ```bash
   npm run tauri:dev
   ```

4. **Build for production**:
   ```bash
   npm run tauri:build
   ```

   The built application will be in `src-tauri/target/release/bundle/`

## Usage

### System Tray Controls

Once the application is running, you'll see a Magic Cursor icon in your system tray with the following options:

- **Show**: Make the overlay visible
- **Hide**: Hide the overlay
- **Toggle Click-Through**: Enable/disable mouse interaction with the overlay
- **Quit**: Exit the application

### Default Behavior

- The overlay starts in **click-through mode** (mouse events pass through)
- The window is **always on top** of other applications
- The effect follows your mouse cursor automatically

## Configuration

You can customize the fluid effect by modifying the props in `src/App.tsx`:

```tsx
<MagicMouse
  SIM_RESOLUTION={128}
  DYE_RESOLUTION={1440}
  DENSITY_DISSIPATION={3.5}
  VELOCITY_DISSIPATION={2}
  PRESSURE={0.1}
  CURL={3}
  SPLAT_RADIUS={0.2}
  SPLAT_FORCE={6000}
  SHADING={true}
  COLOR_UPDATE_SPEED={10}
/>
```

### Parameters

- `SIM_RESOLUTION`: Simulation grid resolution (lower = faster, higher = more detailed)
- `DYE_RESOLUTION`: Color texture resolution
- `DENSITY_DISSIPATION`: How quickly the color fades (higher = faster fade)
- `VELOCITY_DISSIPATION`: How quickly motion slows down
- `PRESSURE`: Pressure solver strength
- `CURL`: Vorticity/swirl strength
- `SPLAT_RADIUS`: Size of the cursor effect
- `SPLAT_FORCE`: Strength of the cursor effect
- `SHADING`: Enable 3D-like shading
- `COLOR_UPDATE_SPEED`: How fast colors cycle

## Project Structure

```
tauri-app/
├── src/                    # React frontend
│   ├── components/
│   │   └── MagicMouse.tsx # Main fluid effect component
│   ├── App.tsx            # App entry point
│   └── main.tsx           # React entry point
├── src-tauri/             # Rust backend
│   ├── src/
│   │   └── main.rs        # Tauri main process
│   ├── Cargo.toml         # Rust dependencies
│   └── tauri.conf.json    # Tauri configuration
├── index.html             # HTML template
├── package.json           # Node dependencies
└── vite.config.ts         # Vite configuration
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
npm run tauri:build
```
Creates: `.exe` installer and `.msi` in `src-tauri/target/release/bundle/`

### macOS
```bash
npm run tauri:build
```
Creates: `.app` and `.dmg` in `src-tauri/target/release/bundle/`

### Linux
```bash
npm run tauri:build
```
Creates: `.deb`, `.AppImage` in `src-tauri/target/release/bundle/`

## Troubleshooting

### Window not transparent
- **Windows**: Ensure you're running Windows 10 or later
- **Linux**: Some window managers don't support transparency. Try a compositor like `picom`

### High CPU usage
- Lower `SIM_RESOLUTION` and `DYE_RESOLUTION` values
- Reduce `COLOR_UPDATE_SPEED`

### Click-through not working
- Use the system tray menu to toggle click-through mode
- On Linux, ensure your window manager supports input shapes

## Performance Tips

1. **Lower resolutions** for better performance on older hardware
2. **Disable shading** if you experience lag
3. **Reduce dissipation values** to make effects fade faster
4. **Close the app** when not needed (via system tray)

## License

MIT License - See the main project LICENSE file

## Credits

Based on the Magic Cursor browser extension. Fluid simulation inspired by WebGL fluid dynamics implementations.
