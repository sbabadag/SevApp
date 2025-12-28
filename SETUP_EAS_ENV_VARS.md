# Setup EAS Environment Variables for Production Build

## Problem
The production build on your phone shows: "Google login requires Supabase to be configured. Please set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY"

This happens because EAS Build doesn't automatically use your local `.env` file. You need to set environment variables as EAS Secrets.

## Solution: Set EAS Secrets

### Step 1: Get Your Supabase Credentials

If you don't have them:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

### Step 2: Set EAS Secrets

Run these commands in your terminal:

```bash
# Set Supabase URL
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "https://isoydimyquabqfrezuuc.supabase.co"

# Set Supabase Anon Key
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "sb_publishable_aNWSLMDoVdG2eo3Py9kPsg_KbrmIAyD"
```

**Replace:**
- `YOUR_SUPABASE_URL` with your actual Supabase project URL
- `YOUR_SUPABASE_ANON_KEY` with your actual anon key

### Step 3: Update eas.json

I'll update your `eas.json` to use these environment variables in builds.

### Step 4: Rebuild

After setting secrets, rebuild the app:

```bash
eas build --platform android --profile preview
```

## Alternative: Check Existing Secrets

To see if secrets are already set:

```bash
eas secret:list
```

## Important Notes

- **Secrets are encrypted** and stored securely by Expo
- **They're scoped to your project** (only this project can use them)
- **They're available in all build profiles** (preview, production, etc.)
- **You need to rebuild** after setting secrets (they're baked into the build)

## Quick Command Reference

```bash
# List all secrets
eas secret:list

# Create a secret
eas secret:create --scope project --name VARIABLE_NAME --value "value"

# Delete a secret
eas secret:delete --name VARIABLE_NAME

# Update a secret (delete and recreate)
eas secret:delete --name VARIABLE_NAME
eas secret:create --scope project --name VARIABLE_NAME --value "new_value"
```


