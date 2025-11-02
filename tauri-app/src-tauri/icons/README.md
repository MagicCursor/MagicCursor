# Icon Files

This directory should contain the following icon files:

- `32x32.png` - 32x32 pixels
- `128x128.png` - 128x128 pixels  
- `128x128@2x.png` - 256x256 pixels
- `icon.icns` - macOS icon bundle
- `icon.ico` - Windows icon
- `icon.png` - System tray icon (512x512 recommended)

## Quick Generation

If you have a source PNG image (at least 512x512), you can use:

```bash
# Install Tauri CLI if not already installed
npm install -g @tauri-apps/cli

# Generate all icon formats from a single PNG
cargo tauri icon path/to/your/source-icon.png
```

This will automatically generate all required icon formats.

## Manual Creation

Alternatively, create icons manually using:
- Online converters: https://www.icoconverter.com/
- Image editors: GIMP, Photoshop, etc.
- Command line tools: ImageMagick

## Placeholder Icons

For development, you can use simple colored squares as placeholders until you have proper icons designed.
