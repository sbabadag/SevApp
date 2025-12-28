# OAuth Redirect Loop - Son Çözüm

## Sorun
"Çok fazla kez yönlendirdi" hatası devam ediyor. Tüm yaklaşımlar denendi ama loop devam ediyor.

## Root Cause
`WebBrowser.openAuthSessionAsync`'in ikinci parametresi (returnUrl) ile Supabase callback URL'i arasında bir uyumsuzluk var. Browser, callback'i yakalayamıyor ve loop oluşuyor.

## Son Çözüm: Supabase Dashboard'da Redirect URL Ekleme

Supabase, custom scheme'leri kabul etmiyor ama redirect loop'u önlemek için farklı bir yaklaşım deneyebiliriz:

### Seçenek 1: Supabase Redirect URLs'e App Deep Link Ekleme (Deneme)

1. **Supabase Dashboard** → **Authentication** → **URL Configuration**
2. **Redirect URLs** bölümüne ekleyin:
   ```
   com.sevapp.app://auth
   ```
   (Eğer Supabase kabul ederse)

3. **Kod'da:**
   ```typescript
   redirectTo: redirectTo, // com.sevapp.app://auth
   skipBrowserRedirect: false, // Supabase redirect'i handle etsin
   ```

### Seçenek 2: Web-Based Redirect Page (En Güvenilir)

Eğer Supabase custom scheme'leri kabul etmiyorsa, bir web redirect sayfası oluşturun:

1. **Bir web sayfası oluşturun** (Netlify, Vercel, GitHub Pages):
   ```html
   <!DOCTYPE html>
   <html>
   <head>
     <script>
       // Get hash fragment from URL
       const hash = window.location.hash;
       // Redirect to app
       window.location.href = 'com.sevapp.app://auth' + hash;
     </script>
   </head>
   <body>
     <p>Redirecting to app...</p>
   </body>
   </html>
   ```

2. **Supabase'e bu URL'i ekleyin:**
   ```
   https://yourdomain.com/auth-callback
   ```

3. **Kod'da:**
   ```typescript
   redirectTo: 'https://yourdomain.com/auth-callback',
   skipBrowserRedirect: false,
   ```

### Seçenek 3: Mevcut Kod'u Düzeltme (Şu Anki Durum)

Mevcut kod zaten doğru görünüyor:
- `skipBrowserRedirect: true` ✅
- `redirectTo` belirtilmiyor ✅
- `WebBrowser.openAuthSessionAsync`'e app deep link veriliyor ✅

Ama hala loop var. Bu durumda:

1. **Supabase Dashboard'ı kontrol edin:**
   - Site URL: `https://isoydimyquabqfrezuuc.supabase.co` ✅
   - Redirect URLs: **BOŞ OLMALI** (localhost içeren bir şey varsa silin)

2. **Google Cloud Console'u kontrol edin:**
   - Authorized redirect URIs: Sadece `https://isoydimyquabqfrezuuc.supabase.co/auth/v1/callback` olmalı
   - `localhost:3000` veya başka bir şey varsa silin

3. **Console loglarını kontrol edin:**
   - Hangi URL'lerin kullanıldığını göreceksiniz
   - Loop'un nerede oluştuğunu anlayabilirsiniz

## Önerilen Adımlar

1. **Supabase Dashboard'ı temizleyin:**
   - Redirect URLs'den localhost içeren her şeyi silin
   - Boş bırakın

2. **Google Cloud Console'u temizleyin:**
   - Sadece Supabase callback URL'i olsun

3. **Yeni build oluşturun:**
   ```bash
   eas build --platform android --profile preview
   ```

4. **Console loglarını paylaşın:**
   - Hangi URL'lerin kullanıldığını görmek için

## Alternatif: Supabase Mobile SDK Kullanma

Eğer hiçbir şey çalışmazsa, Supabase'in mobile SDK'sını kullanabilirsiniz, ama bu büyük bir değişiklik gerektirir.


