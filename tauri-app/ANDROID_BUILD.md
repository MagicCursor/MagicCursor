# Android Build Instructions

## Prerequisites

1. **Install Android Studio**
   - Download from: https://developer.android.com/studio
   - Install Android SDK (API 24 or higher)
   - Install Android NDK

2. **Install Rust Android Targets**
   ```bash
   rustup target add aarch64-linux-android
   rustup target add armv7-linux-androideabi
   rustup target add i686-linux-android
   rustup target add x86_64-linux-android
   ```

3. **Install Tauri CLI with Android support**
   ```bash
   npm install -g @tauri-apps/cli@next
   ```

4. **Set Environment Variables**
   
   Windows (PowerShell):
   ```powershell
   $env:ANDROID_HOME = "C:\Users\YourUsername\AppData\Local\Android\Sdk"
   $env:NDK_HOME = "$env:ANDROID_HOME\ndk\<version>"
   ```

   Linux/Mac:
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export NDK_HOME=$ANDROID_HOME/ndk/<version>
   ```

## Initialize Android Project

1. **Initialize Tauri Android**
   ```bash
   cd tauri-app
   yarn run tauri android init
   ```

2. **Configure Android Manifest**
   The manifest will be auto-generated at `src-tauri/gen/android/AndroidManifest.xml`
   
   Add these permissions:
   ```xml
   <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
   <uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
   <uses-permission android:name="android.permission.INTERNET" />
   ```

## Build APK

### Development Build
```bash
yarn run tauri android dev
```

### Production Build (Release APK)
```bash
yarn run tauri android build
```

The APK will be generated at:
```
src-tauri/gen/android/app/build/outputs/apk/release/app-release.apk
```

## Build AAB (for Google Play)
```bash
yarn run tauri android build -- --target aab
```

## Features

### Android-Specific Features
- ✨ Glassmorphic AMOLED dark theme
- 🎨 Neon anime aesthetic UI
- 🔒 Overlay permission handling
- 📱 System-wide touch effect overlay
- ⚡ Background service support
- 🎯 Optimized for mobile performance

### Permissions Required
- **SYSTEM_ALERT_WINDOW**: Display overlay over other apps
- **FOREGROUND_SERVICE**: Run in background
- **INTERNET**: Load web content (if needed)

## Testing

### Run on Emulator
1. Start Android Emulator from Android Studio
2. Run: `yarn run tauri android dev`

### Run on Physical Device
1. Enable Developer Options on your Android device
2. Enable USB Debugging
3. Connect device via USB
4. Run: `yarn run tauri android dev`

## Signing APK for Release

1. **Generate Keystore**
   ```bash
   keytool -genkey -v -keystore magic-cursor.keystore -alias magic-cursor -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Configure Signing in build.gradle**
   Edit `src-tauri/gen/android/app/build.gradle`:
   ```gradle
   android {
       signingConfigs {
           release {
               storeFile file("path/to/magic-cursor.keystore")
               storePassword "your-password"
               keyAlias "magic-cursor"
               keyPassword "your-password"
           }
       }
       buildTypes {
           release {
               signingConfig signingConfigs.release
           }
       }
   }
   ```

3. **Build Signed APK**
   ```bash
   yarn run tauri android build -- --release
   ```

## Troubleshooting

### NDK Not Found
- Ensure NDK is installed via Android Studio SDK Manager
- Set NDK_HOME environment variable correctly

### Build Fails
- Clean build: `yarn run tauri android build -- --clean`
- Update dependencies: `yarn install`
- Rebuild Rust: `cargo clean` in src-tauri folder

### Permission Denied on Device
- Go to Settings > Apps > Magic Cursor > Permissions
- Enable "Display over other apps"

## Performance Optimization

The Android build includes:
- WebView optimization for mobile
- Reduced memory footprint
- Battery-efficient rendering
- Touch event optimization
- AMOLED-optimized dark theme (true black)

## File Size

Expected APK size: ~15-25 MB (depending on architecture)

## Minimum Requirements

- Android 7.0 (API 24) or higher
- 2GB RAM minimum
- OpenGL ES 3.0 support
