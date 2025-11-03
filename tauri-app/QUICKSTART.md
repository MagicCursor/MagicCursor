# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies
```bash
cd tauri-app
yarn install
```

### 2. Run the App
```bash
yarn run tauri:dev
```

### 3. Explore Features
- **Right-click the tray icon** to access all features
- **Press F11** for fullscreen mode
- **Open Settings** to customize the fluid effect

---

## 🎮 Controls

| Action | How To |
|--------|--------|
| Open Settings | Right-click tray → Settings |
| Toggle Click-Through | Right-click tray → Enable/Disable Click-Through |
| Fullscreen | Press **F11** |
| Close Settings | Press **ESC** or click outside |
| Hide Overlay | Right-click tray → Hide |
| Show Overlay | Right-click tray → Show |
| Quit App | Right-click tray → Quit |

---

## ⚙️ Quick Settings

### Presets
Click a preset in the settings panel for instant configuration:
- **Subtle**: Gentle, minimal effect
- **Default**: Balanced, visually appealing
- **Intense**: Dramatic, high-energy

### Manual Tuning
Adjust individual sliders for custom effects:
- **Pressure**: Overall intensity
- **Curl**: Swirl/vorticity effect
- **Splat Radius**: Size of interaction
- **Splat Force**: Strength of interaction

---

## 🎨 Design Features

✅ **AMOLED Black** - Pure black (#000000) for OLED displays  
✅ **Flat Design** - Clean, minimal aesthetic  
✅ **Smooth Animations** - Polished transitions  
✅ **Persistent Settings** - Auto-saved configurations  

---

## 🔧 Building for Production

```bash
yarn run tauri:build
```

Find your built app in:
- **Windows**: `src-tauri/target/release/bundle/msi/`
- **macOS**: `src-tauri/target/release/bundle/dmg/`
- **Linux**: `src-tauri/target/release/bundle/appimage/`

---

## 💡 Tips

1. **Best Visual Effect**: Use "Intense" preset with shading enabled
2. **Subtle Background**: Use "Subtle" preset with lower dissipation
3. **Click-Through**: Enable when you need to interact with apps below
4. **Fullscreen**: Press F11 to cover entire screen including taskbar

---

## 🐛 Troubleshooting

**Settings won't open?**
- Make sure the overlay is visible (not hidden)

**Click-through not working?**
- Toggle it off and on via tray menu

**Fullscreen not covering taskbar?**
- Press F11 again to re-trigger

**Performance issues?**
- Disable shading in settings
- Use "Subtle" preset

---

## 📚 More Information

- **Full Features**: See `FEATURES.md`
- **Build Instructions**: See `BUILD_INSTRUCTIONS.md`
- **Changelog**: See `CHANGELOG.md`

---

## 🎉 Enjoy!

Your Magic Cursor overlay is now ready to use. Customize it to your liking and enjoy the beautiful fluid effects!
