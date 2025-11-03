# Install Android SDK for Magic Cursor APK Build

## Current Status

✅ Rust Android targets installed  
❌ Android SDK not installed  
❌ Android NDK not installed  
❌ Java/JDK not installed  

## Step-by-Step Installation

### Option 1: Install Android Studio (Recommended - Easiest)

1. **Download Android Studio**
   - Go to: https://developer.android.com/studio
   - Download the Windows installer
   - File size: ~1 GB

2. **Install Android Studio**
   - Run the installer
   - Choose "Standard" installation
   - This will install:
     - Android SDK
     - Android SDK Platform
     - Android Virtual Device
     - Java JDK

3. **Install Additional Components**
   - Open Android Studio
   - Click "More Actions" > "SDK Manager"
   - In "SDK Platforms" tab:
     - ✓ Android 14.0 (API 34)
     - ✓ Android 7.0 (API 24)
   - In "SDK Tools" tab:
     - ✓ Android SDK Build-Tools
     - ✓ NDK (Side by side)
     - ✓ Android SDK Command-line Tools
     - ✓ Android SDK Platform-Tools
   - Click "Apply" and wait for installation

4. **Set Environment Variables**
   
   Open PowerShell as Administrator and run:
   ```powershell
   # Set ANDROID_HOME
   [System.Environment]::SetEnvironmentVariable('ANDROID_HOME', 'C:\Users\rouxy\AppData\Local\Android\Sdk', 'User')
   
   # Add to PATH
   $currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'User')
   $newPath = "$currentPath;C:\Users\rouxy\AppData\Local\Android\Sdk\platform-tools;C:\Users\rouxy\AppData\Local\Android\Sdk\tools\bin"
   [System.Environment]::SetEnvironmentVariable('Path', $newPath, 'User')
   ```

5. **Restart PowerShell** to load new environment variables

6. **Verify Installation**
   ```powershell
   cd tauri-app
   .\setup-android.ps1
   ```

### Option 2: Install Command Line Tools Only (Advanced)

If you don't want the full Android Studio:

1. **Download Command Line Tools**
   - Go to: https://developer.android.com/studio#command-tools
   - Download "Command line tools only" for Windows
   - Extract to: `C:\Android\cmdline-tools\latest`

2. **Install SDK Components**
   ```powershell
   cd C:\Android\cmdline-tools\latest\bin
   
   # Accept licenses
   .\sdkmanager --licenses
   
   # Install required components
   .\sdkmanager "platform-tools" "platforms;android-34" "platforms;android-24" "build-tools;34.0.0" "ndk;26.1.10909125"
   ```

3. **Set Environment Variables**
   ```powershell
   [System.Environment]::SetEnvironmentVariable('ANDROID_HOME', 'C:\Android', 'User')
   [System.Environment]::SetEnvironmentVariable('NDK_HOME', 'C:\Android\ndk\26.1.10909125', 'User')
   ```

4. **Install Java JDK 17**
   - Download from: https://adoptium.net/
   - Install and add to PATH

## After Installation

### 1. Verify Setup
```powershell
cd tauri-app
.\setup-android.ps1
```

You should see all green checkmarks ✓

### 2. Initialize Android Project
```powershell
yarn run android:init
```

This creates the Android project structure in `src-tauri/gen/android/`

### 3. Configure Android Manifest

The manifest will be at: `src-tauri/gen/android/app/src/main/AndroidManifest.xml`

Add these permissions (if not already present):
```xml
<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.INTERNET" />
```

### 4. Build APK

**Debug Build (for testing):**
```powershell
yarn run android:dev
```

**Release Build (for distribution):**
```powershell
yarn run android:build
```

The APK will be at:
```
src-tauri\gen\android\app\build\outputs\apk\release\app-release.apk
```

## Disk Space Requirements

- Android Studio: ~3-4 GB
- Android SDK: ~2-3 GB
- NDK: ~1-2 GB
- Build cache: ~1 GB
- **Total: ~7-10 GB**

## Build Time Estimates

- First build: 15-30 minutes (downloads dependencies)
- Subsequent builds: 3-5 minutes

## Troubleshooting

### "SDK not found"
- Verify ANDROID_HOME is set correctly
- Restart PowerShell after setting environment variables
- Check path exists: `Test-Path $env:ANDROID_HOME`

### "NDK not found"
- Install NDK via Android Studio SDK Manager
- Or download from: https://developer.android.com/ndk/downloads
- Set NDK_HOME environment variable

### "Java not found"
- Android Studio includes Java
- Or install from: https://adoptium.net/
- Verify: `java -version`

### Build fails with "Gradle error"
- First build takes longer, be patient
- Check internet connection (downloads dependencies)
- Try: `yarn run android:build -- --clean`

## Quick Install Script

Save this as `install-android.ps1` and run as Administrator:

```powershell
# Download Android Studio installer
$url = "https://redirector.gvt1.com/edgedl/android/studio/install/2023.1.1.28/android-studio-2023.1.1.28-windows.exe"
$output = "$env:TEMP\android-studio-installer.exe"

Write-Host "Downloading Android Studio..." -ForegroundColor Yellow
Invoke-WebRequest -Uri $url -OutFile $output

Write-Host "Starting installer..." -ForegroundColor Yellow
Start-Process -FilePath $output -Wait

Write-Host "Installation complete!" -ForegroundColor Green
Write-Host "Please open Android Studio and install SDK components" -ForegroundColor Yellow
```

## Next Steps After Installation

1. ✓ Install Android Studio
2. ✓ Install SDK & NDK
3. ✓ Set environment variables
4. ✓ Run `.\setup-android.ps1`
5. ✓ Run `yarn run android:init`
6. ✓ Run `yarn run android:build`
7. ✓ Get your APK!

## Alternative: Use GitHub Actions

If you don't want to install locally, you can build in the cloud:

1. Push your code to GitHub
2. Create `.github/workflows/android-build.yml`
3. GitHub Actions will build the APK for you
4. Download the APK from Actions artifacts

Would you like me to create the GitHub Actions workflow file?

## Support

If you encounter issues:
1. Check `.\setup-android.ps1` output
2. Verify all environment variables
3. Ensure internet connection for downloads
4. Check Android Studio SDK Manager for missing components

## Estimated Total Time

- Download Android Studio: 10-20 minutes
- Install Android Studio: 5-10 minutes
- Install SDK components: 10-20 minutes
- Configure environment: 5 minutes
- First APK build: 15-30 minutes
- **Total: 45-85 minutes**

But subsequent builds only take 3-5 minutes! 🚀
