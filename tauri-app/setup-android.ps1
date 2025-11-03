# Magic Cursor Android Setup Script
# Run this script to check and setup Android build environment

Write-Host "=== Magic Cursor Android Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check ANDROID_HOME
Write-Host "Checking ANDROID_HOME..." -ForegroundColor Yellow
if ($env:ANDROID_HOME) {
    Write-Host "✓ ANDROID_HOME is set: $env:ANDROID_HOME" -ForegroundColor Green
    
    if (Test-Path $env:ANDROID_HOME) {
        Write-Host "✓ Android SDK directory exists" -ForegroundColor Green
    } else {
        Write-Host "✗ Android SDK directory not found!" -ForegroundColor Red
        Write-Host "  Please install Android Studio from: https://developer.android.com/studio" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "✗ ANDROID_HOME not set!" -ForegroundColor Red
    Write-Host "  Set it with: `$env:ANDROID_HOME = 'C:\Users\$env:USERNAME\AppData\Local\Android\Sdk'" -ForegroundColor Yellow
    exit 1
}

# Check NDK
Write-Host ""
Write-Host "Checking Android NDK..." -ForegroundColor Yellow
$ndkPath = "$env:ANDROID_HOME\ndk"
if (Test-Path $ndkPath) {
    $ndkVersions = Get-ChildItem $ndkPath -Directory
    if ($ndkVersions.Count -gt 0) {
        $latestNdk = $ndkVersions | Sort-Object Name -Descending | Select-Object -First 1
        Write-Host "✓ NDK found: $($latestNdk.Name)" -ForegroundColor Green
        $env:NDK_HOME = $latestNdk.FullName
        Write-Host "  Set NDK_HOME to: $env:NDK_HOME" -ForegroundColor Green
    } else {
        Write-Host "✗ No NDK versions found!" -ForegroundColor Red
        Write-Host "  Install NDK via Android Studio: Tools > SDK Manager > SDK Tools > NDK" -ForegroundColor Yellow
        exit 1
    }
} else {
    Write-Host "✗ NDK directory not found!" -ForegroundColor Red
    Write-Host "  Install NDK via Android Studio: Tools > SDK Manager > SDK Tools > NDK" -ForegroundColor Yellow
    exit 1
}

# Check platform-tools
Write-Host ""
Write-Host "Checking Android platform-tools..." -ForegroundColor Yellow
$platformToolsPath = "$env:ANDROID_HOME\platform-tools"
if (Test-Path $platformToolsPath) {
    Write-Host "✓ Platform-tools found" -ForegroundColor Green
    $env:PATH += ";$platformToolsPath"
} else {
    Write-Host "✗ Platform-tools not found!" -ForegroundColor Red
    Write-Host "  Install via Android Studio: Tools > SDK Manager > SDK Tools > Android SDK Platform-Tools" -ForegroundColor Yellow
    exit 1
}

# Check Rust Android targets
Write-Host ""
Write-Host "Checking Rust Android targets..." -ForegroundColor Yellow
$targets = @("aarch64-linux-android", "armv7-linux-androideabi", "i686-linux-android", "x86_64-linux-android")
$allInstalled = $true

foreach ($target in $targets) {
    $installed = rustup target list --installed | Select-String $target
    if ($installed) {
        Write-Host "✓ $target installed" -ForegroundColor Green
    } else {
        Write-Host "✗ $target not installed" -ForegroundColor Red
        $allInstalled = $false
    }
}

if (-not $allInstalled) {
    Write-Host ""
    Write-Host "Installing missing Rust targets..." -ForegroundColor Yellow
    rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android
}

# Check Java
Write-Host ""
Write-Host "Checking Java..." -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1 | Select-Object -First 1
    Write-Host "✓ Java found: $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Java not found!" -ForegroundColor Red
    Write-Host "  Java is included with Android Studio" -ForegroundColor Yellow
}

# Summary
Write-Host ""
Write-Host "=== Setup Summary ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Environment Variables:" -ForegroundColor Yellow
Write-Host "  ANDROID_HOME = $env:ANDROID_HOME"
Write-Host "  NDK_HOME = $env:NDK_HOME"
Write-Host ""
Write-Host "To make these permanent, add to your PowerShell profile:" -ForegroundColor Yellow
Write-Host "  notepad `$PROFILE" -ForegroundColor Cyan
Write-Host ""
Write-Host "Add these lines:" -ForegroundColor Yellow
Write-Host "  `$env:ANDROID_HOME = '$env:ANDROID_HOME'" -ForegroundColor Cyan
Write-Host "  `$env:NDK_HOME = '$env:NDK_HOME'" -ForegroundColor Cyan
Write-Host "  `$env:PATH += ';$platformToolsPath'" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Initialize Android project: yarn run android:init" -ForegroundColor Cyan
Write-Host "  2. Build APK: npm run android:build" -ForegroundColor Cyan
Write-Host ""
Write-Host "✓ Setup check complete!" -ForegroundColor Green
