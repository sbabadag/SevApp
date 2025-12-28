# Fix: "requested path is invalid" Error

## Sorun
Supabase Site URL'ini `https://isoydimyquabqfrezuuc.supabase.co` olarak ayarladıktan sonra "requested path is invalid" hatası alıyorsunuz.

## Neden
Supabase, custom scheme URL'lerini (`com.sevapp.app://auth`) kabul etmiyor. Supabase sadece HTTP/HTTPS URL'lerini kabul ediyor.

## Çözüm
Supabase'in kendi callback URL'ini kullanıyoruz:
- ✅ `https://isoydimyquabqfrezuuc.supabase.co/auth/v1/callback` (Supabase kabul ediyor)
- ❌ `com.sevapp.app://auth` (Supabase reddediyor)

## Kod Değişiklikleri

### Önceki Kod (Hatalı)
```typescript
redirectTo: redirectTo, // com.sevapp.app://auth - Supabase reddediyor
```

### Yeni Kod (Doğru)
```typescript
redirectTo: supabaseCallbackUrl, // https://isoydimyquabqfrezuuc.supabase.co/auth/v1/callback
queryParams: {
  app_redirect: redirectTo, // App deep link'i query param olarak geçiyoruz
}
```

## Nasıl Çalışıyor

1. **App**, Supabase'e OAuth URL'i ister
2. **Supabase**, Google OAuth URL'ini döner (callback URL: `https://isoydimyquabqfrezuuc.supabase.co/auth/v1/callback`)
3. **Browser**, Google login sayfasını açar
4. **Kullanıcı**, Google'da giriş yapar
5. **Google**, Supabase callback URL'ine yönlendirir: `https://isoydimyquabqfrezuuc.supabase.co/auth/v1/callback#access_token=...&refresh_token=...`
6. **App**, callback URL'ini yakalar ve token'ları parse eder
7. **App**, token'ları Supabase'e gönderir ve session oluşturur

## Kontrol Edilmesi Gerekenler

### 1. Google Cloud Console
**Authorized redirect URIs**'de şu olmalı:
```
https://isoydimyquabqfrezuuc.supabase.co/auth/v1/callback
```

### 2. Supabase Dashboard
- **Site URL**: `https://isoydimyquabqfrezuuc.supabase.co`
- **Redirect URLs**: Boş bırakabilirsiniz (kod `skipBrowserRedirect: true` kullanıyor)

## Test

Yeni build'de console loglarını kontrol edin:

```
📤 Requesting OAuth URL from Supabase:
  Supabase Callback URL (for Supabase): https://isoydimyquabqfrezuuc.supabase.co/auth/v1/callback
  App Deep Link (will be used after callback): com.sevapp.app://auth
📥 OAuth URL received from Supabase:
  Full URL: https://isoydimyquabqfrezuuc.supabase.co/auth/v1/authorize?...
  Contains localhost? false
✅ OAuth callback received: https://isoydimyquabqfrezuuc.supabase.co/auth/v1/callback#access_token=...
📋 Extracted params: access_token, refresh_token
```

## Yeni Build

```bash
eas build --platform android --profile preview
```

Bu değişiklikle "requested path is invalid" hatası çözülmeli!


