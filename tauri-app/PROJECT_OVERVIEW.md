# Magic Cursor Desktop - Project Overview

## Architecture

This is a **Tauri-based desktop application** that creates a transparent, always-on-top overlay window displaying a GPU-accelerated fluid cursor effect.

### Technology Stack

**Frontend:**
- React 18 (UI framework)
- TypeScript (type safety)
- Vite (build tool & dev server)
- WebGL (GPU-accelerated fluid simulation)

**Backend:**
- Rust (native performance)
- Tauri 1.5 (desktop framework)
- Platform-specific APIs (Windows/macOS/Linux)

## How It Works

### 1. Transparent Overlay Window

The application creates a frameless, transparent window that:
- Spans the entire screen
- Stays always on top of other windows
- Has no decorations (title bar, borders)
- Is hidden from the taskbar

### 2. Click-Through Capability

Platform-specific code makes the window "click-through":

**Windows**: Uses `WS_EX_TRANSPARENT` extended window style
**macOS**: Uses `setIgnoresMouseEvents` on NSWindow
**Linux**: Uses GTK's `set_input_shape_combine_region`

This allows mouse events to pass through to applications below.

### 3. Fluid Simulation

The `MagicMouse.tsx` component implements a real-time fluid dynamics simulation using WebGL:

- **Navier-Stokes equations** for fluid motion
- **Advection** for moving colors and velocity
- **Pressure solver** for incompressibility
- **Vorticity confinement** for swirling effects
- **Double buffering** for smooth rendering

### 4. System Tray Integration

The Rust backend provides a system tray icon with controls:
- Show/Hide overlay
- Toggle click-through mode
- Quit application

## Key Files

### Frontend
- `src/components/MagicMouse.tsx` - Main fluid effect component (1000+ lines)
- `src/App.tsx` - React app entry point
- `src/main.tsx` - React DOM mounting
- `index.html` - HTML template

### Backend
- `src-tauri/src/main.rs` - Tauri main process with platform-specific code
- `src-tauri/tauri.conf.json` - Window configuration
- `src-tauri/Cargo.toml` - Rust dependencies

### Configuration
- `vite.config.ts` - Vite build configuration
- `tsconfig.json` - TypeScript configuration
- `package.json` - Node dependencies and scripts

## Build Process

### Development
1. Vite dev server runs on `localhost:1420`
2. Tauri creates a window loading the dev server
3. Hot reload enabled for React components

### Production
1. Vite builds optimized React bundle to `dist/`
2. Tauri bundles the app with embedded webview
3. Platform-specific installers created

## Platform Differences

### Windows
- Uses Win32 API for window manipulation
- Requires WebView2 runtime
- Builds `.exe` and `.msi` installers

### macOS
- Uses Cocoa/AppKit for window manipulation
- Uses native WebKit
- Builds `.app` bundle and `.dmg` image

### Linux
- Uses GTK for window manipulation
- Uses WebKitGTK
- Builds `.deb`, `.AppImage`, `.rpm`

## Performance Considerations

### GPU Acceleration
- WebGL offloads computation to GPU
- Fluid simulation runs at 60 FPS
- Resolution parameters control quality vs performance

### Memory Usage
- Framebuffers use GPU memory
- Double buffering for velocity, dye, and pressure
- Typical usage: 50-100 MB RAM

### CPU Usage
- Minimal when idle (pauses when window hidden)
- Main loop runs via `requestAnimationFrame`
- Event-driven architecture

## Security

### Tauri Security Features
- Content Security Policy (CSP) configured
- Limited API surface (only window controls exposed)
- No remote code execution
- Sandboxed webview

### Permissions
- No network access required
- No file system access
- Only window manipulation APIs enabled

## Customization Points

### Visual Effects
Modify props in `src/App.tsx`:
- Resolution (quality vs performance)
- Dissipation rates (fade speed)
- Force and radius (effect size)
- Colors (HSV generation in component)

### Window Behavior
Modify `src-tauri/tauri.conf.json`:
- Window size and position
- Transparency settings
- Always-on-top behavior
- Skip taskbar option

### System Tray
Modify `src-tauri/src/main.rs`:
- Menu items
- Event handlers
- Click-through toggle logic

## Future Enhancements

Potential improvements:
- [ ] Settings UI for runtime configuration
- [ ] Multiple effect presets
- [ ] Keyboard shortcuts
- [ ] Auto-start on system boot
- [ ] Multi-monitor support optimization
- [ ] Performance profiling UI
- [ ] Custom color schemes
- [ ] Effect intensity slider

## Debugging

### Frontend Debugging
- Open DevTools in the Tauri window
- Console logs visible in DevTools
- React DevTools compatible

### Backend Debugging
- Rust logs appear in terminal
- Use `println!` or `dbg!` macros
- Cargo build errors shown during compilation

### Common Issues
- **Black screen**: Check WebGL support
- **No transparency**: Check compositor (Linux)
- **High CPU**: Lower resolution settings
- **Crashes**: Check Rust panic messages in terminal

## Comparison to Browser Extension

| Feature | Browser Extension | Desktop App |
|---------|------------------|-------------|
| Scope | Single browser | System-wide |
| Performance | Limited by browser | Native performance |
| Permissions | Browser sandbox | System-level |
| Installation | Extension store | Direct install |
| Updates | Auto-update | Manual/auto-update |
| Startup | Per-browser | System startup |

## Contributing

When modifying:
1. Frontend changes: Edit React components, test with `yarn run tauri:dev`
2. Backend changes: Edit Rust code, rebuild with Cargo
3. Configuration: Update JSON files, restart dev server
4. Icons: Replace files in `src-tauri/icons/`

## Resources

- [Tauri Documentation](https://tauri.app/)
- [WebGL Fundamentals](https://webglfundamentals.org/)
- [Fluid Simulation Theory](https://www.dgp.toronto.edu/public_user/stam/reality/Research/pdf/GDC03.pdf)
- [Rust Book](https://doc.rust-lang.org/book/)
