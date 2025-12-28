# Fix: Google Sign-in Redirects to placeholder.supabase.co

## Problem
When clicking "Sign in with Google", the app redirects to `placeholder.supabase.co` instead of your actual Supabase project.

This means the environment variables are not being read correctly in the production build.

## Root Cause
EAS Build injects `EXPO_PUBLIC_*` environment variables directly into `process.env` during build time. The `${}` syntax in `app.json` is for local development only.

## Solution Applied

### 1. Removed `${}` from app.json
The `app.json` no longer has template variables - EAS Build handles this automatically.

### 2. Updated Code to Prioritize process.env
The code now checks `process.env` first (where EAS Build injects secrets), then falls back to `Constants.expoConfig.extra`.

### 3. Added Production Logging
Added console logs that work in production to help debug what's being read.

## Next Steps

### 1. Verify EAS Secrets Are Set

Check that secrets are set for the environment you're building:

```bash
# For preview builds
eas env:list preview

# For production builds  
eas env:list production
```

You should see:
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### 2. Set Secrets for Production (if needed)

If you're building for production and secrets aren't set:

```bash
eas env:create production --name EXPO_PUBLIC_SUPABASE_URL --value "https://isoydimyquabqfrezuuc.supabase.co" --scope project --visibility sensitive --non-interactive

eas env:create production --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "sb_publishable_aNWSLMDoVdG2eo3Py9kPsg_KbrmIAyD" --scope project --visibility sensitive --non-interactive
```

### 3. Rebuild the App

**CRITICAL**: You MUST rebuild after any code or secret changes:

```bash
eas build --platform android --profile preview
```

### 4. Check Console Logs

After installing the new APK, check the console logs. You should see:

```
🔍 Supabase Config Check:
  URL from process.env: ✅ https://isoydimyquabqfrezuuc.supabase.co...
  Key from process.env: ✅ sb_publishable_aNWSLM...
  Final URL: https://isoydimyquabqfrezuuc.supabase.co
  Final Key: sb_publishable_aNWSLM...
✅ Supabase configuration loaded successfully
```

If you see "❌ Not set" for process.env, the secrets aren't being injected during build.

## Troubleshooting

### If process.env shows "Not set":

1. **Verify secrets are set for the correct environment:**
   ```bash
   eas env:list preview
   ```

2. **Check build logs** in EAS Dashboard to see if environment variables are being injected

3. **Try setting secrets for all environments:**
   ```bash
   # Set for preview
   eas env:create preview --name EXPO_PUBLIC_SUPABASE_URL --value "YOUR_URL" --scope project --visibility sensitive --non-interactive
   
   # Set for production
   eas env:create production --name EXPO_PUBLIC_SUPABASE_URL --value "YOUR_URL" --scope project --visibility sensitive --non-interactive
   ```

### If still redirecting to placeholder:

1. **Check the console logs** - they will show exactly what values are being read
2. **Verify the Supabase URL** is correct (should be `https://isoydimyquabqfrezuuc.supabase.co`)
3. **Make sure you rebuilt** after setting secrets

## Important Notes

- ✅ EAS Build automatically injects `EXPO_PUBLIC_*` secrets into `process.env`
- ✅ No need for `${}` syntax in `app.json` for EAS builds
- ✅ Secrets must be set for the specific build profile (preview/production)
- ✅ You MUST rebuild after setting secrets (they're baked into the build)


