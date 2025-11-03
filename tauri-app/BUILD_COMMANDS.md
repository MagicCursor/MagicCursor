# Quick Build Commands Reference

## Platform-Specific Builds

### Windows (MSI + EXE)
```bash
yarn run tauri:windows
```
Outputs: `.msi` (Windows Installer) + `.exe` (Portable)

### Linux (DEB, AppImage)
```bash
yarn run tauri:linux
```
Outputs: `.deb`, `.AppImage`

### Android (APK)
```bash
yarn run tauri:android
```
Outputs: `.apk` (all architectures)

### iOS (IPA)
```bash
yarn run tauri:ios
```
Outputs: `.ipa`

### Build All Platforms
```bash
yarn run tauri:build
```
Attempts to build for all platforms (requires all toolchains)

## First-Time Setup

### Android
```bash
yarn run android:init
```

### iOS
```bash
yarn run ios:init
```

## Development Mode

```bash
# Desktop
yarn run tauri:dev

# Android
yarn run android:dev

# iOS
yarn run ios:dev
```

## Check Requirements

Run the requirements checker to see what tools you have installed:

```powershell
.\check-build-requirements.ps1
```

## Output Locations

- **Windows MSI**: `src-tauri/target/x86_64-pc-windows-msvc/release/bundle/msi/`
- **Windows EXE**: `src-tauri/target/release/Magic Cursor.exe`
- **Linux builds**: `src-tauri/target/release/bundle/`
- **Android builds**: `src-tauri/gen/android/app/build/outputs/apk/`
- **iOS builds**: `src-tauri/gen/ios/build/`

## Notes

- Windows builds require Windows OS
- Linux builds require Linux OS
- iOS builds require macOS with Xcode
- Android builds work on any OS (with SDK/NDK installed)

For detailed setup instructions, see [PLATFORM_BUILD_GUIDE.md](./PLATFORM_BUILD_GUIDE.md)
