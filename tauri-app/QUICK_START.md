# Quick Start - Platform Builds

## ✅ Ready to Use (Windows)

```bash
yarn run tauri:windows
```
Output: `src-tauri/target/x86_64-pc-windows-msvc/release/bundle/msi/Magic Cursor_1.0.0_x64_en-US.msi`

## 🔧 Requires Setup

### Linux Build
```bash
yarn run tauri:linux
```
- ⚠️ **MUST run on actual Linux OS** - Cannot build on Windows!
- Outputs: DEB, AppImage
- Use WSL2, VM, or Linux machine

### Android Build
```bash
# First time only
yarn run android:init

# Then build
yarn run tauri:android
```
- Requires: Android SDK (API 24+), NDK, JDK 11+
- Set `ANDROID_HOME` and `NDK_HOME` environment variables
- Outputs: APK (all architectures)

### iOS Build
```bash
# First time only (on macOS)
yarn run ios:init

# Then build
yarn run tauri:ios
```
- Requires: macOS, Xcode 13+
- Outputs: IPA

## 🚀 Build All
```bash
yarn run tauri:build
```
Attempts all platforms (only succeeds where toolchain is installed)

## 🔍 Check Your Setup
```powershell
.\check-build-requirements.ps1
```

## 📚 More Info
- [BUILD_COMMANDS.md](./BUILD_COMMANDS.md) - Command reference
- [PLATFORM_BUILD_GUIDE.md](./PLATFORM_BUILD_GUIDE.md) - Detailed setup guide
- [BUILD_SUCCESS.md](./BUILD_SUCCESS.md) - Windows build info
