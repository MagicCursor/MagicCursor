#!/bin/bash
# Magic Cursor - Build Script for macOS/Linux
# This script builds the extension for all browsers

set -e  # Exit on error

echo "=================================="
echo "Magic Cursor - Build Script"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 10 ]; then
    echo -e "${RED}Error: Node.js version 10 or higher is required${NC}"
    echo "Current version: $(node -v)"
    echo "Please update Node.js from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node -v) detected${NC}"

# Check if Yarn is installed
if ! command -v yarn &> /dev/null; then
    echo -e "${RED}Error: Yarn is not installed${NC}"
    echo "Installing Yarn..."
    npm install -g yarn
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to install Yarn${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✓ Yarn $(yarn -v) detected${NC}"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}Installing dependencies...${NC}"
    yarn install
    if [ $? -ne 0 ]; then
        echo -e "${RED}Failed to install dependencies${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Dependencies installed${NC}"
    echo ""
fi

# Ask user which browser(s) to build for
echo "Select browser(s) to build:"
echo "  1) Chrome"
echo "  2) Firefox"
echo "  3) Opera"
echo "  4) All browsers"
echo ""
read -p "Enter your choice (1-4): " choice
echo ""

BUILD_CHROME=false
BUILD_FIREFOX=false
BUILD_OPERA=false

case $choice in
    1)
        BUILD_CHROME=true
        ;;
    2)
        BUILD_FIREFOX=true
        ;;
    3)
        BUILD_OPERA=true
        ;;
    4)
        BUILD_CHROME=true
        BUILD_FIREFOX=true
        BUILD_OPERA=true
        ;;
    *)
        echo -e "${RED}Invalid choice. Exiting.${NC}"
        exit 1
        ;;
esac

# Build selected browsers
BUILD_COUNT=0
CURRENT_BUILD=0

if [ "$BUILD_CHROME" = true ]; then ((BUILD_COUNT++)); fi
if [ "$BUILD_FIREFOX" = true ]; then ((BUILD_COUNT++)); fi
if [ "$BUILD_OPERA" = true ]; then ((BUILD_COUNT++)); fi

if [ "$BUILD_CHROME" = true ]; then
    ((CURRENT_BUILD++))
    echo -e "${YELLOW}[$CURRENT_BUILD/$BUILD_COUNT] Building for Chrome...${NC}"
    yarn build:chrome
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Chrome build completed${NC}"
    else
        echo -e "${RED}✗ Chrome build failed${NC}"
        exit 1
    fi
    echo ""
fi

if [ "$BUILD_FIREFOX" = true ]; then
    ((CURRENT_BUILD++))
    echo -e "${YELLOW}[$CURRENT_BUILD/$BUILD_COUNT] Building for Firefox...${NC}"
    yarn build:firefox
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Firefox build completed${NC}"
    else
        echo -e "${RED}✗ Firefox build failed${NC}"
        exit 1
    fi
    echo ""
fi

if [ "$BUILD_OPERA" = true ]; then
    ((CURRENT_BUILD++))
    echo -e "${YELLOW}[$CURRENT_BUILD/$BUILD_COUNT] Building for Opera...${NC}"
    yarn build:opera
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Opera build completed${NC}"
    else
        echo -e "${RED}✗ Opera build failed${NC}"
        exit 1
    fi
    echo ""
fi

# Summary
echo "=================================="
echo -e "${GREEN}Build completed successfully!${NC}"
echo "=================================="
echo ""

if [ "$BUILD_CHROME" = true ] || [ "$BUILD_FIREFOX" = true ] || [ "$BUILD_OPERA" = true ]; then
    echo "Output files:"
    if [ "$BUILD_CHROME" = true ]; then
        echo "  Chrome: extension/chrome.zip"
    fi
    if [ "$BUILD_FIREFOX" = true ]; then
        echo "  Firefox: extension/firefox.xpi"
    fi
    if [ "$BUILD_OPERA" = true ]; then
        echo "  Opera: extension/opera.crx"
    fi
    echo ""
    echo "To load the extension:"
    if [ "$BUILD_CHROME" = true ]; then
        echo "  Chrome: chrome://extensions → Load unpacked → extension/chrome/"
    fi
    if [ "$BUILD_FIREFOX" = true ]; then
        echo "  Firefox: about:debugging → Load Temporary Add-on → extension/firefox/"
    fi
    if [ "$BUILD_OPERA" = true ]; then
        echo "  Opera: opera://extensions → Load unpacked → extension/opera/"
    fi
    echo ""
fi
