# Notification Sound Troubleshooting Guide

If you're not hearing notification sounds, follow these steps:

## 1. Check Device Settings

### Android Device Settings:
1. **Check Silent/Do Not Disturb Mode**
   - Make sure your device is NOT in silent mode
   - Check Do Not Disturb settings
   - Ensure media volume is turned up

2. **App Notification Settings**
   - Go to: **Settings → Apps → SevApp → Notifications**
   - Ensure notifications are enabled
   - Check that the "Default" channel has:
     - ✅ Sound enabled
     - ✅ Importance set to "High" or "Urgent"
     - ✅ Vibration enabled (optional)

3. **System Sound Settings**
   - Go to: **Settings → Sound**
   - Ensure notification volume is turned up
   - Check that notification sounds are not muted

## 2. Test Notification Sound

1. Open the app
2. Go to **Profile → Settings**
3. Tap **"Test Notification Sound"**
4. You should hear two test notifications

## 3. Check Console Logs

When testing, check the console for:
- `NotificationHandler: Received notification:` - Shows notification was received
- `Sending test notification X` - Shows test was sent
- Channel configuration logs - Shows Android channel settings

## 4. Common Issues

### Issue: No sound when app is in foreground
**Solution**: The notification handler is configured to play sound in foreground. If it still doesn't work:
- Check device notification settings (see above)
- Ensure the app has notification permissions
- Try closing and reopening the app

### Issue: Sound works in background but not foreground
**Solution**: This is expected behavior on some Android versions. The handler should play sound, but device settings may override it.

### Issue: Sound works for test but not real notifications
**Solution**: 
- Check that push notifications include `sound: 'default'` in the payload
- Verify the notification channel is configured correctly
- Check Supabase notification creation code

## 5. Manual Channel Configuration

If sounds still don't work, you can manually configure the notification channel:

1. Go to: **Settings → Apps → SevApp → Notifications**
2. Find the "Default" channel
3. Tap on it
4. Ensure:
   - **Importance**: High or Urgent
   - **Sound**: Enabled (select a sound)
   - **Vibration**: Enabled (optional)
   - **Show on lock screen**: Enabled

## 6. Rebuild the App

If nothing works:
1. Stop the Expo server
2. Clear cache: `npx expo start --clear`
3. Rebuild the app
4. Test again

## 7. Check Notification Handler

The notification handler is configured in `src/utils/notifications.ts`:

```typescript
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true, // This should play sound
      shouldSetBadge: true,
    };
  },
});
```

If this is not working, the issue is likely device settings, not code.

## 8. Production vs Development

- **Development**: Uses Expo push notifications (works immediately)
- **Production**: Requires FCM setup for Android (see `FCM_SETUP_GUIDE.md`)

## Still Not Working?

1. Check if other apps' notifications play sounds
2. Restart your device
3. Reinstall the app
4. Check Android version compatibility (Android 8.0+ uses notification channels)



