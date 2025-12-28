# Supabase Site URL Kontrolü - localhost:3000 Hatası

## Sorun
Uygulama `localhost:3000`'e yönlendiriliyor. Bu, Supabase'in Site URL ayarından kaynaklanıyor olabilir.

## Kontrol Edilmesi Gerekenler

### 1. Supabase Site URL (KRİTİK)

**Supabase Dashboard** → **Authentication** → **URL Configuration**

**Site URL** alanını kontrol edin:

✅ **DOĞRU:**
```
https://isoydimyquabqfrezuuc.supabase.co
```

❌ **YANLIŞ (Bu localhost:3000 hatasına neden olur):**
```
http://localhost:3000
http://127.0.0.1:3000
localhost:3000
```

**Eğer yanlışsa:**
1. Site URL'i `https://isoydimyquabqfrezuuc.supabase.co` olarak güncelleyin
2. Kaydedin
3. Yeni build oluşturun

### 2. Supabase Redirect URLs

**Redirect URLs** bölümünde:
- `localhost:3000` içeren herhangi bir URL varsa **SİLİN**
- Boş bırakabilirsiniz (kod `skipBrowserRedirect: true` kullanıyor)

### 3. Google Cloud Console

**Authorized redirect URIs** kontrol edin:
- ✅ Olmalı: `https://isoydimyquabqfrezuuc.supabase.co/auth/v1/callback`
- ❌ Olmamalı: `http://localhost:3000` veya benzeri

## Debug: Console Loglarını Kontrol Edin

Yeni build'de console'da şunları göreceksiniz:

```
✅ Final OAuth Redirect URL: com.sevapp.app://auth
📤 Requesting OAuth URL from Supabase with redirectTo: com.sevapp.app://auth
📥 OAuth URL received from Supabase:
  Full URL: https://isoydimyquabqfrezuuc.supabase.co/auth/v1/authorize?...
  Contains localhost? false
  Contains 3000? false
```

**Eğer "Contains localhost? true" görüyorsanız:**
- Supabase Site URL'i yanlış yapılandırılmış
- Supabase'den gelen OAuth URL'inde localhost var
- Site URL'i düzeltin

## Hızlı Çözüm

1. **Supabase Dashboard** → **Authentication** → **URL Configuration**
2. **Site URL**: `https://isoydimyquabqfrezuuc.supabase.co` olduğundan emin olun
3. **Redirect URLs**: Boş bırakın veya localhost içerenleri silin
4. **Kaydedin**
5. **Yeni build oluşturun:**
   ```bash
   eas build --platform android --profile preview
   ```

## Test

Yeni build'de:
- Console loglarını kontrol edin
- `localhost:3000` hatası görünmemeli
- Google login çalışmalı


