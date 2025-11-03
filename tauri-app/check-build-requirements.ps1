# Build Requirements Checker for Magic Cursor
# This script checks if you have the necessary tools installed for building on different platforms

Write-Host "=== Magic Cursor Build Requirements Checker ===" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# Check Node.js
Write-Host "Checking Node.js..." -NoNewline
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host " ✓ Found: $nodeVersion" -ForegroundColor Green
    } else {
        Write-Host " ✗ Not found" -ForegroundColor Red
        $allGood = $false
    }
} catch {
    Write-Host " ✗ Not found" -ForegroundColor Red
    $allGood = $false
}

# Check Yarn
Write-Host "Checking Yarn..." -NoNewline
try {
    $yarnVersion = yarn --version 2>$null
    if ($yarnVersion) {
        Write-Host " ✓ Found: $yarnVersion" -ForegroundColor Green
    } else {
        Write-Host " ✗ Not found" -ForegroundColor Red
        $allGood = $false
    }
} catch {
    Write-Host " ✗ Not found" -ForegroundColor Red
    $allGood = $false
}

# Check Rust
Write-Host "Checking Rust..." -NoNewline
try {
    $rustVersion = rustc --version 2>$null
    if ($rustVersion) {
        Write-Host " ✓ Found: $rustVersion" -ForegroundColor Green
    } else {
        Write-Host " ✗ Not found" -ForegroundColor Red
        $allGood = $false
    }
} catch {
    Write-Host " ✗ Not found" -ForegroundColor Red
    $allGood = $false
}

# Check Cargo
Write-Host "Checking Cargo..." -NoNewline
try {
    $cargoVersion = cargo --version 2>$null
    if ($cargoVersion) {
        Write-Host " ✓ Found: $cargoVersion" -ForegroundColor Green
    } else {
        Write-Host " ✗ Not found" -ForegroundColor Red
        $allGood = $false
    }
} catch {
    Write-Host " ✗ Not found" -ForegroundColor Red
    $allGood = $false
}

Write-Host ""
Write-Host "=== Windows Build Tools ===" -ForegroundColor Cyan

# Check WiX Toolset (for MSI)
Write-Host "Checking WiX Toolset (for MSI)..." -NoNewline
try {
    $wixPath = Get-Command candle.exe -ErrorAction SilentlyContinue
    if ($wixPath) {
        Write-Host " ✓ Found" -ForegroundColor Green
    } else {
        Write-Host " ⚠ Not found (Windows MSI builds will fail)" -ForegroundColor Yellow
        Write-Host "  Download from: https://wixtoolset.org/" -ForegroundColor Yellow
    }
} catch {
    Write-Host " ⚠ Not found (Windows MSI builds will fail)" -ForegroundColor Yellow
    Write-Host "  Download from: https://wixtoolset.org/" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Android Build Tools ===" -ForegroundColor Cyan

# Check Android SDK
Write-Host "Checking Android SDK (ANDROID_HOME)..." -NoNewline
$androidHome = $env:ANDROID_HOME
if ($androidHome -and (Test-Path $androidHome)) {
    Write-Host " ✓ Found: $androidHome" -ForegroundColor Green
} else {
    Write-Host " ⚠ Not configured (Android builds will fail)" -ForegroundColor Yellow
}

# Check Android NDK
Write-Host "Checking Android NDK (NDK_HOME)..." -NoNewline
$ndkHome = $env:NDK_HOME
if ($ndkHome -and (Test-Path $ndkHome)) {
    Write-Host " ✓ Found: $ndkHome" -ForegroundColor Green
} else {
    Write-Host " ⚠ Not configured (Android builds will fail)" -ForegroundColor Yellow
}

# Check Java
Write-Host "Checking Java JDK..." -NoNewline
try {
    $javaVersion = java -version 2>&1 | Select-String "version"
    if ($javaVersion) {
        Write-Host " ✓ Found: $javaVersion" -ForegroundColor Green
    } else {
        Write-Host " ⚠ Not found (Android builds will fail)" -ForegroundColor Yellow
    }
} catch {
    Write-Host " ⚠ Not found (Android builds will fail)" -ForegroundColor Yellow
}

# Check Rust Android targets
Write-Host "Checking Rust Android targets..." -NoNewline
try {
    $targets = rustup target list --installed 2>$null
    $androidTargets = @(
        "aarch64-linux-android",
        "armv7-linux-androideabi",
        "i686-linux-android",
        "x86_64-linux-android"
    )
    $missingTargets = @()
    foreach ($target in $androidTargets) {
        if ($targets -notcontains $target) {
            $missingTargets += $target
        }
    }
    if ($missingTargets.Count -eq 0) {
        Write-Host " ✓ All targets installed" -ForegroundColor Green
    } else {
        Write-Host " ⚠ Missing: $($missingTargets -join ', ')" -ForegroundColor Yellow
        Write-Host "  Run: rustup target add $($missingTargets -join ' ')" -ForegroundColor Yellow
    }
} catch {
    Write-Host " ⚠ Could not check" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan

if ($allGood) {
    Write-Host "✓ Core requirements met! You can build desktop applications." -ForegroundColor Green
} else {
    Write-Host "✗ Some core requirements are missing. Please install them first." -ForegroundColor Red
}

Write-Host ""
Write-Host "Platform-specific builds:" -ForegroundColor Cyan
Write-Host "  • Windows: yarn run tauri:windows" -ForegroundColor White
Write-Host "  • Linux: yarn run tauri:linux (requires Linux)" -ForegroundColor White
Write-Host "  • Android: yarn run tauri:android (requires Android SDK/NDK)" -ForegroundColor White
Write-Host "  • iOS: yarn run tauri:ios (requires macOS + Xcode)" -ForegroundColor White
Write-Host "  • All: yarn run tauri:build" -ForegroundColor White
Write-Host ""
