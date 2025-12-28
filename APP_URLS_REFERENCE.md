# App URLs Reference

## Supabase URLs

### Supabase Project URL
```
https://isoydimyquabqfrezuuc.supabase.co
```

### Supabase Callback URL (for OAuth)
```
https://isoydimyquabqfrezuuc.supabase.co/auth/v1/callback
```

## App Deep Links

### Production App Deep Link
```
com.sevapp.app://auth
```

### Development App Deep Link (Expo Go)
```
exp://localhost:8081/--/auth
```

## Where to Use These URLs

### 1. Supabase Dashboard → Authentication → URL Configuration

**Site URL:**
```
https://isoydimyquabqfrezuuc.supabase.co
```

**Redirect URLs (Optional - can be empty with skipBrowserRedirect: true):**
- Leave empty OR
- Add: `com.sevapp.app://auth` (if Supabase accepts it)
- Add: `exp://localhost:8081/--/auth` (for development)

### 2. Google Cloud Console → OAuth 2.0 Client

**Authorized JavaScript origins:**
```
https://isoydimyquabqfrezuuc.supabase.co
```

**Authorized redirect URIs:**
```
https://isoydimyquabqfrezuuc.supabase.co/auth/v1/callback
```

### 3. App Configuration (app.json)

Already configured:
- Package: `com.sevapp.app`
- Scheme: `exp`
- Supabase URL: `https://isoydimyquabqfrezuuc.supabase.co`

## Quick Checklist

- [x] **Supabase Site URL**: `https://isoydimyquabqfrezuuc.supabase.co` ✅
- [x] **Google Cloud Redirect URI**: `https://isoydimyquabqfrezuuc.supabase.co/auth/v1/callback` ✅
- [x] **App Deep Link**: `com.sevapp.app://auth` ✅

## Most Important: Supabase Site URL

If you're asking for **Supabase Dashboard → Site URL**, use:
```
https://isoydimyquabqfrezuuc.supabase.co
```

This should be set in:
**Supabase Dashboard** → **Authentication** → **URL Configuration** → **Site URL**

