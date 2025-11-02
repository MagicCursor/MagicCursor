@echo off
REM Magic Cursor - Build Script for Windows
REM This script builds the extension for all browsers

setlocal enabledelayedexpansion

echo ==================================
echo Magic Cursor - Build Script
echo ==================================
echo.

REM Check if Node.js is installed
node --version >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=1 delims=." %%i in ('node -v') do set NODE_VERSION_FULL=%%i
set NODE_VERSION_FULL=%NODE_VERSION_FULL:v=%
if %NODE_VERSION_FULL% LSS 10 (
    echo [ERROR] Node.js version 10 or higher is required
    node -v
    echo Please update Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js detected
node -v

REM Check if Yarn is installed
where yarn >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Yarn is not installed
    echo Installing Yarn...
    call npm install -g yarn
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install Yarn
        pause
        exit /b 1
    )
)

echo [OK] Yarn detected
call yarn -v
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call yarn install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed
    echo.
)

REM Ask user which browser(s) to build for
echo Select browser(s) to build:
echo   1) Chrome
echo   2) Firefox
echo   3) Opera
echo   4) All browsers
echo.
set /p choice="Enter your choice (1-4): "
echo.

set BUILD_CHROME=0
set BUILD_FIREFOX=0
set BUILD_OPERA=0

if "%choice%"=="1" set BUILD_CHROME=1
if "%choice%"=="2" set BUILD_FIREFOX=1
if "%choice%"=="3" set BUILD_OPERA=1
if "%choice%"=="4" (
    set BUILD_CHROME=1
    set BUILD_FIREFOX=1
    set BUILD_OPERA=1
)

if "%choice%" GTR "4" (
    echo [ERROR] Invalid choice. Exiting.
    pause
    exit /b 1
)
if "%choice%" LSS "1" (
    echo [ERROR] Invalid choice. Exiting.
    pause
    exit /b 1
)

REM Count total builds
set /a BUILD_COUNT=0
if %BUILD_CHROME%==1 set /a BUILD_COUNT+=1
if %BUILD_FIREFOX%==1 set /a BUILD_COUNT+=1
if %BUILD_OPERA%==1 set /a BUILD_COUNT+=1

REM Build selected browsers
set /a CURRENT_BUILD=0

if %BUILD_CHROME%==1 (
    set /a CURRENT_BUILD+=1
    echo [!CURRENT_BUILD!/%BUILD_COUNT%] Building for Chrome...
    call yarn build:chrome
    if !ERRORLEVEL! NEQ 0 (
        echo [ERROR] Chrome build failed
        pause
        exit /b 1
    )
    echo [OK] Chrome build completed
    echo.
)

if %BUILD_FIREFOX%==1 (
    set /a CURRENT_BUILD+=1
    echo [!CURRENT_BUILD!/%BUILD_COUNT%] Building for Firefox...
    call yarn build:firefox
    if !ERRORLEVEL! NEQ 0 (
        echo [ERROR] Firefox build failed
        pause
        exit /b 1
    )
    echo [OK] Firefox build completed
    echo.
)

if %BUILD_OPERA%==1 (
    set /a CURRENT_BUILD+=1
    echo [!CURRENT_BUILD!/%BUILD_COUNT%] Building for Opera...
    call yarn build:opera
    if !ERRORLEVEL! NEQ 0 (
        echo [ERROR] Opera build failed
        pause
        exit /b 1
    )
    echo [OK] Opera build completed
    echo.
)

REM Summary
echo ==================================
echo Build completed successfully!
echo ==================================
echo.

if %BUILD_CHROME%==1 (
    echo Output files:
    echo   Chrome: extension\chrome.zip
    echo.
    echo To load the extension:
    echo   Chrome: chrome://extensions -^> Load unpacked -^> extension\chrome\
    echo.
)

if %BUILD_FIREFOX%==1 (
    if %BUILD_CHROME%==0 echo Output files:
    echo   Firefox: extension\firefox.xpi
    echo.
    if %BUILD_CHROME%==0 echo To load the extension:
    echo   Firefox: about:debugging -^> Load Temporary Add-on -^> extension\firefox\
    echo.
)

if %BUILD_OPERA%==1 (
    if %BUILD_CHROME%==0 if %BUILD_FIREFOX%==0 echo Output files:
    echo   Opera: extension\opera.crx
    echo.
    if %BUILD_CHROME%==0 if %BUILD_FIREFOX%==0 echo To load the extension:
    echo   Opera: opera://extensions -^> Load unpacked -^> extension\opera\
    echo.
)

pause
