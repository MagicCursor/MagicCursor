# Control Panel

## Overview

A beautiful floating control panel with color presets for the fluid cursor effects. Features a glassmorphic design with neon accents in black AMOLED style.

## Features

### Color Presets

8 stunning color themes:
- **Rainbow** 🌈 - Full spectrum of colors
- **Neon Pink** 💖 - Hot pink/magenta tones
- **Cyber Blue** 💎 - Electric blue shades
- **Toxic Green** ☢️ - Radioactive green
- **Purple Dream** 🔮 - Deep purple/violet
- **Fire** 🔥 - Red/orange flames
- **Ice** ❄️ - Cool cyan/blue
- **Gold** ✨ - Golden yellow tones

### Design

- **Glassmorphic** - Frosted glass effect with backdrop blur
- **Neon borders** - Glowing cyan/magenta accents
- **Smooth animations** - Buttery 60fps transitions
- **Responsive** - Works on all screen sizes

### Interaction

- Click the floating button (bottom-right) to open/close
- Select any preset to instantly change fluid colors
- Current preset is highlighted with neon glow
- Settings persist across sessions

## Technical Details

The control panel modifies the HSV color generation in the fluid simulation:
- `hueRange`: Controls the color spectrum [0-1]
- `saturation`: Color intensity [0-1]
- `brightness`: Color luminosity [0-1]

Colors are saved to localStorage and restored on app launch.
