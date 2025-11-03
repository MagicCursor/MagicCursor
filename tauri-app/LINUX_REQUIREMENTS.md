# Linux Requirements

## Click-Through Mouse Tracking

For the click-through feature to work properly on Linux, you need these X11 utilities installed:

### Ubuntu/Debian
```bash
sudo apt-get install xdotool x11-utils
```

### Fedora/RHEL
```bash
sudo dnf install xdotool xorg-x11-utils
```

### Arch Linux
```bash
sudo pacman -S xdotool xorg-xdpyinfo
```

## Why These Tools?

- **xdotool**: Gets real-time mouse cursor position when click-through is enabled
- **xdpyinfo** (x11-utils): Provides screen dimensions for proper coordinate mapping

## Wayland Support

Note: The current implementation uses X11 tools. For Wayland, the click-through API works via Tauri's built-in support, but global mouse tracking may have limitations depending on the compositor.

## Testing Click-Through

1. Enable click-through from the system tray menu
2. The cursor overlay should still be visible
3. Clicks should pass through to applications underneath
4. Mouse tracking keeps the overlay following your cursor
