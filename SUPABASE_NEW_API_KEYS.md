# Using Supabase New API Keys Format

## What Changed?

Supabase has updated their API keys system:
- **Old format**: `anon` key (JWT token starting with `eyJ...`)
- **New format**: `publishable` key (starts with `sb_publishable_...`)

## Which Key to Use?

### Option 1: Use New Publishable Key (Recommended)

The new `sb_publishable_...` key should work with recent versions of `@supabase/supabase-js` (v2.0+).

Your current key: `sb_publishable_aNWSLMDoVdG2eo3Py9kPsg_KbrmIAyD`

### Option 2: Find Legacy Anon Key

If the new key doesn't work, look for the legacy anon key:

1. In Supabase Dashboard → Settings → API Keys
2. Scroll down to find **"Legacy anon, service_role API keys"** section
3. Look for **"anon public"** key (should start with `eyJ...`)
4. Copy that key instead

## Update EAS Secret

If you need to use the legacy anon key:

```bash
# Delete the current secret
eas env:delete --name EXPO_PUBLIC_SUPABASE_ANON_KEY

# Create new secret with legacy anon key
eas env:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "eyJ..." --scope project
```

Or if the new publishable key works, make sure it's set correctly:

```bash
# Verify current secret value
eas env:list

# Update if needed
eas env:delete --name EXPO_PUBLIC_SUPABASE_ANON_KEY
eas env:create --name EXPO_PUBLIC_SUPABASE_ANON_KEY --value "sb_publishable_aNWSLMDoVdG2eo3Py9kPsg_KbrmIAyD" --scope project
```

## Verify Supabase Client Version

Check your `package.json`:
- `@supabase/supabase-js` version should be `^2.0.0` or higher to support new key format
- If using older version (< 2.0), you may need to use legacy anon key

## Test After Update

1. Update the EAS secret with the correct key
2. Rebuild the app:
   ```bash
   eas build --platform android --profile preview
   ```
3. Install new APK and test

## Important Notes

- **Publishable keys** are safe to use in client-side code (with RLS enabled)
- **Secret keys** should NEVER be used in client-side code
- Both new and legacy keys work, but new format is recommended for new projects


