# Admin Kullanıcı Oluşturma

## Yöntem 1: Supabase Dashboard'dan (Önerilen)

1. **Supabase Dashboard'a gidin:**
   - https://supabase.com/dashboard
   - Projenizi seçin

2. **Authentication → Users bölümüne gidin**

3. **"Add user" veya "Invite user" butonuna tıklayın**

4. **Email ve şifre girin:**
   - Email: `admin@sevapp.com` (veya istediğiniz email)
   - Password: Güçlü bir şifre belirleyin
   - "Auto Confirm User" seçeneğini işaretleyin (email doğrulama olmadan giriş için)

5. **"Create user" butonuna tıklayın**

6. **Artık admin panelde bu bilgilerle giriş yapabilirsiniz!**

## Yöntem 2: SQL ile (Gelişmiş)

Supabase SQL Editor'de şu komutu çalıştırın:

```sql
-- Yeni admin kullanıcı oluştur
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  confirmation_token,
  recovery_token
)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@sevapp.com',  -- Email adresiniz
  crypt('your_secure_password', gen_salt('bf')),  -- Şifreniz
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  '',
  ''
);
```

**Not:** Bu yöntem daha karmaşık. Yöntem 1'i öneriyoruz.

## Yöntem 3: Mobil Uygulamadan Kayıt

1. Mobil uygulamayı açın
2. Yeni bir hesap oluşturun (Register)
3. Aynı email ve şifre ile admin panelde giriş yapın

## Giriş Yapma

Admin panel açıldığında:
- Email: Oluşturduğunuz email adresi
- Password: Belirlediğiniz şifre

ile giriş yapabilirsiniz.



