# Click-Through Behavior

## Default State

Click-through is **ENABLED by default** when the app starts:
- The cursor effect is visible
- All clicks pass through to applications underneath
- Mouse tracking keeps the effect following your cursor

## Settings Interaction

When you open settings (via system tray):
1. Click-through is **automatically disabled**
2. You can now interact with the settings panel
3. When you close settings, click-through is **automatically restored** to its previous state

This ensures you can always access and modify settings without manually toggling click-through.

## Manual Toggle

You can manually toggle click-through via the system tray menu:
- **"Disable Click-Through"** - Makes the window interactive (when currently enabled)
- **"Enable Click-Through"** - Makes clicks pass through (when currently disabled)

## How It Works

### Frontend (App.tsx)
- Tracks the click-through state before opening settings
- Calls `set_click_through(false)` when settings open
- Restores previous state when settings close

### Backend (main.rs)
- New `set_click_through` command allows frontend to control click-through
- Existing `toggle_click_through` command for tray menu toggle
- Both update the window styles and mouse tracking appropriately

## Platform Support

- **Windows**: Uses `WS_EX_TRANSPARENT` flag
- **macOS**: Uses `setIgnoresMouseEvents_`
- **Linux**: Uses Tauri's `set_ignore_cursor_events`
