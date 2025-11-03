# UI Guide - Visual Reference

## 🎨 User Interface Overview

### System Tray Menu
```
┌─────────────────────────────┐
│  Magic Cursor               │
├─────────────────────────────┤
│  Show                       │
│  Hide                       │
├─────────────────────────────┤
│  Enable Click-Through       │  ← Toggles to "Disable" when active
│  Settings                   │
├─────────────────────────────┤
│  Quit                       │
└─────────────────────────────┘
```

---

## ⚙️ Settings Panel

### Layout
```
┌────────────────────────────────────────────┐
│  Fluid Settings                         ×  │  ← Header with close button
├────────────────────────────────────────────┤
│                                            │
│  PRESETS                                   │
│  ┌────────┐ ┌────────┐ ┌────────┐        │
│  │ Subtle │ │Default │ │Intense │        │  ← Quick presets
│  └────────┘ └────────┘ └────────┘        │
│                                            │
│  Pressure                           0.10   │  ← Value display
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │  ← Slider
│                                            │
│  Curl                                3.0   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                            │
│  Splat Radius                       0.20   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                            │
│  Splat Force                        6000   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                            │
│  Density Dissipation                3.5   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                            │
│  Velocity Dissipation               2.0   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                            │
│  Color Update Speed                  10   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                            │
│  ☑ Enable Shading                         │  ← Checkbox
│                                            │
├────────────────────────────────────────────┤
│         Press ESC to close                 │  ← Footer hint
└────────────────────────────────────────────┘
```

### Color Scheme
- **Background**: Pure black (#000000)
- **Panel**: Black with subtle border (#1a1a1a)
- **Text**: White (#ffffff) and gray (#666, #888)
- **Sliders**: White thumb on dark track
- **Buttons**: Dark with hover effects

---

## 🔔 Click-Through Notification

### When Enabled
```
┌────────────────────────────────────┐
│  👆  Click-Through Enabled         │
│      Clicks pass through to apps   │
│      below                         │
└────────────────────────────────────┘
```

### When Disabled
```
┌────────────────────────────────────┐
│  🖱️  Click-Through Disabled        │
│      Fluid effect responds to      │
│      mouse                         │
└────────────────────────────────────┘
```

**Behavior**:
- Appears at top center of screen
- Slides down smoothly
- Auto-dismisses after 2 seconds
- AMOLED black background
- Subtle shadow and blur

---

## 🎮 Interaction States

### Slider Interaction
```
Normal:     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            ○                                      (18px thumb)

Hover:      ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            ⬤                                      (22px thumb, scaled)

Active:     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            ●                                      (20px thumb)
```

### Button Interaction
```
Normal:     ┌────────┐
            │ Subtle │
            └────────┘

Hover:      ┌────────┐  ← Slightly elevated
            │ Subtle │     Background lighter
            └────────┘

Active:     ┌────────┐  ← Pressed down
            │ Subtle │
            └────────┘
```

---

## 🎨 Design Principles

### Typography
- **Headers**: 24px, weight 600, letter-spacing -0.5px
- **Labels**: 14px, weight 500
- **Values**: 14px, weight 400, tabular-nums
- **Hints**: 12px, color #666

### Spacing
- **Panel Padding**: 24px
- **Section Gap**: 32px
- **Control Gap**: 28px
- **Label-Slider Gap**: 12px
- **Button Gap**: 12px

### Borders
- **Panel**: 1px solid #1a1a1a
- **Radius**: 16px (panel), 12px (notification), 8px (buttons)

### Shadows
- **Panel**: 0 20px 60px rgba(0, 0, 0, 0.9)
- **Notification**: 0 8px 32px rgba(0, 0, 0, 0.8)
- **Slider Thumb**: 0 2px 8px rgba(255, 255, 255, 0.2)

### Animations
```css
/* Panel entrance */
@keyframes slideUp {
  from: translateY(20px), opacity 0
  to:   translateY(0),    opacity 1
  duration: 0.3s ease-out
}

/* Overlay fade */
@keyframes fadeIn {
  from: opacity 0
  to:   opacity 1
  duration: 0.2s ease-out
}

/* Notification */
@keyframes slideDown {
  from: translateY(-20px), opacity 0
  to:   translateY(0),     opacity 1
  duration: 0.3s ease-out
}
```

---

## 📱 Responsive Behavior

### Settings Panel
- **Width**: 90% of screen, max 500px
- **Height**: Max 90vh with scroll
- **Centered**: Horizontally and vertically
- **Scrollbar**: Custom styled (8px, dark)

### Notification
- **Position**: Top center, 24px from top
- **Width**: Auto-sized to content
- **Alignment**: Centered with transform

---

## 🎯 Z-Index Hierarchy

```
Layer 5: Click-Through Notification (1000001)
         ↑
Layer 4: Settings Panel (1000000)
         ↑
Layer 3: Settings Overlay (1000000)
         ↑
Layer 2: (Reserved for future UI)
         ↑
Layer 1: Fluid Canvas (1)
         ↑
Layer 0: Background (transparent)
```

---

## 🌈 Visual Effects

### Hover Effects
- **Buttons**: Background lightens, slight elevation
- **Sliders**: Thumb scales up 1.2x
- **Close Button**: Background appears, color brightens

### Focus States
- **Sliders**: Thumb glows with shadow
- **Checkboxes**: Accent color highlight
- **Buttons**: Subtle outline

### Transitions
- **All Interactive Elements**: 0.2s ease
- **Smooth, not jarring**
- **Consistent timing**

---

## 🎨 AMOLED Optimization

### Why Pure Black?
- **OLED Displays**: Pixels turn off completely
- **Battery Saving**: Reduced power consumption
- **Visual Contrast**: Maximum readability
- **Modern Aesthetic**: Clean, professional look

### Color Choices
```
#000000 - Pure black (OLED off)
#0a0a0a - Barely visible separation
#1a1a1a - Subtle borders and dividers
#2a2a2a - Hover states
#ffffff - Primary text (maximum contrast)
#888888 - Secondary text
#666666 - Tertiary text and hints
```

---

## 📐 Measurements Reference

### Panel
- Width: 500px max, 90% on smaller screens
- Height: 90vh max with scroll
- Border Radius: 16px
- Border: 1px solid #1a1a1a
- Padding: 24px

### Controls
- Slider Height: 4px track, 18px thumb
- Button Height: 44px (touch-friendly)
- Checkbox Size: 20x20px
- Input Gap: 28px between controls

### Text
- Header: 24px / 600 weight
- Label: 14px / 500 weight
- Value: 14px / 400 weight
- Hint: 12px / 400 weight

---

## 🎉 Final Result

A beautiful, modern, AMOLED-optimized settings panel with:
- ✅ Pure black background
- ✅ Flat, minimal design
- ✅ Smooth animations
- ✅ Responsive controls
- ✅ Professional typography
- ✅ Intuitive layout
- ✅ Accessible contrast
- ✅ Touch-friendly sizing

**Perfect for OLED displays and dark environments!** 🌙
