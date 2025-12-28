# Native Google Sign-In Option

## Overview

Expo recommends using `@react-native-google-signin/google-signin` for Google authentication instead of OAuth web flow. This is a **native solution** that avoids redirect loop issues.

## Advantages

✅ **No redirect loops** - Native sign-in doesn't use web redirects  
✅ **Better UX** - Native Google Sign-In UI  
✅ **More reliable** - No browser dependency  
✅ **Official Expo recommendation** - [Expo Google Auth Guide](https://docs.expo.dev/guides/google-authentication/)

## Disadvantages

⚠️ **Requires more setup** - Need Firebase or Google Cloud Console configuration  
⚠️ **More code changes** - Need to replace current OAuth implementation  
⚠️ **Requires app upload** - Need SHA-1 fingerprint from Google Play Console  

## Current Status

We're currently using **Supabase OAuth** with web redirect flow, which has redirect loop issues.

## Migration Steps (If You Choose This Option)

### 1. Install Package

```bash
npm install @react-native-google-signin/google-signin
```

### 2. Add Config Plugin

In `app.json`:
```json
{
  "expo": {
    "plugins": [
      [
        "@react-native-google-signin/google-signin",
        {
          "iosUrlScheme": "com.sevapp.app"
        }
      ]
    ]
  }
}
```

### 3. Configure Google Cloud Console

1. Get SHA-1 fingerprint from EAS build or Google Play Console
2. Add to Google Cloud Console → OAuth 2.0 Client → Android
3. Configure iOS bundle ID

### 4. Update Code

Replace `signInWithGoogle()` in `authService.ts` with native Google Sign-In.

### 5. Link with Supabase

After getting Google ID token, exchange it with Supabase:

```typescript
const { idToken } = await GoogleSignin.signIn();
const { data, error } = await supabase.auth.signInWithIdToken({
  provider: 'google',
  token: idToken,
});
```

## Recommendation

**Try Option 1 first** (debug alerts with current OAuth):
- Less work
- Might fix the issue
- Can see exactly where the loop happens

**If Option 1 doesn't work**, then migrate to native Google Sign-In (Option 2).

## Next Steps

1. **Test current build** with debug alerts
2. **See what alerts show** - this will tell us where the loop happens
3. **If still broken**, we can migrate to native Google Sign-In

