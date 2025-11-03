# Windows Build Fix - EXE + MSI Output ✅

## Issue
The `yarn run tauri:windows` command was only creating the MSI installer in the target-specific folder, but not updating the standalone EXE in the convenient `src-tauri/target/release/` location.

## Root Cause
When building with `--target x86_64-pc-windows-msvc`, Tauri creates the EXE in:
```
src-tauri/target/x86_64-pc-windows-msvc/release/Magic Cursor.exe
```

But users expected it to also be in the generic location:
```
src-tauri/target/release/Magic Cursor.exe
```

## Solution
Updated the `tauri:windows` script to automatically copy the EXE to the generic release folder after building.

### Updated Script:
```json
"tauri:windows": "tauri build --target x86_64-pc-windows-msvc --bundles msi && copy src-tauri\\target\\x86_64-pc-windows-msvc\\release\\\"Magic Cursor.exe\" src-tauri\\target\\release\\\"Magic Cursor.exe\""
```

## Build Output Now

### Files Created:
1. **MSI Installer** (for installation)
   - Location: `src-tauri/target/x86_64-pc-windows-msvc/release/bundle/msi/Magic Cursor_1.0.0_x64_en-US.msi`
   - Size: ~3.2 MB
   - Use: Professional installer with Start Menu shortcuts

2. **Standalone EXE** (portable - original)
   - Location: `src-tauri/target/x86_64-pc-windows-msvc/release/Magic Cursor.exe`
   - Size: ~2.8 MB
   - Use: Portable version, no installation needed

3. **Standalone EXE** (portable - copy for convenience)
   - Location: `src-tauri/target/release/Magic Cursor.exe`
   - Size: ~2.8 MB
   - Use: Same as above, easier to find

### Both EXEs are identical:
- Same timestamp
- Same file size
- Same functionality
- Automatically updated on every build

## Usage

### Build Command:
```bash
yarn run tauri:windows
```

### Output:
```
✓ Built MSI installer
✓ Built standalone EXE
✓ Copied EXE to generic release folder
1 arquivo(s) copiado(s). [1 file(s) copied]
```

### Distribution Options:

**Option 1: MSI Installer (Recommended)**
- Professional installation experience
- Creates Start Menu shortcuts
- Adds uninstall entry
- Embeds WebView2
- File: `Magic Cursor_1.0.0_x64_en-US.msi`

**Option 2: Portable EXE**
- No installation required
- Run from any location
- Requires WebView2 already installed
- File: `Magic Cursor.exe`

## Verification

Both files are now updated on every build:
```powershell
dir "src-tauri\target\release\Magic Cursor.exe"
# LastWriteTime: 03/11/2025 08:24:27
# Length: 2816512

dir "src-tauri\target\x86_64-pc-windows-msvc\release\Magic Cursor.exe"
# LastWriteTime: 03/11/2025 08:24:27
# Length: 2816512
```

## Files Modified

- `package.json` - Updated `tauri:windows` script to copy EXE
- `PLATFORM_BUILD_GUIDE.md` - Updated documentation
- `BUILD_COMMANDS.md` - Updated output locations

## Result

The Windows build now creates both MSI and EXE files, with the EXE automatically copied to an easy-to-find location! 🎉
