# Rebuild App with EAS Secrets

## Problem
You've set the EAS secrets, but the error persists because:
- **Secrets are baked into the build at build time**
- Your current APK was built BEFORE secrets were set
- You need to create a NEW build with secrets included

## Solution: Rebuild the App

### Step 1: Verify Secrets Are Set

```bash
eas env:list
```

You should see:
- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### Step 2: Create New Build

**Important**: You MUST rebuild after setting secrets!

```bash
eas build --platform android --profile preview
```

This will:
- Create a new build with secrets included
- Take ~15-20 minutes
- Give you a new APK download link

### Step 3: Install New APK

1. Download the new APK from the build link
2. Uninstall the old app from your phone
3. Install the new APK
4. The Supabase configuration should now work!

## Important Notes

⚠️ **You cannot update secrets in an existing build** - you must rebuild!

✅ **Secrets are automatically available** in all new builds after you set them

✅ **No need to modify code** - Expo automatically injects `EXPO_PUBLIC_*` variables

## Verify Supabase Anon Key Format

Supabase anon keys are JWT tokens that start with `eyJ...`

If your key starts with `sb_publishable_`, that's from a different service (like Clerk), not Supabase.

To get the correct Supabase anon key:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Settings → API
4. Copy the **anon/public** key (should start with `eyJ...`)

## Troubleshooting

### Still seeing error after rebuild?

1. **Check secret values:**
   ```bash
   eas env:list
   ```

2. **Verify Supabase URL format:**
   - Should be: `https://xxxxx.supabase.co`
   - Not: `http://` or missing `https://`

3. **Verify Anon Key format:**
   - Should start with: `eyJ...`
   - Should be a long JWT token

4. **Delete and recreate secrets if needed:**
   ```bash
   eas env:delete --name EXPO_PUBLIC_SUPABASE_URL
   eas env:delete --name EXPO_PUBLIC_SUPABASE_ANON_KEY
   eas env:create --name EXPO_PUBLIC_SUPABASE_URL --value "your-url" --scope project
   eas env:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "your-key" --scope project
   ```

## Quick Checklist

- [ ] Secrets are set (`eas env:list`)
- [ ] Supabase URL is correct format
- [ ] Anon key starts with `eyJ...`
- [ ] New build created after setting secrets
- [ ] Old app uninstalled
- [ ] New APK installed

---

**Next Step**: Run `eas build --platform android --profile preview` to create a new build with secrets!


