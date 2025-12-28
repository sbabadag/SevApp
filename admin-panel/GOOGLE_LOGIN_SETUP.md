# Google Login Setup for Admin Panel

## Overview

Google login has been added to the admin panel. Users can now sign in with their Google account.

## How It Works

1. User clicks "Sign in with Google" button
2. Supabase OAuth flow redirects to Google login
3. After authentication, Google redirects back to admin panel
4. OAuth callback route handles the redirect and completes login
5. User is redirected to Dashboard

## Supabase Configuration

### 1. Enable Google Provider

1. Go to **Supabase Dashboard** → **Authentication** → **Providers**
2. Find **Google** provider
3. Enable it
4. Add your Google OAuth credentials:
   - **Client ID**: From Google Cloud Console
   - **Client Secret**: From Google Cloud Console

### 2. Add Redirect URL

In **Supabase Dashboard** → **Authentication** → **URL Configuration** → **Redirect URLs**, add:

**For Local Development:**
```
http://localhost:5173/auth/callback
```

**For GitHub Pages:**
```
https://YOUR_USERNAME.github.io/SevApp/auth/callback
```

Replace `YOUR_USERNAME` with your GitHub username and `SevApp` with your repository name.

## Google Cloud Console Configuration

### Authorized Redirect URIs

In **Google Cloud Console** → **OAuth 2.0 Client** → **Authorized redirect URIs**, add:

```
https://isoydimyquabqfrezuuc.supabase.co/auth/v1/callback
```

This is the Supabase callback URL that handles OAuth.

## Testing

1. **Local Development:**
   - Start admin panel: `npm run dev`
   - Go to `http://localhost:5173/login`
   - Click "Sign in with Google"
   - Complete Google authentication
   - Should redirect to Dashboard

2. **GitHub Pages:**
   - Deploy admin panel to GitHub Pages
   - Go to your admin panel URL
   - Click "Sign in with Google"
   - Complete Google authentication
   - Should redirect to Dashboard

## Troubleshooting

### Redirect URL Mismatch

If you get "redirect_uri_mismatch" error:
- Check Supabase Redirect URLs include your admin panel callback URL
- Check Google Cloud Console Authorized Redirect URIs include Supabase callback

### OAuth Callback Not Working

- Make sure `/auth/callback` route is accessible
- Check browser console for errors
- Verify Supabase OAuth is enabled

### GitHub Pages Base Path

If using GitHub Pages, the redirect URL automatically includes the base path (e.g., `/SevApp/auth/callback`).

## Notes

- Google login uses the same Supabase authentication as email/password login
- Users can use either email/password or Google to sign in
- Session management is handled by Supabase automatically

