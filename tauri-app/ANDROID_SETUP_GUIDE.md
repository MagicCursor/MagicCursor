# Magic Cursor Android - Complete Setup Guide

## 🎨 Features

Your Magic Cursor Android app includes:

- **Glassmorphic UI**: Modern frosted glass effect with blur
- **AMOLED Dark Theme**: True black (#000000) for battery saving
- **Neon Aesthetic**: Cyberpunk-inspired gradients and glows
- **Anime Style**: Vibrant colors and smooth animations
- **System Overlay**: Touch effects across all apps
- **Background Service**: Runs continuously
- **Permission Management**: Smooth overlay permission flow

## 📱 Quick Start

### Step 1: Install Prerequisites

1. **Node.js & yarn** (already installed ✓)

2. **Android Studio**
   - Download: https://developer.android.com/studio
   - During installation, include:
     - Android SDK
     - Android SDK Platform (API 24+)
     - Android Virtual Device (for emulator)

3. **Android NDK**
   ```bash
   # Open Android Studio
   # Tools > SDK Manager > SDK Tools tab
   # Check "NDK (Side by side)" and click Apply
   ```

4. **Rust Android Targets**
   ```bash
   rustup target add aarch64-linux-android armv7-linux-androideabi
   ```

### Step 2: Configure Environment

**Windows (PowerShell):**
```powershell
# Add to your PowerShell profile or run each time
$env:ANDROID_HOME = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"
$env:NDK_HOME = "$env:ANDROID_HOME\ndk\26.1.10909125"  # Check your NDK version
$env:PATH += ";$env:ANDROID_HOME\platform-tools"
```

**Linux/Mac:**
```bash
# Add to ~/.bashrc or ~/.zshrc
export ANDROID_HOME=$HOME/Android/Sdk
export NDK_HOME=$ANDROID_HOME/ndk/26.1.10909125  # Check your NDK version
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### Step 3: Initialize Android Project

```bash
cd tauri-app
yarn run android:init
```

This creates the Android project structure in `src-tauri/gen/android/`

### Step 4: Configure Android Manifest

Edit `src-tauri/gen/android/app/src/main/AndroidManifest.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    
    <!-- Required Permissions -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE_SPECIAL_USE" />
    
    <application
        android:label="Magic Cursor"
        android:icon="@mipmap/ic_launcher"
        android:theme="@style/Theme.AppCompat.NoActionBar"
        android:allowBackup="true"
        android:supportsRtl="true">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTask"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize">
            
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
        
        <!-- Foreground Service for Overlay -->
        <service
            android:name=".OverlayService"
            android:enabled="true"
            android:exported="false"
            android:foregroundServiceType="specialUse">
            <property
                android:name="android.app.PROPERTY_SPECIAL_USE_FGS_SUBTYPE"
                android:value="overlay" />
        </service>
    </application>
</manifest>
```

### Step 5: Build APK

**Development Build (Debug):**
```bash
yarn run android:dev
```

**Production Build (Release):**
```bash
yarn run android:build:release
```

**Output Location:**
```
src-tauri/gen/android/app/build/outputs/apk/release/app-release.apk
```

## 🎯 Testing

### On Emulator

1. **Create AVD in Android Studio:**
   - Tools > Device Manager > Create Device
   - Choose Pixel 6 or similar
   - System Image: Android 12+ (API 31+)
   - Graphics: Hardware - GLES 3.0

2. **Run:**
   ```bash
   yarn run android:dev
   ```

### On Physical Device

1. **Enable Developer Mode:**
   - Settings > About Phone
   - Tap "Build Number" 7 times

2. **Enable USB Debugging:**
   - Settings > Developer Options
   - Enable "USB Debugging"

3. **Connect & Run:**
   ```bash
   adb devices  # Verify device is connected
   yarn run android:dev
   ```

## 🔐 Signing for Release

### Generate Keystore

```bash
keytool -genkey -v -keystore magic-cursor-release.keystore \
  -alias magic-cursor \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

### Configure Signing

Create `src-tauri/gen/android/keystore.properties`:

```properties
storePassword=your-store-password
keyPassword=your-key-password
keyAlias=magic-cursor
storeFile=../../../magic-cursor-release.keystore
```

Edit `src-tauri/gen/android/app/build.gradle`:

```gradle
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    signingConfigs {
        release {
            if (keystorePropertiesFile.exists()) {
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
                storeFile file(keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
            }
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

## 🎨 UI Design Details

### Color Palette

```css
/* AMOLED Black */
background: #000000

/* Neon Gradients */
primary: linear-gradient(135deg, #8a2be2, #ff00ff)  /* Purple to Magenta */
secondary: linear-gradient(135deg, #00ffff, #0080ff) /* Cyan to Blue */

/* Glass Effect */
glass-bg: rgba(10, 10, 15, 0.7)
glass-border: rgba(255, 255, 255, 0.1)
backdrop-filter: blur(20px)

/* Neon Glow */
glow-purple: rgba(138, 43, 226, 0.5)
glow-cyan: rgba(0, 255, 255, 0.5)
```

### Animations

- **Fade In**: 0.6s ease-out
- **Slide Up**: 0.4s ease-out
- **Gradient Shift**: 8s infinite
- **Pulse**: 3s ease-in-out infinite
- **Button Press**: 0.3s scale(0.95)

## 📊 Performance Optimization

### Memory Usage
- Target: < 100MB RAM
- WebView optimization enabled
- Efficient canvas rendering

### Battery Usage
- AMOLED black saves power
- Optimized touch tracking
- Efficient background service

### APK Size
- Expected: 15-25 MB
- Minified and optimized
- ProGuard enabled for release

## 🐛 Troubleshooting

### "NDK not found"
```bash
# Install NDK via Android Studio SDK Manager
# Or set NDK_HOME to correct path
```

### "Permission denied" on device
```bash
# Manually grant overlay permission:
# Settings > Apps > Magic Cursor > Display over other apps
```

### Build fails with "SDK not found"
```bash
# Set ANDROID_HOME correctly
# Verify: echo $ANDROID_HOME (Linux/Mac) or $env:ANDROID_HOME (Windows)
```

### App crashes on start
```bash
# Check logcat for errors
adb logcat | grep MagicCursor
```

### Overlay not showing
```bash
# Ensure SYSTEM_ALERT_WINDOW permission is granted
# Check Settings > Apps > Magic Cursor > Permissions
```

## 📦 Distribution

### Google Play Store

1. Build AAB (Android App Bundle):
   ```bash
   yarn run tauri android build -- --target aab
   ```

2. Upload to Google Play Console
3. Fill in store listing
4. Submit for review

### Direct APK Distribution

1. Build signed release APK
2. Host on your website
3. Users must enable "Install from Unknown Sources"

## 🚀 Next Steps

1. Test on multiple Android versions (7.0 - 14)
2. Optimize for different screen sizes
3. Add more color presets
4. Implement settings persistence
5. Add haptic feedback
6. Create app icon variants

## 📝 Notes

- Minimum Android version: 7.0 (API 24)
- Target Android version: 14 (API 34)
- Requires OpenGL ES 3.0
- Works best on AMOLED displays
- Background service keeps overlay running

## 🎉 You're Ready!

Your Magic Cursor Android app is now configured with:
- ✅ Modern glassmorphic UI
- ✅ AMOLED dark theme
- ✅ Neon anime aesthetic
- ✅ System-wide overlay
- ✅ Background service
- ✅ Permission handling

Build and enjoy! 🌈✨
