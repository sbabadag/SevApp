# Enable Real-Time Replication in Supabase

If you're seeing `CHANNEL_ERROR` messages in the console, it means real-time replication is not enabled for the `notifications` table in Supabase.

## Steps to Enable Real-Time:

1. **Go to Supabase Dashboard**
   - Navigate to your project: https://supabase.com/dashboard

2. **Open Database Settings**
   - Click on **"Database"** in the left sidebar
   - Click on **"Replication"** tab

3. **Enable Replication for Notifications Table**
   - Find the `notifications` table in the list
   - Toggle the switch to **ON** (enable replication)
   - This allows real-time subscriptions to work

4. **Verify**
   - After enabling, restart your app
   - Check the console - you should see:
     ```
     NotificationService: ✅ Real-time subscription active
     ```
   - Instead of:
     ```
     NotificationService: ⚠️ Real-time subscription error
     ```

## Why Real-Time?

Real-time replication allows your app to:
- ✅ Receive notifications instantly when they're created
- ✅ Update the badge count immediately
- ✅ No need to constantly poll the database
- ✅ Better user experience

## Fallback Mechanism

Even if real-time is not enabled, the app will still work using:
- **Polling**: Checks for new notifications every 10 seconds
- This is less efficient but ensures notifications are still received

## Note

Real-time replication is a Supabase feature that requires:
- A Supabase project (free tier supports it)
- The table must have replication enabled
- RLS policies must allow the user to read their own notifications
