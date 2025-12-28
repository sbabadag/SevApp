# Fix: "Çok Fazla Kez Yönlendirdi" (Redirect Loop) Hatası

## Sorun
"iso..supabase.co sizi çok fazla kez yönlendirdi" hatası alıyorsunuz. Bu bir redirect loop (yönlendirme döngüsü) hatası.

## Neden
`WebBrowser.openAuthSessionAsync`'e Supabase callback URL'ini veriyorduk, bu da bir döngü oluşturuyordu:
1. Browser → Google OAuth
2. Google → Supabase callback URL
3. Supabase callback → Tekrar Supabase'e yönlendirme (LOOP!)

## Çözüm
`WebBrowser.openAuthSessionAsync`'in ikinci parametresine **app deep link**'ini veriyoruz:
- ✅ `com.sevapp.app://auth` (app deep link)
- ❌ `https://isoydimyquabqfrezuuc.supabase.co/auth/v1/callback` (Supabase callback - loop oluşturuyor)

## Nasıl Çalışıyor (Yeni)

1. **App**, Supabase'e OAuth URL'i ister (redirectTo belirtilmez)
2. **Supabase**, Google OAuth URL'ini döner (varsayılan callback URL kullanılır)
3. **Browser**, Google login sayfasını açar
4. **Kullanıcı**, Google'da giriş yapar
5. **Google**, Supabase callback URL'ine yönlendirir: `https://isoydimyquabqfrezuuc.supabase.co/auth/v1/callback#access_token=...`
6. **Browser**, callback URL'ini yakalar ve **app deep link**'ine yönlendirir: `com.sevapp.app://auth#access_token=...`
7. **App**, deep link'ten token'ları parse eder ve session oluşturur

## Kod Değişiklikleri

### Önceki Kod (Hatalı - Loop Oluşturuyor)
```typescript
const result = await WebBrowser.openAuthSessionAsync(data.url, supabaseCallbackUrl);
// supabaseCallbackUrl → Loop oluşturuyor
```

### Yeni Kod (Doğru)
```typescript
const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
// redirectTo = com.sevapp.app://auth → App'e yönlendiriyor
```

## Önemli Notlar

1. **`signInWithOAuth`'da `redirectTo` belirtilmiyor:**
   - Supabase varsayılan callback URL'ini kullanır
   - Browser, callback'i yakalayıp app'e yönlendirir

2. **`WebBrowser.openAuthSessionAsync`'de app deep link kullanılıyor:**
   - Browser, OAuth flow'u tamamladıktan sonra app'e yönlendirir
   - Token'lar deep link'te hash fragment olarak gelir

3. **Google Cloud Console:**
   - `https://isoydimyquabqfrezuuc.supabase.co/auth/v1/callback` olmalı (zaten var)

## Test

Yeni build'de console loglarını kontrol edin:

```
📤 Requesting OAuth URL from Supabase:
  App Deep Link (for final redirect): com.sevapp.app://auth
🌐 Opening OAuth URL in browser...
  Will redirect back to app: com.sevapp.app://auth
✅ OAuth callback received: com.sevapp.app://auth#access_token=...
📋 Extracted params: access_token, refresh_token
```

## Yeni Build

```bash
eas build --platform android --profile preview
```

Bu değişiklikle redirect loop hatası çözülmeli!


