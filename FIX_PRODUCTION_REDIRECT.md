# Fix: Production Build Redirects to localhost:3000

## Problem
After login on production build, the app tries to connect to `localhost:3000` which fails because:
- Production builds don't run on localhost
- `localhost:3000` is only for development
- Production needs a proper deep link scheme

## Solution

### 1. Code Updated
The code now uses the correct scheme for production:
- **Development**: `exp://localhost:8081/--/auth`
- **Production**: `com.sevapp.app://auth` (using your app's package name)

### 2. Configure Supabase Redirect URLs

You need to add the production redirect URL to Supabase:

1. Go to **Supabase Dashboard** → **Authentication** → **URL Configuration**
2. In **Redirect URLs**, add:
   ```
   com.sevapp.app://auth
   ```
3. Also keep the development URLs if you still test locally:
   ```
   exp://localhost:8081/--/auth
   exp://YOUR_LOCAL_IP:8081/--/auth
   ```
4. Click **Save**

### 3. Verify App Scheme

Your `app.json` should have:
```json
{
  "expo": {
    "scheme": "exp",
    "android": {
      "package": "com.sevapp.app"
    },
    "ios": {
      "bundleIdentifier": "com.sevapp.app"
    }
  }
}
```

The code will automatically use:
- `com.sevapp.app` for production builds
- `exp` for development builds

### 4. Rebuild the App

After updating Supabase redirect URLs, rebuild:

```bash
eas build --platform android --profile preview
```

## Complete Supabase Redirect URLs List

Add ALL of these to Supabase → Authentication → URL Configuration:

```
exp://localhost:8081/--/auth
exp://YOUR_LOCAL_IP:8081/--/auth
com.sevapp.app://auth
```

Replace `YOUR_LOCAL_IP` with your computer's local IP address (for physical device testing).

## How to Find Your Local IP

**Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" (e.g., `192.168.1.100`)

**Mac/Linux:**
```bash
ifconfig
# or
ip addr
```

## Testing

After rebuilding:
1. Install the new APK
2. Try Google login
3. Check console logs - you should see:
   ```
   🔗 OAuth Redirect Configuration:
     Environment: Production
     Scheme: com.sevapp.app
     Redirect URL: com.sevapp.app://auth
   ```
4. The redirect should work without `localhost` errors

## Important Notes

- ✅ Production builds use `com.sevapp.app://auth` (your app's package name)
- ✅ Development builds use `exp://localhost:8081/--/auth`
- ✅ Both URLs must be in Supabase redirect URLs list
- ✅ The scheme comes from your `app.json` package/bundleIdentifier


