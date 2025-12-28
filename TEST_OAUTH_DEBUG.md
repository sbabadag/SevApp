# Test OAuth Debug Alerts

## Build and Test Steps

### 1. Create New Build

```bash
eas build --platform android --profile preview
```

### 2. Install on Phone

Download the APK from EAS and install on your phone.

### 3. Test Google Login

1. Open the app
2. Go to Login screen
3. Tap "Sign in with Google"
4. **Watch for debug alerts** - you'll see alerts at each step

### 4. What to Look For

The debug alerts will show:

#### Alert 1: "OAuth Debug"
- Shows: "Starting OAuth" + App Deep Link
- **Check**: Does the deep link show `com.sevapp.app://auth`? (Should be YES ✅)
- **If localhost**: That's the problem! ❌

#### Alert 2: "OAuth URL Received"
- Shows: OAuth URL from Supabase + localhost check
- **Check**: Does it say "Contains localhost: NO ✅"?
- **If YES**: Supabase is configured wrong ❌

#### Alert 3: "OAuth Callback"
- Shows: Callback URL received
- **Check**: Does it contain `access_token` or `error`?
- **If error**: Check the error message

#### Alert 4: "OAuth Params"
- Shows: Extracted parameters
- **Check**: Does it show `access_token, refresh_token`?
- **If empty**: Tokens weren't extracted ❌

#### Alert 5: "OAuth Success" or "OAuth Error"
- Shows: Final result
- **If Success**: Login worked! ✅
- **If Error**: Check the error message

## Expected Flow

1. ✅ Alert: "OAuth Debug" → Deep link: `com.sevapp.app://auth`
2. ✅ Alert: "OAuth URL Received" → No localhost
3. Browser opens → Google login page
4. User logs in → Google redirects to Supabase
5. ✅ Alert: "OAuth Callback" → URL with tokens
6. ✅ Alert: "OAuth Params" → `access_token, refresh_token`
7. ✅ Alert: "OAuth Success" → Login complete!

## If Redirect Loop Happens

If you see "çok fazla kez yönlendirdi" error:

1. **Check Alert 2**: Does OAuth URL contain localhost?
   - If YES → Fix Supabase Dashboard redirect URLs
   
2. **Check Alert 3**: What does the callback URL show?
   - If it keeps redirecting → The `returnUrl` in `WebBrowser.openAuthSessionAsync` might be wrong

3. **Check Alert 4**: Are params extracted?
   - If NO → The callback URL format might be wrong

## Report Back

After testing, tell me:
1. Which alerts did you see?
2. What did each alert show?
3. Where did it fail? (if it failed)
4. Did you see the redirect loop error?

This will help me fix the exact issue!

