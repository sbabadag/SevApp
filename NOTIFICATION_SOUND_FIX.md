# Notification Sound Fix Guide

## Issue: Not Hearing Notification Sounds

If you're not hearing notification sounds, here are the fixes I've applied and additional checks:

## ✅ Fixes Applied

1. **Android Channel Configuration** - Added `sound: 'noti.mp3'` to the notification channel
2. **Local Notifications** - Changed from `sound: true` to `sound: 'noti.mp3'`
3. **Push Notifications** - Changed from `sound: 'default'` to `sound: 'noti.mp3'`
4. **Test Script** - Updated to use custom sound

## 🔍 Additional Checks

### 1. Device Settings

- **Check device volume** - Make sure notification volume is turned up
- **Check Do Not Disturb** - Make sure DND is off
- **Check app notification settings** - Go to Android Settings → Apps → SevApp → Notifications
  - Ensure "Sound" is enabled
  - Ensure notification channel "Default" has sound enabled

### 2. Sound File Format

The sound file `noti.mp3` should be:
- **Format**: MP3, WAV, or OGG
- **Location**: `assets/noti.mp3`
- **Length**: Keep it short (1-3 seconds recommended)

**Note**: For Android, you might need to convert MP3 to OGG for better compatibility:

```bash
# If you have ffmpeg installed
ffmpeg -i assets/noti.mp3 assets/noti.ogg
```

Then update `app.json`:
```json
"sounds": ["./assets/noti.ogg"]
```

### 3. Rebuild After Changes

After changing sound configuration, you need to rebuild:

```bash
# Clear cache and restart
npx expo start --clear

# Or for production build
eas build --platform android --profile production
```

### 4. Test Sound File

Test if the sound file works:

```typescript
// Add this temporarily to test
import { sendLocalNotification } from './src/utils/notifications';

// In your component or test function
await sendLocalNotification(
  'Sound Test',
  'You should hear a sound!',
  { test: true }
);
```

## 🛠️ Alternative: Use Default System Sound

If custom sound doesn't work, you can use the default system sound:

### Option 1: Use 'default' sound

Update `src/utils/notifications.ts`:
```typescript
sound: 'default', // Instead of 'noti.mp3'
```

### Option 2: Remove sound specification

For Android channel:
```typescript
await Notifications.setNotificationChannelAsync('default', {
  name: 'Default',
  importance: Notifications.AndroidImportance.MAX,
  vibrationPattern: [0, 250, 250, 250],
  // Remove sound property - will use system default
});
```

## 📱 Android-Specific Issues

### Notification Channel Importance

Make sure the channel importance is set to MAX:
```typescript
importance: Notifications.AndroidImportance.MAX
```

### Check Channel Settings

You can check if the channel is properly configured:
```typescript
import * as Notifications from 'expo-notifications';

const channel = await Notifications.getNotificationChannelAsync('default');
console.log('Notification channel:', channel);
```

## 🧪 Testing Steps

1. **Test local notification with sound**:
   ```typescript
   await sendLocalNotification('Test', 'Sound test');
   ```

2. **Check device notification settings**:
   - Settings → Apps → SevApp → Notifications
   - Ensure "Default" channel has sound enabled

3. **Test push notification**:
   ```bash
   node scripts/testNotification.js YOUR_TOKEN
   ```

4. **Check console logs**:
   - Look for any sound-related errors
   - Check if notification channel is created properly

## 🔧 Quick Fix: Use System Default

If custom sound still doesn't work, the quickest fix is to use the system default:

1. **Update Android channel** (remove custom sound):
   ```typescript
   await Notifications.setNotificationChannelAsync('default', {
     name: 'Default',
     importance: Notifications.AndroidImportance.MAX,
     vibrationPattern: [0, 250, 250, 250],
     // System will use default sound
   });
   ```

2. **Update notification payloads**:
   ```typescript
   sound: 'default', // Instead of 'noti.mp3'
   ```

## 📝 Common Issues

### Issue: Sound file not found
- **Solution**: Make sure `assets/noti.mp3` exists and is in the correct location
- **Check**: Run `ls assets/` to verify file exists

### Issue: Sound not playing on Android
- **Solution**: 
  1. Check device volume
  2. Check notification channel settings
  3. Try using 'default' sound instead
  4. Rebuild the app

### Issue: Sound works in development but not production
- **Solution**: Make sure sound file is included in build
- **Check**: `app.json` has sound in `assetBundlePatterns` or `plugins`

## ✅ Current Configuration

Your current setup:
- ✅ Sound file: `assets/noti.mp3` exists
- ✅ app.json: Sound configured in plugin
- ✅ Android channel: Sound specified
- ✅ Notification handler: `shouldPlaySound: true`

**Next step**: Rebuild the app and test. If it still doesn't work, try using `'default'` sound instead of `'noti.mp3'`.

---

**Quick Test**: After rebuilding, send a test notification and check:
1. Device volume is up
2. Notification appears
3. Sound plays (or check if vibration works)

