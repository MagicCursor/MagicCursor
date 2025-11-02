@echo off
REM Magic Cursor - Build Script for Windows
REM This script builds the extension for all browsers

setlocal enabledelayedexpansion

echo ==================================
echo Magic Cursor - Build Script
echo ==================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check Node.js version
for /f "tokens=1 delims=v" %%i in ('node -v') do set NODE_VERSION=%%i
for /f "tokens=1 delims=." %%i in ("%NODE_VERSION:~1%") do set NODE_MAJOR=%%i
if %NODE_MAJOR% LSS 10 (
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
yarn -v
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

REM Build for all browsers
echo Building extension for all browsers...
echo.

echo [1/3] Building for Chrome...
call yarn build:chrome
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Chrome build failed
    pause
    exit /b 1
)
echo [OK] Chrome build completed
echo.

echo [2/3] Building for Firefox...
call yarn build:firefox
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Firefox build failed
    pause
    exit /b 1
)
echo [OK] Firefox build completed
echo.

echo [3/3] Building for Opera...
call yarn build:opera
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Opera build failed
    pause
    exit /b 1
)
echo [OK] Opera build completed
echo.

REM Summary
echo ==================================
echo Build completed successfully!
echo ==================================
echo.
echo Output files:
echo   Chrome: extension\chrome.zip
echo   Firefox: extension\firefox.xpi
echo   Opera: extension\opera.crx
echo.
echo To load the extension:
echo   Chrome: chrome://extensions -^> Load unpacked -^> extension\chrome\
echo   Firefox: about:debugging -^> Load Temporary Add-on -^> extension\firefox\
echo   Opera: opera://extensions -^> Load unpacked -^> extension\opera\
echo.
pause
