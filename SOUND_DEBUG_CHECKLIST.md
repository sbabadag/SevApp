# Sound Debug Checklist

If you're still not hearing notification sounds, follow this checklist:

## 1. Check Console Logs

When a notification arrives, you should see these logs in order:

```
🔔 useNotifications: New notification received via real-time
🔊 useNotifications: Triggering local notification with sound...
sendLocalNotification: Sending notification with sound
sendLocalNotification: ✅ Notification scheduled with ID: [number]
🔔 NotificationHandler: Received notification in foreground
🔊 NotificationHandler: Sound should play now!
```

**If you don't see these logs:**
- Real-time subscription might not be working
- Check if notification is being created in Supabase
- Verify user is logged in

## 2. Device Settings (CRITICAL)

### Android Settings:
1. **Settings → Apps → SevApp → Notifications**
   - ✅ Notifications enabled
   - ✅ "Default" channel:
     - ✅ Sound: ON
     - ✅ Importance: High or Urgent
     - ✅ Vibration: ON (optional)

2. **Settings → Sound**
   - ✅ Notification volume: Turned up
   - ✅ Do Not Disturb: OFF
   - ✅ Silent mode: OFF

3. **Device Volume**
   - ✅ Media volume: Turned up
   - ✅ Ring volume: Turned up

## 3. Test the Sound Button

1. Go to **Profile → Settings**
2. Tap **"Test Notification Sound"**
3. You should hear TWO test notifications
4. Check console logs to see if they're being sent

## 4. Check Notification Channel

The Android channel should be configured with:
- `importance: MAX`
- `sound: 'default'`
- `enableVibrate: true`

Check console for:
```
NotificationService: Android notification channel configured: default
NotificationService: Channel details: {...}
```

## 5. Verify Real-Time is Working

1. Create a notification in Supabase
2. Check console for:
   ```
   🔔 useNotifications: New notification received via real-time
   ```
3. If you see this, real-time is working
4. If not, check `ENABLE_REALTIME.md`

## 6. Common Issues

### Issue: Logs show notification sent but no sound
**Possible causes:**
- Device is in silent/Do Not Disturb mode
- Notification channel sound is disabled in Android settings
- App notification permissions not granted

**Solution:**
- Check device settings (see #2)
- Reinstall the app to reset notification settings
- Manually enable sound in Android notification settings

### Issue: No logs at all when notification created
**Possible causes:**
- Real-time subscription not working
- User not logged in
- Notification not being created in Supabase

**Solution:**
- Check if user is logged in
- Verify notification is created in Supabase database
- Check real-time replication is enabled (see `ENABLE_REALTIME.md`)

### Issue: Sound works for test button but not real notifications
**Possible causes:**
- Real-time callback not triggering local notification
- Notification is marked as read immediately

**Solution:**
- Check console logs to see if `sendLocalNotification` is being called
- Verify notification has `read: false` in database

## 7. Force Rebuild

Sometimes notification settings get cached. Try:

```bash
# Stop the app completely
# Clear all caches
npx expo start --clear

# Or rebuild the app
eas build --platform android --profile development
```

## 8. Manual Channel Check

You can manually verify the channel in Android:
1. Settings → Apps → SevApp → Notifications
2. Tap on "Default" channel
3. Ensure:
   - Sound is selected (not "None")
   - Importance is "High" or "Urgent"
   - All toggles are ON

## Still Not Working?

1. Share the console logs when a notification arrives
2. Confirm device settings are correct
3. Try the test button - does that work?
4. Check if other apps' notifications play sounds



