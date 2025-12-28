# View Logs on Phone Device

## Problem
You can't see console logs when running the app on a phone device.

## Solutions

### Solution 1: Debug Alerts (Already Added) ✅

I've added debug alerts to the OAuth flow. You'll see alerts showing:
- OAuth start
- OAuth URL received
- Callback received
- Params extracted
- Success/Error messages

**Note:** Alerts only show in `__DEV__` mode. For production builds, you need to use other methods.

### Solution 2: ADB Logcat (Android) - Recommended

Connect your phone via USB and use ADB to view logs:

1. **Enable USB Debugging** on your phone:
   - Settings → About Phone → Tap "Build Number" 7 times
   - Settings → Developer Options → Enable "USB Debugging"

2. **Connect phone via USB**

3. **View logs:**
   ```bash
   # All React Native logs
   adb logcat | grep ReactNativeJS
   
   # Filter for specific tags
   adb logcat | grep -E "OAuth|Supabase|Auth"
   
   # Save logs to file
   adb logcat > logs.txt
   ```

4. **Filter for your app:**
   ```bash
   adb logcat | grep -E "com.sevapp.app|ReactNativeJS"
   ```

### Solution 3: React Native Debugger

1. Install React Native Debugger:
   ```bash
   npm install -g react-native-debugger
   ```

2. Open React Native Debugger

3. In your app, shake device → "Debug"

4. View console logs in the debugger

### Solution 4: Remote Logging Service

Use a service like:
- **Sentry** (error tracking + logs)
- **Bugsnag** (error tracking)
- **LogRocket** (session replay + logs)

### Solution 5: Build Debug APK

Build a debug APK instead of production:

```bash
eas build --platform android --profile preview --type apk
```

Debug builds show more logs and allow debugging.

## Quick Test: Check Current Alerts

The code now shows alerts for:
1. ✅ OAuth start (with app deep link)
2. ✅ OAuth URL received (with localhost check)
3. ✅ OAuth callback received
4. ✅ Params extracted
5. ✅ Success/Error messages

**To see alerts:**
- Make sure you're running in development mode
- Or build a debug APK

## Recommended: Use ADB Logcat

For production builds, ADB logcat is the best way to see logs:

```bash
# Connect phone via USB
# Then run:
adb logcat | grep -E "OAuth|Supabase|Auth|ReactNativeJS"
```

This will show all OAuth-related logs in real-time.


