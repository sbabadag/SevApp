# Fix: Supabase Rejects Custom Scheme URLs

## Problem
Supabase's URL validator rejects both:
- `exp://localhost:8081/--/auth` ❌
- `com.sevapp.app://auth` ❌

Error: "Please provide a valid URL"

## Root Cause
Supabase only accepts HTTP/HTTPS URLs in the redirect URL field. Custom schemes (`exp://`, `com.sevapp.app://`) are not accepted by the validator.

## Solution: Use Supabase Callback + Deep Link Handling

For mobile apps, the OAuth flow should work like this:
1. App opens Supabase OAuth URL
2. User authenticates
3. Google redirects to Supabase callback: `https://your-project.supabase.co/auth/v1/callback`
4. Supabase processes and redirects to your app

### Option 1: Use Supabase's Built-in Mobile Handling (Recommended)

Supabase automatically handles mobile redirects if you configure it correctly. The `redirectTo` parameter in your code tells Supabase where to send the user after authentication.

**In Supabase Dashboard:**
1. Go to **Authentication** → **URL Configuration**
2. **Site URL**: Set to your Supabase project URL (already set)
   ```
   https://isoydimyquabqfrezuuc.supabase.co
   ```
3. **Redirect URLs**: Leave empty OR add only web URLs if needed
   - The `redirectTo` parameter in code handles the app redirect

**In Your Code:**
The `redirectTo` parameter in `signInWithOAuth` is what Supabase uses to redirect back to your app. This doesn't need to be in the Supabase dashboard's redirect URLs list.

### Option 2: Use a Web-Based Redirect Page

If Option 1 doesn't work, create a simple web page that redirects to your app:

1. **Create a redirect page** (host it anywhere, e.g., GitHub Pages, Netlify):
   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <script>
       // Get the hash fragment from URL
       const hash = window.location.hash;
       // Redirect to app
       window.location = 'com.sevapp.app://auth' + hash;
     </script>
   </head>
   <body>
     <p>Redirecting to app...</p>
   </body>
   </html>
   ```

2. **Add this HTTPS URL to Supabase**:
   ```
   https://yourdomain.com/auth-callback
   ```

3. **Update your code** to use this web URL as `redirectTo`

### Option 3: Skip Browser Redirect (Current Implementation)

Your current code uses `skipBrowserRedirect: true`, which means:
- The OAuth URL is opened in browser
- After authentication, Supabase redirects
- Your app handles the redirect via `WebBrowser.openAuthSessionAsync`

For this to work, you might not need to add redirect URLs to Supabase at all, as long as:
- Google Cloud Console has the Supabase callback URL
- Your app handles the redirect properly

## Recommended Fix: Update Code to Handle Redirects Better

Let me update the code to better handle the OAuth flow without requiring custom scheme URLs in Supabase.


