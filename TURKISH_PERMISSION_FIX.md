# Bildirim İzinleri Sorunu ve Çözümü

## Sorun
Telefonda SevApp uygulamasında "Bildirimleri Yönet" bölümünde:
- "İzin Verme" seçeneği devre dışı
- "İzinler - İstek Yapılan İzin Yok" mesajı görünüyor

Bu, uygulamanın bildirim izinlerini hiç istemediği anlamına gelir.

## Çözüm

### 1. Uygulamayı Yeniden Başlatın
- Uygulamayı tamamen kapatın
- Tekrar açın
- Giriş yapın (eğer giriş yapmadıysanız)

### 2. İzin İsteği Otomatik Olmalı
Uygulama açıldığında ve kullanıcı giriş yaptığında otomatik olarak bildirim izinleri istenecek.

### 3. Manuel İzin Verme (Gerekirse)

Eğer izin isteği görünmüyorsa:

#### Android:
1. **Ayarlar → Uygulamalar → SevApp → Bildirimler**
2. "Bildirimlere İzin Ver" seçeneğini **AÇIK** yapın
3. "Varsayılan" kanalına tıklayın
4. Şunları kontrol edin:
   - ✅ Ses: AÇIK
   - ✅ Önem: Yüksek veya Acil
   - ✅ Titreşim: AÇIK (isteğe bağlı)

#### Alternatif Yol:
1. **Ayarlar → Uygulamalar → SevApp → İzinler**
2. "Bildirimler" iznini **AÇIK** yapın

### 4. Uygulamayı Test Edin

1. Uygulamayı açın
2. Giriş yapın
3. Konsol loglarını kontrol edin - şunları görmelisiniz:
   ```
   🔔 App: User logged in, requesting notification permissions...
   🔔 registerForPushNotificationsAsync: Starting permission request...
   🔔 registerForPushNotificationsAsync: Requesting permissions...
   ```

4. Telefonda bir izin isteği popup'ı görünmelidir
5. "İzin Ver" veya "Allow" butonuna tıklayın

### 5. Test Bildirimi Gönderin

1. **Profil → Ayarlar → Test Notification Sound** butonuna tıklayın
2. İki test bildirimi gönderilecek
3. Ses duymalısınız

### 6. Sorun Devam Ederse

Eğer hala izin isteği görünmüyorsa:

1. **Uygulamayı tamamen kaldırın ve yeniden yükleyin**
2. Veya:
   ```bash
   # Metro cache'i temizleyin
   npx expo start --clear
   ```
3. Uygulamayı yeniden başlatın

## Konsol Logları

İzin isteği sırasında konsolda şunları görmelisiniz:

```
🔔 App: User logged in, requesting notification permissions...
🔔 registerForPushNotificationsAsync: Starting permission request...
🔔 registerForPushNotificationsAsync: Current permission status: undetermined
🔔 registerForPushNotificationsAsync: Requesting permissions...
🔔 registerForPushNotificationsAsync: Permission request result: granted
✅ registerForPushNotificationsAsync: Permissions granted, getting token...
✅ registerForPushNotificationsAsync: Expo push token received: ExponentPushToken[...]
✅ registerForPushNotificationsAsync: Android notification channel configured: default
✅ Push notification token registered: ExponentPushToken[...]
```

## Önemli Notlar

- İzin isteği sadece kullanıcı **giriş yaptıktan sonra** otomatik olarak yapılır
- Eğer kullanıcı izni reddederse, manuel olarak ayarlardan açmanız gerekir
- Android 13+ için bildirim izinleri ayrı bir izin olarak istenir
- Uygulama ilk açılışta izin isteyebilir, bu normaldir



