# Fix: Empty Image Files (0 bytes)

## Problem Found
All your image files are **0 bytes** (empty):
- `assets/icon.png` - 0 bytes
- `assets/splash.png` - 0 bytes  
- `assets/favicon.png` - 0 bytes
- `assets/adaptive-icon.png` - 0 bytes

This is why the build fails with "Could not find MIME for Buffer <null>".

## Quick Fix Options

### Option 1: Create Placeholder Images (Fastest)

You need to create valid PNG images. Here are quick ways:

#### Using Online Tools:
1. **Icon Generator**: https://www.favicon-generator.org/
   - Upload any image or use text
   - Generate 1024x1024 icon
   - Download as PNG

2. **Splash Screen**: https://www.iloveimg.com/resize-image
   - Create or upload an image
   - Resize to 1242x2436 pixels
   - Download as PNG

3. **Simple Placeholder**: https://placeholder.com/
   - Use: `https://via.placeholder.com/1024x1024.png`
   - Save as `icon.png`

#### Using Image Editor:
1. Open any image editor (Paint, Photoshop, GIMP, etc.)
2. Create new image:
   - **icon.png**: 1024x1024 pixels, any color/image
   - **splash.png**: 1242x2436 pixels, any color/image
   - **favicon.png**: 48x48 pixels (optional)
3. Save as PNG format

### Option 2: Use Default Expo Icons (Temporary)

Remove image references to use Expo defaults:

```json
{
  "expo": {
    // Comment out or remove:
    // "icon": "./assets/icon.png",
    // "splash": { ... },
    // "web": { "favicon": ... }
  }
}
```

### Option 3: Download Sample Images

Download valid placeholder images:

1. **Icon** (1024x1024): 
   - https://via.placeholder.com/1024x1024/007AFF/FFFFFF?text=SevApp
   - Save as `assets/icon.png`

2. **Splash** (1242x2436):
   - https://via.placeholder.com/1242x2436/007AFF/FFFFFF?text=SevApp
   - Save as `assets/splash.png`

## Steps to Fix

1. **Delete empty files:**
   ```bash
   Remove-Item assets/icon.png
   Remove-Item assets/splash.png
   Remove-Item assets/favicon.png
   Remove-Item assets/adaptive-icon.png
   ```

2. **Create new valid images:**
   - Use any method above
   - Make sure files are > 0 bytes
   - Save as PNG format

3. **Verify files:**
   ```bash
   Get-ChildItem assets/*.png | Select-Object Name, Length
   ```
   All files should show Length > 0

4. **Try build again:**
   ```bash
   eas build --platform android --profile preview
   ```

## Minimum Requirements

- **icon.png**: At least 1024x1024 pixels, PNG format, > 0 bytes
- **splash.png**: At least 1242x2436 pixels, PNG format, > 0 bytes
- **favicon.png**: At least 48x48 pixels (optional), PNG format

## Quick Test After Fix

After creating new images, verify they're valid:
```bash
# Check file sizes (should all be > 0)
Get-ChildItem assets/*.png | Select-Object Name, Length
```

If all files show Length > 0, the build should work!

---

**Action Required**: Create valid PNG image files to replace the empty ones. Even a simple colored square will work for now - you can replace with better designs later.


