# How to Create Notifications in Supabase

This guide shows you how to create notifications in Supabase to test the real-time notification system.

## Method 1: Using Supabase SQL Editor (Easiest)

### Step 1: Open SQL Editor

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New query"**

### Step 2: Get Your User ID

First, you need to find your user ID. Run this query:

```sql
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;
```

Copy the `id` (UUID) of your user account.

### Step 3: Create a Test Notification

Replace `YOUR_USER_ID` with the UUID you copied:

```sql
INSERT INTO notifications (user_id, title, message, type, data)
VALUES (
  '4b8bf18a-e829-488e-b289-cf0d63c490de',  -- Replace with your actual user ID
  'Test Notification melo',
  'This is a test notification created from Supabase!',
  'general',
  '{"source": "manual_test", "timestamp": "2025-12-26"}'::jsonb
);
```

### Step 4: Check Your App

- The notification should appear **instantly** in your app (if you're logged in)
- Go to the **Notifications** screen to see it
- The unread count badge should update on the Home screen

## Method 2: Create Multiple Test Notifications

```sql
-- Create multiple notifications at once
INSERT INTO notifications (user_id, title, message, type, data)
VALUES 
  (
    'YOUR_USER_ID',
    'Order Shipped',
    'Your order #12345 has been shipped and is on its way!',
    'order',
    '{"order_id": "12345", "status": "shipped"}'::jsonb
  ),
  (
    'YOUR_USER_ID',
    'New Promotion',
    'Check out our summer sale - 50% off on all items!',
    'promotion',
    '{"promotion_id": "summer-2025", "discount": 50}'::jsonb
  ),
  (
    'YOUR_USER_ID',
    'Welcome!',
    'Thanks for joining SevApp. Start shopping now!',
    'general',
    '{}'::jsonb
  );
```

## Method 3: Create Notification via Supabase API (Programmatic)

You can also create notifications programmatically using the Supabase client:

### In Your App Code:

```typescript
import { notificationService } from './src/services/notificationService';

// Create a notification for the current user
const { data, error } = await notificationService.createNotification({
  title: 'Test from App',
  message: 'This notification was created from the app!',
  type: 'general',
  data: { test: true }
});
```

### Using cURL:

```bash
curl -X POST 'https://YOUR_PROJECT.supabase.co/rest/v1/notifications' \
  -H "apikey: YOUR_ANON_KEY" \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "user_id": "YOUR_USER_ID",
    "title": "API Test",
    "message": "Created via API",
    "type": "general",
    "data": {}
  }'
```

## Method 4: Test Order Status Notifications (Automatic)

The easiest way to test order notifications is to create/update an order:

### Step 1: Create an Order

```sql
-- First, get your user ID (if you don't have it)
SELECT id FROM auth.users WHERE email = 'your-email@example.com';

-- Create a test order
INSERT INTO orders (user_id, status, subtotal, shipping, tax, total, shipping_address)
VALUES (
  'YOUR_USER_ID',
  'pending',
  99.99,
  10.00,
  5.00,
  114.99,
  '123 Test Street, City, State 12345'
)
RETURNING id;
```

### Step 2: Update Order Status (This Triggers Notification Automatically)

```sql
-- Update order status - this will automatically create a notification!
UPDATE orders 
SET status = 'shipped' 
WHERE id = 'YOUR_ORDER_ID';

-- Or try other statuses:
-- UPDATE orders SET status = 'processing' WHERE id = 'YOUR_ORDER_ID';
-- UPDATE orders SET status = 'delivered' WHERE id = 'YOUR_ORDER_ID';
-- UPDATE orders SET status = 'cancelled' WHERE id = 'YOUR_ORDER_ID';
```

**Note**: The database trigger will automatically create a notification when the order status changes!

## Method 5: Create Notification for All Users (Admin)

If you want to send a notification to all users (requires admin access):

```sql
-- Create notification for all users
INSERT INTO notifications (user_id, title, message, type, data)
SELECT 
  id as user_id,
  'System Announcement',
  'We have exciting news! Check out our new features.',
  'system',
  '{"announcement_id": "2025-12-26"}'::jsonb
FROM auth.users;
```

## Quick Test Script

Here's a complete SQL script you can run:

```sql
-- Step 1: Get your user ID
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get the most recent user (or change the email)
  SELECT id INTO v_user_id 
  FROM auth.users 
  ORDER BY created_at DESC 
  LIMIT 1;

  -- Create test notification
  INSERT INTO notifications (user_id, title, message, type, data)
  VALUES (
    v_user_id,
    '🎉 Test Notification',
    'This notification was created from Supabase SQL Editor!',
    'general',
    jsonb_build_object(
      'source', 'sql_editor',
      'timestamp', NOW()
    )
  );

  RAISE NOTICE 'Notification created for user: %', v_user_id;
END $$;
```

## Verify Notifications

### Check if notification was created:

```sql
SELECT 
  id,
  title,
  message,
  type,
  read,
  created_at
FROM notifications
WHERE user_id = 'YOUR_USER_ID'
ORDER BY created_at DESC
LIMIT 10;
```

### Check unread count:

```sql
SELECT COUNT(*) as unread_count
FROM notifications
WHERE user_id = 'YOUR_USER_ID'
AND read = false;
```

## Troubleshooting

### Notification not appearing in app?

1. **Check if you're logged in** - Notifications only show for logged-in users
2. **Verify user ID** - Make sure the `user_id` in the notification matches your logged-in user
3. **Check real-time subscription** - The app should be subscribed to real-time changes
4. **Refresh the app** - Try pulling down to refresh the notifications screen

### Real-time not working?

1. **Check Supabase real-time is enabled**:
   - Go to Database → Replication
   - Make sure `notifications` table has replication enabled

2. **Check RLS policies**:
   ```sql
   -- Verify RLS is enabled
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE tablename = 'notifications';
   ```

3. **Check subscription in app logs**:
   - Look for "Subscribed to notifications" in console

## Example: Complete Test Flow

```sql
-- 1. Get your user ID
SELECT id, email FROM auth.users WHERE email = 'your-email@example.com';

-- 2. Create a test notification
INSERT INTO notifications (user_id, title, message, type)
VALUES (
  'YOUR_USER_ID',
  'Test Notification',
  'This should appear in your app instantly!',
  'general'
);

-- 3. Verify it was created
SELECT * FROM notifications WHERE user_id = 'YOUR_USER_ID' ORDER BY created_at DESC LIMIT 1;

-- 4. Mark it as read (from app or SQL)
UPDATE notifications SET read = true WHERE id = (SELECT id FROM notifications WHERE user_id = 'YOUR_USER_ID' ORDER BY created_at DESC LIMIT 1);

-- 5. Check unread count
SELECT COUNT(*) FROM notifications WHERE user_id = 'YOUR_USER_ID' AND read = false;
```

---

**Quick Start**: Just copy the SQL from Method 1, replace `YOUR_USER_ID` with your actual user ID, and run it in Supabase SQL Editor!

