# Fix: "Could not find MIME for Buffer <null>" Build Error

## Problem
EAS Build fails with:
```
Error: [android.dangerous]: withAndroidDangerousBaseMod: Could not find MIME for Buffer <null>
```

This error occurs when Expo tries to process image files during build, but one of the image files is corrupted, empty, or in an unsupported format.

## Solutions

### Solution 1: Verify Image Files Are Valid

Check that all image files exist and are valid PNG files:

1. **Verify files exist:**
   ```bash
   # Windows PowerShell
   Test-Path assets/icon.png
   Test-Path assets/splash.png
   Test-Path assets/favicon.png
   ```

2. **Check file sizes** (should be > 0 bytes):
   ```bash
   Get-Item assets/*.png | Select-Object Name, Length
   ```

3. **Recreate corrupted images:**
   - If any file is 0 bytes or corrupted, replace it with a valid PNG
   - Minimum recommended sizes:
     - `icon.png`: 1024x1024 pixels
     - `splash.png`: 1242x2436 pixels (or similar)
     - `favicon.png`: 48x48 pixels

### Solution 2: Simplified Configuration (Current)

I've already simplified your `app.json`:
- ✅ Removed `adaptiveIcon` (using default)
- ✅ Removed notification `icon` (using default)
- ✅ Kept only essential image references

### Solution 3: Use Default Icons

If the error persists, you can use Expo's default icons by removing image references:

```json
{
  "expo": {
    // Remove or comment out:
    // "icon": "./assets/icon.png",
    // "splash": { ... },
    // "web": { "favicon": ... }
  }
}
```

### Solution 4: Recreate Image Files

If images are corrupted, recreate them:

1. **Create new icon.png:**
   - Use any image editor (Photoshop, GIMP, online tools)
   - Create 1024x1024 PNG image
   - Save as `assets/icon.png`

2. **Create new splash.png:**
   - Create 1242x2436 PNG image
   - Save as `assets/splash.png`

3. **Verify files:**
   - Open each file in an image viewer
   - Make sure they open correctly
   - Check file size is > 0 bytes

### Solution 5: Use Online Image Validator

Validate your PNG files:
1. Upload to https://www.pngchecker.com/
2. Or use: https://www.iloveimg.com/resize-image
3. Make sure files are valid PNG format

## Current Configuration

Your `app.json` now has:
- ✅ Main icon: `./assets/icon.png` (required)
- ✅ Splash screen: `./assets/splash.png` (required)
- ✅ Favicon: `./assets/favicon.png` (optional, web only)
- ❌ Adaptive icon: Removed (using default)
- ❌ Notification icon: Removed (using default)

## Next Steps

1. **Try building again:**
   ```bash
   eas build --platform android --profile preview
   ```

2. **If error persists:**
   - Check if `icon.png` or `splash.png` files are corrupted
   - Try recreating them with valid PNG images
   - Or temporarily remove image references to use defaults

3. **Verify image files locally:**
   ```bash
   # Check if files can be opened
   # Try opening assets/icon.png in an image viewer
   ```

## Quick Test

To test if images are the issue, temporarily rename them and see if build progresses further:

```bash
# Backup
mv assets/icon.png assets/icon.png.bak
mv assets/splash.png assets/splash.png.bak

# Try build (will fail but might show different error)
eas build --platform android --profile preview

# Restore
mv assets/icon.png.bak assets/icon.png
mv assets/splash.png.bak assets/splash.png
```

## Alternative: Use Expo's Icon Generator

If you need to recreate icons:

```bash
# Install expo-cli if needed
npm install -g expo-cli

# Generate icons from a source image
expo prebuild --clean
```

---

**Most likely cause**: One of your image files (`icon.png`, `splash.png`, or `favicon.png`) is corrupted or empty. Check file sizes and recreate if needed.


