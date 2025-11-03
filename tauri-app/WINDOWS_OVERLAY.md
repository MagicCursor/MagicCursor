# Windows Overlay Behavior

## How It Works

The app now properly overlays **everything** on Windows, including:
- ✅ Desktop
- ✅ Taskbar (bottom bar)
- ✅ Start Menu
- ✅ Auto-hide taskbar triggers
- ✅ All applications

## Technical Implementation

### Window Styles Used

1. **WS_EX_LAYERED** - Makes the window layered (required for transparency)
2. **WS_EX_TRANSPARENT** - Enables click-through (ON by default)
3. **WS_EX_TOOLWINDOW** - Prevents taskbar button, helps overlay taskbar
4. **WS_EX_NOACTIVATE** - Window never activates, stays in background
5. **HWND_TOPMOST** - Always on top of other windows

### Window Positioning

The window is positioned using `rcMonitor` (not `rcWork`) which includes:
- The entire screen area
- The taskbar area (even when visible)
- All screen edges for auto-hide taskbar triggers

## Click-Through Default

Click-through is **enabled by default**, meaning:
- The cursor effect is visible
- All clicks pass through to applications underneath
- Mouse tracking keeps the effect following your cursor
- You can still interact with the system tray to disable it

## Auto-Hide Taskbar

The overlay now properly triggers auto-hide taskbar behavior:
- Moving cursor to bottom edge will show the taskbar
- The cursor effect remains visible over the taskbar
- Clicks pass through to the taskbar when it appears

## Toggling Click-Through

Use the system tray menu to toggle:
- **Disable Click-Through** - Window becomes interactive (default state)
- **Enable Click-Through** - Window becomes non-interactive

When disabled, you can interact with the overlay UI (settings, etc.)
