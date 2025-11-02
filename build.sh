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

# Build for all browsers
echo "Building extension for all browsers..."
echo ""

echo -e "${YELLOW}[1/3] Building for Chrome...${NC}"
yarn build:chrome
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Chrome build completed${NC}"
else
    echo -e "${RED}✗ Chrome build failed${NC}"
    exit 1
fi
echo ""

echo -e "${YELLOW}[2/3] Building for Firefox...${NC}"
yarn build:firefox
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Firefox build completed${NC}"
else
    echo -e "${RED}✗ Firefox build failed${NC}"
    exit 1
fi
echo ""

echo -e "${YELLOW}[3/3] Building for Opera...${NC}"
yarn build:opera
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Opera build completed${NC}"
else
    echo -e "${RED}✗ Opera build failed${NC}"
    exit 1
fi
echo ""

# Summary
echo "=================================="
echo -e "${GREEN}Build completed successfully!${NC}"
echo "=================================="
echo ""
echo "Output files:"
echo "  Chrome: extension/chrome.zip"
echo "  Firefox: extension/firefox.xpi"
echo "  Opera: extension/opera.crx"
echo ""
echo "To load the extension:"
echo "  Chrome: chrome://extensions → Load unpacked → extension/chrome/"
echo "  Firefox: about:debugging → Load Temporary Add-on → extension/firefox/"
echo "  Opera: opera://extensions → Load unpacked → extension/opera/"
echo ""
