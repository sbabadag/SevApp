# Fix: Supabase "Please provide a valid URL" Error

## Problem
Supabase dashboard shows "Please provide a valid URL" when trying to add `exp://localhost:8081/--/auth`.

This happens because Supabase's URL validator doesn't accept the `exp://` scheme in some versions.

## Solution: Use Production Deep Link Format

### For Production Builds

Instead of `exp://localhost:8081/--/auth`, use your app's package name as the scheme:

```
com.sevapp.app://auth
```

### Steps to Add in Supabase

1. **In Supabase Dashboard** → **Authentication** → **URL Configuration**
2. **Click "Add new redirect URLs"**
3. **Enter:**
   ```
   com.sevapp.app://auth
   ```
4. **Click "Save URLs"**

### Alternative: If Custom Schemes Don't Work

If Supabase still doesn't accept custom schemes, you can use:

1. **Universal Links (iOS)** or **App Links (Android)**:
   - Set up a web domain
   - Configure deep linking
   - Use: `https://yourdomain.com/auth`

2. **Or use Supabase's callback URL directly:**
   - The OAuth flow will complete
   - Then manually handle the redirect in your app

## Current Code Configuration

The code has been updated to use:
- **Development**: `exp://localhost:8081/--/auth` (for Expo Go)
- **Production**: `com.sevapp.app://auth` (for standalone builds)

## Complete Redirect URLs List

Add these to Supabase (if they're accepted):

```
com.sevapp.app://auth
```

If `exp://` format is needed for development, you might need to:
1. Use Expo Go for development (which handles `exp://` automatically)
2. Or configure a web-based redirect URL

## Testing

After adding `com.sevapp.app://auth` to Supabase:

1. Rebuild your app:
   ```bash
   eas build --platform android --profile preview
   ```

2. Install and test Google login

3. Check console logs - should show:
   ```
   🔗 OAuth Redirect Configuration:
     Environment: Production
     Scheme: com.sevapp.app
     Redirect URL: com.sevapp.app://auth
   ```

## Important Notes

- ✅ `com.sevapp.app://auth` is the correct format for production builds
- ✅ This matches your app's package name: `com.sevapp.app`
- ✅ Supabase should accept this format (it's a valid deep link URL)
- ❌ `exp://` scheme might not be accepted by Supabase's validator

## If Still Not Working

If Supabase still rejects the URL:

1. **Check Supabase version** - newer versions might have different validation
2. **Try without path**: `com.sevapp.app://` (just the scheme)
3. **Contact Supabase support** - they might need to whitelist custom schemes
4. **Use web-based redirect** - set up a web domain and use HTTPS URLs


