# Final OAuth Fix: Redirect Loop Çözümü

## Sorun
"Çok fazla kez yönlendirdi" hatası devam ediyor.

## Root Cause Analizi

Sorun şu: `WebBrowser.openAuthSessionAsync`'in ikinci parametresi (returnUrl), browser'ın OAuth flow'u tamamladıktan sonra hangi URL'e döneceğini belirliyor. 

Eğer Supabase callback URL'ini verirsek:
- Browser → Google OAuth
- Google → Supabase callback
- Browser callback'i görünce → Tekrar Supabase'e yönlendirme (LOOP!)

## Çözüm

### Strateji
1. **Supabase'e `redirectTo` belirtme** - Supabase varsayılan callback URL'ini kullanır
2. **`WebBrowser.openAuthSessionAsync`'e app deep link ver** - Browser app'e yönlendirir
3. **Browser callback'i yakalar** - Supabase callback'i görünce app deep link'e yönlendirir

### Kod

```typescript
// 1. Supabase'e redirectTo belirtme
const { data } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    // redirectTo belirtilmiyor - Supabase varsayılan callback kullanır
    queryParams: {
      access_type: 'offline',
      prompt: 'consent',
    },
    skipBrowserRedirect: true, // Manuel redirect handling
  },
});

// 2. WebBrowser'a app deep link ver
const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
// redirectTo = com.sevapp.app://auth (app deep link)
```

## Nasıl Çalışıyor

1. **App**, Supabase'e OAuth URL'i ister (redirectTo belirtilmez)
2. **Supabase**, Google OAuth URL'ini döner (varsayılan callback: `https://isoydimyquabqfrezuuc.supabase.co/auth/v1/callback`)
3. **Browser**, Google login sayfasını açar
4. **Kullanıcı**, Google'da giriş yapar
5. **Google**, Supabase callback URL'ine yönlendirir: `https://isoydimyquabqfrezuuc.supabase.co/auth/v1/callback#access_token=...`
6. **Browser**, callback URL'ini görünce, `returnUrl` parametresine (app deep link) yönlendirir: `com.sevapp.app://auth#access_token=...`
7. **App**, deep link'ten token'ları parse eder ve session oluşturur

## Önemli Notlar

1. **Supabase'e `redirectTo` belirtilmiyor:**
   - Supabase varsayılan callback URL'ini kullanır
   - Bu URL Google Cloud Console'da tanımlı olmalı

2. **`WebBrowser.openAuthSessionAsync`'de app deep link kullanılıyor:**
   - Browser, OAuth flow'u tamamladıktan sonra app'e yönlendirir
   - Token'lar deep link'te hash fragment olarak gelir

3. **Google Cloud Console:**
   - `https://isoydimyquabqfrezuuc.supabase.co/auth/v1/callback` olmalı ✅

4. **Supabase Dashboard:**
   - Site URL: `https://isoydimyquabqfrezuuc.supabase.co` ✅
   - Redirect URLs: Boş bırakabilirsiniz (kod `skipBrowserRedirect: true` kullanıyor)

## Test

Yeni build'de console loglarını kontrol edin:

```
📤 Requesting OAuth URL from Supabase:
  App Deep Link (for final redirect): com.sevapp.app://auth
🌐 Opening OAuth URL in browser...
  Return URL (app deep link): com.sevapp.app://auth
✅ OAuth callback received: com.sevapp.app://auth#access_token=...
📋 Extracted params: access_token, refresh_token
```

## Yeni Build

```bash
eas build --platform android --profile preview
```

Bu yaklaşım redirect loop'u önlemeli çünkü:
- Supabase callback URL'i `WebBrowser.openAuthSessionAsync`'e verilmiyor
- Browser, callback'i yakalayıp app deep link'e yönlendiriyor
- Loop oluşmuyor


