# View Logs on Phone Device (Windows)

## Problem
You can't see console logs when running the app on a phone device, and `adb` is not recognized in PowerShell.

## Solution 1: Enable Debug Alerts (Already Done) ✅

I've removed the `__DEV__` checks, so alerts will show in **production builds** too. You'll see:
- ✅ OAuth start (with app deep link)
- ✅ OAuth URL received (with localhost check)
- ✅ OAuth callback received
- ✅ Params extracted
- ✅ Success/Error messages

**Just build and test - alerts will show on your phone!**

## Solution 2: Install ADB for Windows (Optional)

If you want to see full console logs via ADB:

### Step 1: Download Android Platform Tools

1. Go to: https://developer.android.com/tools/releases/platform-tools
2. Download "SDK Platform-Tools for Windows"
3. Extract to a folder (e.g., `C:\platform-tools`)

### Step 2: Add to PATH

1. Open "Environment Variables":
   - Press `Win + R`
   - Type `sysdm.cpl` and press Enter
   - Go to "Advanced" tab → "Environment Variables"

2. Edit "Path" variable:
   - Select "Path" → "Edit"
   - Click "New"
   - Add: `C:\platform-tools` (or your extraction path)
   - Click "OK" on all dialogs

3. **Restart PowerShell** (or restart computer)

### Step 3: Verify ADB Installation

```powershell
adb version
```

Should show: `Android Debug Bridge version 1.0.XX`

### Step 4: Enable USB Debugging on Phone

1. **Settings → About Phone**
2. Tap "Build Number" **7 times** (enables Developer Options)
3. **Settings → Developer Options**
4. Enable **"USB Debugging"**
5. Connect phone via USB
6. On phone, allow "USB Debugging" when prompted

### Step 5: Check Device Connection

```powershell
adb devices
```

Should show your device:
```
List of devices attached
ABC123XYZ    device
```

### Step 6: View Logs (PowerShell)

**PowerShell doesn't have `grep`, use `Select-String` instead:**

```powershell
# All React Native logs
adb logcat | Select-String "ReactNativeJS"

# Filter for OAuth/Supabase
adb logcat | Select-String "OAuth|Supabase|Auth"

# Save to file
adb logcat | Select-String "OAuth|Supabase|Auth" | Out-File -FilePath oauth_logs.txt
```

**Or use `findstr` (Windows built-in):**

```powershell
# Filter logs
adb logcat | findstr /I "OAuth Supabase Auth ReactNativeJS"

# Save to file
adb logcat | findstr /I "OAuth Supabase Auth" > oauth_logs.txt
```

## Solution 3: Use Expo Dev Tools (Easier)

If you're using Expo, you can use Expo Dev Tools:

1. **Shake device** → "Debug Remote JS"
2. Open Chrome DevTools (usually opens automatically)
3. View console logs in Chrome DevTools

## Recommended: Use Debug Alerts

**The easiest solution is to use the debug alerts I just added.** They will show:
- Every step of the OAuth flow
- Error messages
- Success confirmations

**Just build a new APK and test - you'll see all the alerts on your phone!**

## Quick Test

1. Build new APK:
   ```bash
   eas build --platform android --profile preview
   ```

2. Install on phone

3. Try Google login

4. Watch for alerts showing:
   - OAuth start
   - OAuth URL (check if it has localhost)
   - Callback received
   - Params extracted
   - Success/Error

This will help us identify where the redirect loop is happening!

