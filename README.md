# ✨ Magic Cursor - Fluid Mouse Trail

**Beautiful GPU-accelerated fluid trail that follows your mouse on every website**

Magic Cursor is a production-ready browser extension that adds a mesmerizing, physics-based fluid simulation trail to your mouse cursor. Built with React, TypeScript, and WebGL, it provides a stunning visual effect without interfering with your browsing experience.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### Core Features
- 🎨 **GPU-Accelerated Fluid Simulation** - Smooth, realistic fluid dynamics using WebGL
- 🎯 **Non-Intrusive** - Overlay with `pointer-events: none` - never blocks clicks or interactions
- 🌈 **Dynamic Colors** - Automatically cycling rainbow colors
- 📱 **Touch Support** - Works with mouse, trackpad, and touch screens
- ⚡ **Performance Optimized** - Pauses when tab is hidden, handles WebGL context loss
- 🎛️ **Fully Customizable** - Extensive settings for every aspect of the effect

### User Features
- ✅ **Easy Toggle** - Enable/disable with one click from the popup
- ⚙️ **Rich Options Page** - Fine-tune pressure, curl, colors, and more
- 💾 **Settings Sync** - Your preferences sync across devices
- 🌐 **Cross-Browser** - Works on Chrome, Firefox, Opera, Edge, and all Chromium browsers

## 🚀 Installation

### For Users

#### Chrome / Edge / Brave / Opera
1. Download the latest release from the [Releases page](https://github.com/magic-cursor/magic-cursor/releases)
2. Unzip the downloaded file
3. Open `chrome://extensions` (or `edge://extensions`, `opera://extensions`)
4. Enable "Developer mode" (toggle in top right)
5. Click "Load unpacked"
6. Select the `chrome` folder from the unzipped files

#### Firefox
1. Download the latest `.xpi` file from the [Releases page](https://github.com/magic-cursor/magic-cursor/releases)
2. Open `about:addons`
3. Click the gear icon and select "Install Add-on From File"
4. Select the downloaded `.xpi` file

### For Developers

#### Prerequisites
- Node.js 10+ and npm or yarn
- Git

#### Setup
```bash
# Clone the repository
git clone https://github.com/magic-cursor/magic-cursor.git
cd magic-cursor

# Install dependencies
npm install
# or
yarn
```

#### Development
```bash
# Chrome (with hot reload)
npm run dev:chrome

# Firefox (with hot reload)
npm run dev:firefox

# Opera (with hot reload)
npm run dev:opera
```

Then load the extension from `extension/<browser>/` directory.

#### Production Build
```bash
# Build for specific browser
npm run build:chrome
npm run build:firefox
npm run build:opera

# Build for all browsers
npm run build
```

Output will be in `extension/<browser>/` and packaged as `extension/<browser>.zip`

## 🎛️ Customization

### Available Settings

#### General
- **Enable/Disable** - Turn the effect on or off
- **3D Shading** - Add depth with lighting effects
- **Transparent Background** - Use transparent or colored background

#### Visual Quality
- **Simulation Resolution** (64-512) - Physics simulation detail
- **Dye Resolution** (256-2048) - Color rendering quality

#### Fluid Behavior
- **Pressure** (0-1) - Fluid pressure intensity
- **Curl** (0-50) - Swirling vorticity strength
- **Density Dissipation** (0-10) - How fast colors fade
- **Velocity Dissipation** (0-10) - How fast motion slows

#### Mouse Interaction
- **Splat Force** (1000-15000) - Mouse movement impact
- **Splat Radius** (0.05-0.5) - Size of trail effect
- **Color Change Speed** (1-50) - Rainbow cycling speed

#### Advanced
- **Pressure Iterations** (1-50) - Simulation accuracy vs performance

## 📁 Project Structure

```
magic-cursor/
├── source/
│   ├── Background/          # Background service worker
│   ├── ContentScript/       # Injected fluid cursor overlay
│   │   ├── index.tsx       # Entry point with settings integration
│   │   └── magic-mouse.tsx # WebGL fluid simulation
│   ├── Options/            # Settings page
│   ├── Popup/              # Extension popup
│   ├── utils/              # Shared utilities
│   │   └── storage.ts      # Settings storage management
│   ├── styles/             # Global styles
│   └── manifest.json       # Extension manifest
├── views/                  # HTML templates
├── webpack.config.js       # Build configuration
└── package.json           # Dependencies and scripts
```

## 🔧 Technical Details

### Technologies
- **React 17** - UI components
- **TypeScript** - Type safety
- **WebGL 2** - GPU-accelerated rendering
- **Webpack 5** - Module bundling
- **SCSS** - Styling
- **webextension-polyfill** - Cross-browser API

### How It Works
1. Content script injects a fixed-position overlay on every page
2. React component initializes WebGL context and fluid simulation
3. Mouse/touch events create "splats" in the fluid
4. Simulation runs at 60fps with curl, pressure, and advection
5. Settings are stored in `browser.storage.sync` and applied in real-time

### Performance
- Automatically pauses when tab is hidden
- Handles WebGL context loss and restoration
- Optimized shader programs
- Configurable quality settings for different devices

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by fluid simulation techniques from [PavelDoGreat/WebGL-Fluid-Simulation](https://github.com/PavelDoGreat/WebGL-Fluid-Simulation)
- Built with [web-extension-starter](https://github.com/abhijithvijayan/web-extension-starter)

## 📧 Support

- 🐛 [Report a bug](https://github.com/magic-cursor/magic-cursor/issues)
- 💡 [Request a feature](https://github.com/magic-cursor/magic-cursor/issues)
- 📖 [Documentation](https://github.com/magic-cursor/magic-cursor/wiki)

---

Made with ❤️ by the Magic Cursor Team
