# Welcome Screen

## Overview

A stunning first-launch welcome screen with celebration animations in a black AMOLED with neon aesthetic.

## Features

### Visual Design
- **Black AMOLED background** - Pure black (#000000) for OLED displays
- **Neon gradient colors** - Magenta (#ff00ff), Cyan (#00ffff), Yellow (#ffff00)
- **Glassmorphic elements** - Frosted glass effect with backdrop blur
- **Anime-inspired aesthetic** - Clean, modern, vibrant

### Animations

1. **Floating Particles** (50 particles)
   - Subtle cyan glowing dots
   - Float upward with fade in/out
   - Staggered animation delays

2. **Pulsing Neon Rings** (3 rings)
   - Expand outward from center
   - Different colors: magenta, cyan, yellow
   - Continuous pulse effect

3. **Confetti** (30 pieces)
   - Falls from top with rotation
   - Random neon colors
   - Celebratory feel

4. **Rotating Icon**
   - Star/sparkle shape with gradient fill
   - Continuous 360° rotation
   - Pulsing glow effect

5. **Text Animations**
   - Title scales and rotates in
   - Subtitle fades up
   - Features float in with delay

6. **Bottom Glow**
   - Radial gradient pulse
   - Adds depth to the scene

### Performance

- **Pure CSS animations** - Hardware accelerated
- **No heavy JavaScript** - Minimal runtime overhead
- **Optimized rendering** - Uses transform and opacity for 60fps
- **Efficient particles** - Lightweight DOM elements

### Timing

1. **0-500ms**: Initial fade in
2. **500ms**: Icon and title appear
3. **1500ms**: Subtitle appears
4. **2500ms**: Features appear
5. **5000ms**: Fade out begins
6. **5800ms**: Complete and unmount

Total duration: ~6 seconds

## User Experience

### First Launch
- Automatically shows on first app launch
- Stored in localStorage: `hasSeenWelcome`
- Click-through is disabled during welcome
- Re-enables after completion

### Interaction
- Non-interactive (no buttons to click)
- Automatic progression
- Smooth transitions throughout

## Technical Details

### Components
- `Welcome.tsx` - React component with timing logic
- `Welcome.css` - All animations and styling

### Integration
- Imported in `App.tsx`
- Conditionally rendered based on `showWelcome` state
- Manages click-through state automatically

### Customization

To adjust timing, modify these values in `Welcome.tsx`:
```typescript
setTimeout(() => setStage(1), 500),   // Icon/title
setTimeout(() => setStage(2), 1500),  // Subtitle
setTimeout(() => setStage(3), 2500),  // Features
setTimeout(() => {                     // Complete
  setShow(false);
  setTimeout(onComplete, 800);
}, 5000),
```

To change colors, update CSS variables:
- Magenta: `#ff00ff`
- Cyan: `#00ffff`
- Yellow: `#ffff00`

## Testing

To see the welcome screen again:
1. Open browser DevTools (F12)
2. Go to Application > Local Storage
3. Delete the `hasSeenWelcome` key
4. Reload the app

Or run in console:
```javascript
localStorage.removeItem('hasSeenWelcome');
location.reload();
```
