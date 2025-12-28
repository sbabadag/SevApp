# ⚠️ Important: Supabase Site URL Correction

## Current Issue

You've set Supabase Site URL to: `com.sevapp.app://auth`

**This is incorrect!** ❌

## Why It's Wrong

Supabase **Site URL** must be an **HTTP/HTTPS URL**, not a custom scheme (deep link).

- ✅ **Correct**: `https://isoydimyquabqfrezuuc.supabase.co`
- ❌ **Wrong**: `com.sevapp.app://auth` (custom scheme)

## Correct Configuration

### Supabase Dashboard → Authentication → URL Configuration

**Site URL:**
```
https://isoydimyquabqfrezuuc.supabase.co
```

**Redirect URLs:**
- Can be **empty** (with `skipBrowserRedirect: true`)
- OR add: `com.sevapp.app://auth` (if Supabase accepts it - but Site URL must still be HTTPS)

## Why This Matters

The **Site URL** is used by Supabase to:
- Generate OAuth URLs
- Validate redirect URLs
- Handle authentication callbacks

If you set it to a custom scheme, Supabase might:
- Generate incorrect OAuth URLs
- Fail to validate redirects
- Cause authentication errors

## Action Required

1. **Go to Supabase Dashboard** → **Authentication** → **URL Configuration**
2. **Change Site URL to:**
   ```
   https://isoydimyquabqfrezuuc.supabase.co
   ```
3. **Redirect URLs** can be empty or contain:
   - `com.sevapp.app://auth` (if you want to add it, but Site URL must be HTTPS)

## Summary

- **Site URL**: Must be `https://isoydimyquabqfrezuuc.supabase.co` ✅
- **Redirect URLs**: Can be empty or contain deep links (optional)

The deep link (`com.sevapp.app://auth`) is handled by your app code, not by Supabase's Site URL setting.

