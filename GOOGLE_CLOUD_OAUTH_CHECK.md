# Google Cloud OAuth Ayarları Kontrolü

## Mevcut Ayarlarınız

### ✅ Authorized redirect URIs
```
https://isoydimyquabqfrezuuc.supabase.co/auth/v1/callback
```
**Durum:** ✅ **DOĞRU** - Bu Supabase callback URL'i, Google OAuth için gerekli.

### ⚠️ Authorized JavaScript origins
**Durum:** Boş görünüyor

## Önerilen Ayarlar

### 1. Authorized JavaScript origins (Opsiyonel ama Önerilen)

JavaScript origins eklemek için:

1. **"+ Add URI"** butonuna tıklayın
2. Şu URL'yi ekleyin:
   ```
   https://isoydimyquabqfrezuuc.supabase.co
   ```
3. **"Save"** butonuna tıklayın

**Neden gerekli?**
- Supabase'in JavaScript client'ı için gerekli
- OAuth popup'ları için güvenlik kontrolü
- Zorunlu değil ama önerilir

### 2. Authorized redirect URIs (Zorunlu - ✅ Mevcut)

```
https://isoydimyquabqfrezuuc.supabase.co/auth/v1/callback
```

**Durum:** ✅ **DOĞRU YAPILANDIRILMIŞ**

Bu URL:
- Google'dan gelen OAuth response'u alır
- Supabase'e yönlendirir
- Supabase bu response'u işler ve uygulamanıza yönlendirir

## Kontrol Listesi

- [x] **Authorized redirect URIs** - ✅ Doğru (`https://isoydimyquabqfrezuuc.supabase.co/auth/v1/callback`)
- [ ] **Authorized JavaScript origins** - ⚠️ Boş (opsiyonel ama eklenebilir)
- [x] **Client ID** - ✅ Mevcut (`977869536520-mjbftk1a0ilampidc1a8kge6lgr3qf63.apps.googleusercontent.com`)
- [x] **Client Secret** - ✅ Mevcut (Supabase'de yapılandırılmış olmalı)

## Supabase'de Kontrol Edilmesi Gerekenler

1. **Supabase Dashboard** → **Authentication** → **Providers** → **Google**
   - Client ID: `977869536520-mjbftk1a0ilampidc1a8kge6lgr3qf63.apps.googleusercontent.com` ✅
   - Client Secret: Google Cloud'dan kopyalanmış olmalı ✅
   - Enable Google provider: ✅ Açık olmalı

2. **Supabase Dashboard** → **Authentication** → **URL Configuration**
   - Site URL: `https://isoydimyquabqfrezuuc.supabase.co` ✅
   - Redirect URLs: Boş bırakılabilir (kod `skipBrowserRedirect: true` kullanıyor)

## Sonuç

✅ **Google Cloud ayarlarınız DOĞRU!**

Authorized redirect URI doğru yapılandırılmış. Eğer isterseniz JavaScript origins'e de Supabase URL'ini ekleyebilirsiniz (opsiyonel).

## Hala localhost:3000 Hatası Alıyorsanız

1. **Yeni build oluşturun** (kod güncellendi):
   ```bash
   eas build --platform android --profile preview
   ```

2. **Console loglarını kontrol edin** - hangi redirect URL kullanılıyor göreceksiniz

3. **Supabase'de Google provider'ın aktif olduğundan emin olun**


