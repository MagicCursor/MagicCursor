# Quick Setup Guide

## Step 1: Install Rust

If you don't have Rust installed:

### Windows
Download and run: https://win.rustup.rs/x86_64

### macOS/Linux
```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

After installation, restart your terminal.

## Step 2: Install System Dependencies

### Windows
- Install Visual Studio C++ Build Tools from: https://visualstudio.microsoft.com/visual-cpp-build-tools/
- Select "Desktop development with C++" workload

### macOS
```bash
xcode-select --install
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install libwebkit2gtk-4.0-dev build-essential curl wget file libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev
```

### Linux (Fedora)
```bash
sudo dnf install webkit2gtk4.0-devel openssl-devel curl wget file gcc gtk3-devel libappindicator-gtk3-devel librsvg2-devel
```

### Linux (Arch)
```bash
sudo pacman -S webkit2gtk base-devel curl wget file openssl gtk3 libappindicator-gtk3 librsvg
```

## Step 3: Install Node Dependencies

```bash
cd tauri-app
npm install
```

## Step 4: Create Icon Files

You need to create icon files in `src-tauri/icons/`:

- `32x32.png` - 32x32 pixels
- `128x128.png` - 128x128 pixels
- `128x128@2x.png` - 256x256 pixels
- `icon.icns` - macOS icon (can be generated from PNG)
- `icon.ico` - Windows icon (can be generated from PNG)
- `icon.png` - System tray icon (512x512 recommended)

**Quick solution**: Use a placeholder or generate from a PNG using online tools:
- https://www.icoconverter.com/ (for .ico)
- https://cloudconvert.com/png-to-icns (for .icns)

Or use the Tauri icon generator:
```bash
npm install -g @tauri-apps/cli
cargo install tauri-cli
cargo tauri icon path/to/your/icon.png
```

## Step 5: Run the App

### Development Mode
```bash
npm run tauri:dev
```

### Build for Production
```bash
npm run tauri:build
```

## Troubleshooting

### "cargo: command not found"
- Restart your terminal after installing Rust
- Or run: `source $HOME/.cargo/env` (macOS/Linux)

### "error: linker 'cc' not found"
- Install build tools (see Step 2)

### "WebView2 not found" (Windows)
- Download WebView2 Runtime: https://developer.microsoft.com/microsoft-edge/webview2/

### Icons missing error
- Create placeholder icons or use the icon generator (see Step 4)

### Transparent window not working (Linux)
- Install a compositor like `picom`:
  ```bash
  sudo apt install picom
  picom &
  ```

## Next Steps

Once running:
1. Look for the Magic Cursor icon in your system tray
2. Right-click to access controls
3. Customize settings in `src/App.tsx`
4. Enjoy your fluid cursor effect!

## Need Help?

Check the full README.md for detailed configuration options and troubleshooting.
