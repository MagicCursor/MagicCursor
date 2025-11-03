# Platform-Specific Build Guide

This guide explains how to build Magic Cursor for different platforms using the new platform-specific scripts.

## Prerequisites

### All Platforms
- Node.js (v16 or higher)
- Yarn package manager
- Rust toolchain (install from https://rustup.rs/)

### Windows (for Windows builds)
- Visual Studio Build Tools or Visual Studio with C++ development tools
- WiX Toolset v3 (for MSI installer): https://wixtoolset.org/
- NSIS (for NSIS installer): https://nsis.sourceforge.io/

### Linux (for Linux builds)
- Build essentials: `sudo apt install build-essential`
- Additional dependencies:
  ```bash
  sudo apt install libwebkit2gtk-4.0-dev \
    build-essential \
    curl \
    wget \
    file \
    libssl-dev \
    libgtk-3-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev
  ```

### Android (for Android builds)
- Android SDK (API level 24 or higher)
- Android NDK (r25c or higher)
- Java Development Kit (JDK 11 or higher)
- Set environment variables:
  - `ANDROID_HOME`: Path to Android SDK
  - `NDK_HOME`: Path to Android NDK
- Add Android targets to Rust:
  ```bash
  rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android
  ```

### iOS (for iOS builds)
- macOS only
- Xcode 13 or higher
- Xcode Command Line Tools
- Apple Developer account (for distribution)
- Add iOS targets to Rust:
  ```bash
  rustup target add aarch64-apple-ios x86_64-apple-ios aarch64-apple-ios-sim
  ```

## Build Commands

### Build All Platforms
```bash
yarn run tauri:build
```
This will attempt to build for all platforms sequentially. Note: This will only succeed for platforms where you have the required toolchain installed.

### Windows Build (MSI)
```bash
yarn run tauri:windows
```
**Output formats:**
- `.msi` - Windows Installer (requires WiX Toolset)

**Output location:** `src-tauri/target/x86_64-pc-windows-msvc/release/bundle/msi/`

**Note:** The MSI installer includes the executable. After installation, the app will be available in the Start Menu and can be launched from there.

### Linux Build (DEB, AppImage)
```bash
yarn run tauri:linux
```
**Output formats:**
- `.deb` - Debian package
- `.AppImage` - Universal Linux application

**Output location:** `src-tauri/target/release/bundle/deb/` and `src-tauri/target/release/bundle/appimage/`

**⚠️ IMPORTANT:** This command **MUST** be run on an actual Linux system. Running it on Windows will compile the code but will NOT create the DEB or AppImage files.

**Options for Linux builds:**
1. Use a Linux machine
2. Use WSL2 (Windows Subsystem for Linux)
3. Use a Linux VM (VirtualBox, VMware)
4. Use CI/CD (GitHub Actions with `ubuntu-latest`)

### Android Build (APK)
```bash
yarn run tauri:android
```
**Output formats:**
- `.apk` - Android Package (for all architectures: arm64-v8a, armeabi-v7a, x86, x86_64)

**Output location:** `src-tauri/gen/android/app/build/outputs/apk/`

**First-time setup:**
```bash
yarn run android:init
```

### iOS Build (IPA)
```bash
yarn run tauri:ios
```
**Output formats:**
- `.ipa` - iOS App Store Package

**Output location:** `src-tauri/gen/ios/build/`

**First-time setup:**
```bash
yarn run ios:init
```

## Development Commands

### Run in Development Mode
```bash
# Desktop (Windows/Linux/macOS)
yarn run tauri:dev

# Android
yarn run android:dev

# iOS
yarn run ios:dev
```

## Troubleshooting

### Windows
- **MSI build fails**: Ensure WiX Toolset v3 is installed and in PATH
- **Build succeeds but no output**: Check `src-tauri/target/x86_64-pc-windows-msvc/release/bundle/msi/` directory

### Linux
- **Missing dependencies**: Run the apt install command from prerequisites
- **AppImage fails**: Ensure FUSE is installed: `sudo apt install fuse libfuse2`

### Android
- **SDK not found**: Verify `ANDROID_HOME` environment variable
- **NDK not found**: Verify `NDK_HOME` environment variable
- **Build fails**: Ensure all Rust Android targets are installed
- **Gradle errors**: Check Java version (JDK 11+ required)

### iOS
- **Xcode not found**: Install Xcode from App Store
- **Signing errors**: Configure signing in Xcode or tauri.conf.json
- **Simulator build**: Use `--target x86_64-apple-ios` for Intel Macs or `--target aarch64-apple-ios-sim` for Apple Silicon

## Cross-Platform Building

Note: You generally cannot cross-compile between platforms:
- Windows builds require Windows
- Linux builds require Linux
- iOS builds require macOS
- Android builds can be done on any platform (with proper SDK/NDK setup)

For CI/CD pipelines, use platform-specific runners:
- GitHub Actions: `windows-latest`, `ubuntu-latest`, `macos-latest`
- GitLab CI: Use appropriate Docker images or runners

## Build Artifacts

All build artifacts are located in:
- Desktop: `src-tauri/target/release/bundle/`
- Android: `src-tauri/gen/android/app/build/outputs/apk/`
- iOS: `src-tauri/gen/ios/build/`

## Additional Resources

- [Tauri Documentation](https://tauri.app/v1/guides/)
- [Tauri Android Guide](https://tauri.app/v1/guides/building/android)
- [Tauri iOS Guide](https://tauri.app/v1/guides/building/ios)
