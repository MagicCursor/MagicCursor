# Build Instructions

## Prerequisites

### Windows
- Node.js 18+ and yarn/yarn
- Rust (install via https://rustup.rs/)
- Visual Studio Build Tools or Visual Studio with C++ development tools

### macOS
- Node.js 18+ and yarn/yarn
- Rust (install via https://rustup.rs/)
- Xcode Command Line Tools

### Linux
- Node.js 18+ and yarn/yarn
- Rust (install via https://rustup.rs/)
- System dependencies: `libwebkit2gtk-4.0-dev build-essential curl wget libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev`

## Development

1. **Install dependencies:**
   ```bash
   cd tauri-app
   yarn install
   # or
   yarn install
   ```

2. **Run in development mode:**
   ```bash
   yarn run tauri:dev
   # or
   yarn tauri:dev
   ```

   This will:
   - Start the Vite dev server
   - Compile the Rust backend
   - Launch the application with hot-reload

## Building for Production

1. **Build the application:**
   ```bash
   yarn run tauri:build
   # or
   yarn tauri:build
   ```

2. **Find the built application:**
   - **Windows**: `src-tauri/target/release/magic-cursor-desktop.exe`
   - **Windows Installer**: `src-tauri/target/release/bundle/msi/Magic Cursor_1.0.0_x64_en-US.msi`
   - **macOS**: `src-tauri/target/release/bundle/macos/Magic Cursor.app`
   - **macOS DMG**: `src-tauri/target/release/bundle/dmg/Magic Cursor_1.0.0_x64.dmg`
   - **Linux**: `src-tauri/target/release/bundle/appimage/magic-cursor-desktop_1.0.0_amd64.AppImage`

## Quick Commands

```bash
# Development
yarn run dev              # Start Vite dev server only
yarn run tauri:dev        # Start full Tauri dev environment

# Building
yarn run build            # Build frontend only
yarn run tauri:build      # Build complete application

# Preview
yarn run preview          # Preview production build (frontend only)
```

## Troubleshooting

### Windows

**Error: "MSVC build tools not found"**
- Install Visual Studio Build Tools with C++ development tools
- Or install Visual Studio Community with "Desktop development with C++" workload

**Error: "Rust not found"**
- Install Rust from https://rustup.rs/
- Restart your terminal/IDE after installation

### macOS

**Error: "xcrun: error: invalid active developer path"**
- Install Xcode Command Line Tools: `xcode-select --install`

### Linux

**Error: "webkit2gtk not found"**
- Install required dependencies:
  ```bash
  sudo apt-get update
  sudo apt-get install libwebkit2gtk-4.0-dev build-essential curl wget libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev
  ```

## First Time Setup

If this is your first time building:

1. Make sure Rust is installed and up to date:
   ```bash
   rustup update
   ```

2. Install Node dependencies:
   ```bash
   cd tauri-app
   yarn install
   ```

3. Try running in dev mode first:
   ```bash
   yarn run tauri:dev
   ```

4. If dev mode works, you can build for production:
   ```bash
   yarn run tauri:build
   ```

## Performance Tips

- **Development**: Use `yarn run tauri:dev` for hot-reload
- **Production**: Always use `yarn run tauri:build` for optimized builds
- **Debugging**: Check the console in dev mode for any WebGL or Rust errors
