# Debug: localhost:3000 Redirect Hatası

## Sorun
Uygulama hala `localhost:3000`'e yönlendiriliyor, kod güncellemelerine rağmen.

## Olası Nedenler

### 1. Supabase'den Gelen OAuth URL'inde localhost Olabilir

Supabase, OAuth URL'ini oluştururken kendi redirect URL ayarlarını kullanıyor olabilir.

**Kontrol:**
- Supabase Dashboard → Authentication → URL Configuration
- **Site URL** kontrol edin - localhost olmamalı
- **Redirect URLs** listesinde localhost olmamalı

### 2. Google Cloud Console'da Yanlış Redirect URI

Google Cloud Console'da yanlış bir redirect URI olabilir.

**Kontrol:**
- Google Cloud Console → APIs & Services → Credentials
- OAuth 2.0 Client → Authorized redirect URIs
- Sadece şu olmalı: `https://isoydimyquabqfrezuuc.supabase.co/auth/v1/callback`
- `localhost:3000` içeren herhangi bir URI olmamalı

### 3. Build Henüz Yeni Kodla Yapılmamış

Kod güncellemeleri build'e dahil edilmemiş olabilir.

**Çözüm:**
```bash
eas build --platform android --profile preview
```

## Debug Adımları

### Adım 1: Console Loglarını Kontrol Edin

Yeni build'de console'da şunları görmelisiniz:

```
📤 Requesting OAuth URL from Supabase with redirectTo: com.sevapp.app://auth
📥 OAuth URL received from Supabase:
  Full URL: https://isoydimyquabqfrezuuc.supabase.co/auth/v1/authorize?...
  Contains localhost? false
  Contains 3000? false
🌐 Opening OAuth URL in browser...
  Expected redirect back to: com.sevapp.app://auth
```

Eğer "Contains localhost? true" görüyorsanız, Supabase'den gelen URL'de localhost var demektir.

### Adım 2: Supabase Site URL Kontrolü

1. Supabase Dashboard → Authentication → URL Configuration
2. **Site URL** kontrol edin:
   - ✅ Olmalı: `https://isoydimyquabqfrezuuc.supabase.co`
   - ❌ Olmamalı: `http://localhost:3000` veya benzeri

### Adım 3: Google Cloud Console Kontrolü

1. Google Cloud Console → APIs & Services → Credentials
2. OAuth 2.0 Client ID'nizi açın
3. **Authorized redirect URIs** kontrol edin:
   - ✅ Olmalı: `https://isoydimyquabqfrezuuc.supabase.co/auth/v1/callback`
   - ❌ Olmamalı: `http://localhost:3000` veya benzeri

### Adım 4: Supabase Redirect URLs Temizliği

Supabase'de redirect URL'ler boş olabilir veya localhost içerebilir:

1. Supabase Dashboard → Authentication → URL Configuration
2. **Redirect URLs** bölümünü kontrol edin
3. Eğer `localhost:3000` varsa, silin
4. Boş bırakabilirsiniz (kod `skipBrowserRedirect: true` kullanıyor)

## Çözüm

### Senaryo 1: Supabase Site URL Yanlış

**Düzelt:**
1. Supabase Dashboard → Authentication → URL Configuration
2. **Site URL**: `https://isoydimyquabqfrezuuc.supabase.co` olmalı
3. Kaydedin

### Senaryo 2: Google Cloud'da Yanlış Redirect URI

**Düzelt:**
1. Google Cloud Console → OAuth 2.0 Client
2. **Authorized redirect URIs**'den `localhost:3000` içerenleri silin
3. Sadece şunu tutun: `https://isoydimyquabqfrezuuc.supabase.co/auth/v1/callback`

### Senaryo 3: Build Eski Kodla Yapılmış

**Çözüm:**
```bash
eas build --platform android --profile preview --clear-cache
```

## Test

Yeni build'de console loglarını kontrol edin:
- `redirectTo` değeri `com.sevapp.app://auth` olmalı
- Supabase'den gelen URL'de localhost olmamalı
- Google OAuth sayfası açılmalı
- Login sonrası `com.sevapp.app://auth`'a yönlendirmeli


