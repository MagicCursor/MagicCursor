# Magic Cursor Features

## ✨ Implemented Features

### 1. Click-Through Mode ⭐ ENHANCED
- **Toggle via System Tray**: Right-click the tray icon and select "Enable Click-Through" or "Disable Click-Through"
- **When enabled**: Mouse clicks pass through to applications below **AND** fluid effect still works via global mouse tracking!
- **When disabled**: The fluid effect responds to your mouse movements (overlay captures mouse)
- The tray menu text updates to show the current state
- Visual notification appears when toggling

**✨ Special Feature**: Unlike typical overlay applications, this app uses **global mouse tracking** when click-through is enabled. This means you get the best of both worlds:
- Clicks pass through to apps below
- Fluid effect continues to follow your cursor smoothly
- No compromise needed!

### 2. Fullscreen Mode (F11)
- **Press F11** to toggle fullscreen mode
- On Windows, the overlay covers the **entire monitor** including the taskbar area
- Uses native Windows API to ensure complete screen coverage
- Works seamlessly with the transparent overlay

### 3. Configurable Fluid Properties
Access the settings panel via the system tray menu:

#### Available Settings:
- **Pressure** (0.0 - 1.0): Controls the pressure simulation intensity
- **Curl** (0 - 30): Controls the vorticity/swirl effect
- **Splat Radius** (0.05 - 0.5): Size of the fluid splat on interaction
- **Splat Force** (1000 - 20000): Force applied to the fluid on interaction
- **Density Dissipation** (0.1 - 10): How quickly the color fades
- **Velocity Dissipation** (0.1 - 10): How quickly the motion slows down
- **Color Update Speed** (1 - 50): How fast colors change over time
- **Shading**: Enable/disable 3D-like shading effect

#### Presets:
- **Subtle**: Gentle, minimal fluid effect
- **Default**: Balanced, visually appealing
- **Intense**: Dramatic, high-energy effect

### 4. AMOLED Black Flat Design
- Pure black (#000000) background for OLED displays
- Minimal, flat design with smooth animations
- Clean typography and spacing
- Smooth transitions and hover effects
- Optimized for dark environments

### 5. System Tray Integration
Right-click the tray icon for quick access to:
- Show/Hide overlay
- Enable/Disable click-through
- Open settings panel
- Quit application

### 6. Persistent Settings
- All configuration changes are automatically saved to localStorage
- Settings persist across application restarts
- No manual save required

## 🎮 Keyboard Shortcuts

- **F11**: Toggle fullscreen mode
- **ESC**: Close settings panel (when open)

## 🎨 Design Philosophy

The settings panel follows a modern, minimal design:
- **AMOLED Black**: Pure black background (#000000) for perfect blacks on OLED screens
- **Flat Design**: No gradients, shadows are subtle and purposeful
- **Smooth Animations**: Fade-in, slide-up effects for a polished feel
- **Responsive Controls**: Sliders with smooth thumb animations
- **Clear Hierarchy**: Proper spacing and typography for easy scanning

## 🔧 Technical Details

### Windows-Specific Optimizations:
- Uses Win32 API for true fullscreen coverage
- Properly handles monitor boundaries including taskbar
- Transparent window with layered composition
- Always-on-top with tool window style to avoid taskbar entry

### Performance:
- WebGL2-based fluid simulation
- Optimized for 60 FPS
- Pauses heavy computation when tab is hidden
- Efficient memory management with framebuffer reuse

## 🚀 Usage Tips

1. **For Best Visual Effect**: Use "Intense" preset with shading enabled
2. **For Subtle Background**: Use "Subtle" preset with lower dissipation values
3. **For Performance**: Disable shading and reduce resolution settings
4. **For Click-Through**: Enable click-through mode when you need to interact with applications below
5. **For Fullscreen**: Press F11 to cover the entire screen including taskbar

## 🐛 Troubleshooting

- **Settings not opening?** Make sure the overlay is visible (not hidden via tray)
- **Click-through not working?** Toggle it off and on again via the tray menu
- **Fullscreen not covering taskbar?** Press F11 again to re-trigger the fullscreen mode
- **Performance issues?** Lower the resolution settings or disable shading
