# Theme Customizer Guide

## Overview

The enhanced Theme Customizer provides advanced color customization options for your Magic Mouse fluid effects. Create, save, and share custom color themes with professional-grade tools.

## Features

### 🎨 Interactive Color Wheel
- **Visual Color Selection**: Click anywhere on the color wheel to select hue and saturation
- **Real-time Preview**: See changes instantly as you adjust colors
- **Dual Mode**: Switch between color wheel and slider modes for precision control

### 🌈 Color Harmony Tools
Generate professional color schemes automatically:
- **Complementary**: Creates opposite colors on the color wheel
- **Analogous**: Generates adjacent colors for smooth transitions
- **Triadic**: Creates three evenly-spaced colors for vibrant combinations
- **Randomize**: Generates random color combinations for experimentation

### 🎛️ Advanced Controls

#### Per-Color Settings
- **Hue** (0-360°): The base color on the spectrum
- **Saturation** (0-100%): Color intensity (0% = gray, 100% = vivid)
- **Brightness** (0-100%): Lightness of the color
- **Opacity** (0-100%): Transparency level
- **Weight** (0-100%): How frequently this color appears in the effect

#### Theme Settings
- **Blend Modes**:
  - **Smooth**: Gradual color transitions
  - **Distinct**: Sharp color boundaries
  - **Random**: Unpredictable color mixing
  - **Radial**: Circular color patterns
  - **Wave**: Flowing wave-like patterns

- **Speed** (1-50): How quickly colors change
- **Intensity** (0-200%): Overall effect strength
- **Rotation** (0-360°): Rotate the color pattern
- **Scale** (50-200%): Size of color patterns

### 📦 Preset Themes
Quick-start with 8 professionally designed themes:
- **Sunset**: Warm oranges, pinks, and purples
- **Ocean**: Cool cyans, blues, and teals
- **Forest**: Natural greens and limes
- **Candy**: Vibrant pinks, yellows, and cyans
- **Neon**: Electric blues, hot pinks, and limes
- **Aurora**: Ethereal teals, purples, and greens
- **Monochrome**: Classic black and white
- **Fire & Ice**: Contrasting reds and blues

### 💾 Import/Export
- **Export**: Save your custom themes as JSON files
- **Import**: Load previously saved themes
- **Share**: Exchange themes with other users

## How to Use

### Opening the Customizer

#### Desktop (Windows/Linux)
1. Right-click the system tray icon
2. Select "Theme Customizer"

#### Android
1. Open the app
2. Tap the menu button
3. Select "Theme Customizer"

### Creating a Custom Theme

1. **Start with a Preset** (optional)
   - Click any preset theme as a starting point
   - Or start from scratch with the default theme

2. **Add Colors**
   - Click "+ Add Color" to add new colors
   - Use color harmony tools for professional combinations

3. **Adjust Each Color**
   - Select a color from the list
   - Use the color wheel or sliders to adjust
   - Fine-tune opacity and weight

4. **Configure Theme Settings**
   - Choose a blend mode
   - Adjust speed and intensity
   - Toggle "Advanced" for rotation and scale

5. **Preview**
   - Watch the live preview at the top
   - See how colors blend and transition

6. **Save**
   - Click "Save" to apply your theme
   - Use "Export Theme" to save as a file

### Tips for Great Themes

#### Color Selection
- **Use 2-4 colors** for clean, professional looks
- **Use 5+ colors** for complex, dynamic effects
- **Adjust weight** to make certain colors more prominent

#### Harmony
- **Complementary** works great for high contrast
- **Analogous** creates smooth, harmonious flows
- **Triadic** provides balanced, vibrant themes

#### Performance
- **Lower intensity** for subtle background effects
- **Higher speed** for energetic, fast-moving patterns
- **Radial/Wave modes** create unique visual effects

#### Platform-Specific
- **Android**: Use higher opacity for visibility over apps
- **Windows/Linux**: Lower opacity works well for desktop overlays

## Keyboard Shortcuts

- **Esc**: Close customizer
- **Ctrl+S**: Save theme (when focused)
- **Ctrl+E**: Export theme
- **Ctrl+I**: Import theme

## Technical Details

### Color Format
Colors are stored in HSB (Hue, Saturation, Brightness) format:
- **Hue**: 0.0-1.0 (normalized 0-360°)
- **Saturation**: 0.0-1.0 (0-100%)
- **Brightness**: 0.0-1.0 (0-100%)
- **Opacity**: 0.0-1.0 (0-100%)
- **Weight**: 0.0-1.0 (0-100%)

### Theme File Structure
```json
{
  "id": "unique-id",
  "name": "My Custom Theme",
  "colors": [
    {
      "id": "1",
      "name": "Color 1",
      "hue": 0.5,
      "saturation": 1.0,
      "brightness": 1.0,
      "weight": 1.0,
      "opacity": 1.0
    }
  ],
  "blendMode": "smooth",
  "speed": 10,
  "intensity": 1.0,
  "rotation": 0,
  "scale": 1.0
}
```

### Storage
- **Desktop**: Themes saved in localStorage
- **Android**: Themes saved in app preferences
- **Export**: JSON files can be shared across platforms

## Troubleshooting

### Colors Not Showing
- Check opacity is above 0%
- Verify weight is above 0%
- Ensure at least one color exists

### Performance Issues
- Reduce number of colors (use 2-4)
- Lower intensity setting
- Use "Smooth" blend mode
- Decrease speed

### Theme Won't Save
- Ensure theme has a name
- Check at least one color exists
- Try exporting as backup

### Import Fails
- Verify JSON file format
- Check file isn't corrupted
- Ensure all required fields present

## Platform Compatibility

### Windows
✅ Full support for all features
✅ Color wheel with mouse interaction
✅ Import/export functionality
✅ System tray integration

### Linux
✅ Full support for all features
✅ Color wheel with mouse interaction
✅ Import/export functionality
✅ System tray integration

### Android
✅ Touch-optimized color wheel
✅ Mobile-friendly UI
✅ Import/export via file picker
✅ Persistent theme storage

## Advanced Usage

### Creating Theme Packs
1. Create multiple themes
2. Export each as JSON
3. Share the collection
4. Users can import individually

### Animation Techniques
- **Slow + Smooth**: Calming, ambient effects
- **Fast + Distinct**: Energetic, party mode
- **Medium + Radial**: Hypnotic, mesmerizing
- **Slow + Wave**: Flowing, organic movement

### Color Psychology
- **Blue/Cyan**: Calm, professional, focused
- **Red/Orange**: Energetic, warm, exciting
- **Green**: Natural, balanced, refreshing
- **Purple**: Creative, mysterious, luxurious
- **Yellow**: Happy, optimistic, attention-grabbing

## Future Enhancements

Planned features for future releases:
- Gradient editor
- Animation timeline
- Color palette import from images
- Community theme sharing
- Preset categories
- Theme preview animations
- Color blindness filters
- Accessibility options

## Support

For issues or questions:
- Check the main README.md
- Review TROUBLESHOOTING.md
- Submit issues on GitHub
- Join community discussions

---

**Enjoy creating beautiful, personalized themes!** 🎨✨
