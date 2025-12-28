# Supabase Tam Restore Rehberi

Projenizi silip yeniden kurmak için gereken tüm adımlar.

## ⚠️ ÖNEMLİ: Yedekleme Öncesi

Projeyi silmeden önce şunları yedekleyin:

1. ✅ **Database Schema** - `supabase-schema.sql` (var)
2. ✅ **Campaigns Table** - `admin-panel/supabase-campaigns-setup.sql` (var)
3. ✅ **Storage Setup** - `admin-panel/supabase-storage-setup.sql` (var)
4. ✅ **Database Data** - `backups/supabase_backup_*.sql` (az önce aldık)
5. ⚠️ **Storage Files** - Bucket'lardaki dosyaları manuel indirin
6. ⚠️ **OAuth Settings** - Google OAuth Client ID ve Secret'ı kaydedin

---

## 📋 Restore Adımları

### 1. Yeni Supabase Projesi Oluştur

1. https://app.supabase.com → **New Project**
2. Proje bilgilerini girin:
   - **Name:** SevApp (veya istediğiniz isim)
   - **Database Password:** Güçlü bir password seçin (kaydedin!)
   - **Region:** En yakın bölgeyi seçin
3. Proje oluşturulmasını bekleyin (2-3 dakika)

### 2. Database Schema'yı Yükle

**Adım 2.1: Ana Schema**
1. Supabase Dashboard → **SQL Editor** → **New Query**
2. `supabase-schema.sql` dosyasının içeriğini kopyalayın
3. **Run** butonuna tıklayın
4. Tüm tablolar, RLS policies, functions ve triggers oluşturulacak

**Adım 2.2: Campaigns Tablosu**
1. **SQL Editor** → **New Query**
2. `admin-panel/supabase-campaigns-setup.sql` dosyasının içeriğini kopyalayın
3. **Run** butonuna tıklayın

**Adım 2.3: Storage Bucket**
1. **SQL Editor** → **New Query**
2. `admin-panel/supabase-storage-setup.sql` dosyasının içeriğini kopyalayın
3. **Run** butonuna tıklayın

**VEYA Storage'ı Dashboard'dan oluşturun:**
1. **Storage** → **New bucket**
2. **Name:** `product-images`
3. **Public bucket:** ✅ İşaretleyin
4. **Create bucket**

### 3. Database Verilerini Yükle

**Seçenek A: Node.js Script ile (Önerilen - pg_dump gerekmez)**

```bash
# Backup dosyasını restore et
node scripts/restore-supabase-node.js
```

**Seçenek B: pg_dump ile (PostgreSQL client gerekir)**

```bash
# Backup dosyasını restore et
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres" \
  < backups/supabase_backup_2025-12-28T18-23-06.sql
```

**Seçenek C: Supabase Dashboard SQL Editor'den**

1. **SQL Editor** → **New Query**
2. Backup SQL dosyasını açın (`backups/supabase_backup_*.sql`)
3. İçeriği kopyalayıp yapıştırın
4. **Run** butonuna tıklayın

### 4. Storage Dosyalarını Yükle

Eğer Storage bucket'larında dosyalar varsa:

**Manuel Yöntem:**
1. Eski projeden dosyaları indirin
2. Yeni projede **Storage** → **product-images** bucket'ına yükleyin

**Script ile (gelecekte eklenebilir):**
```bash
node scripts/restore-storage-files.js
```

### 5. OAuth Provider'ları Yapılandır

**Google OAuth:**

1. **Authentication** → **Providers** → **Google**
2. **Enable Google provider** ✅
3. **Client ID (for OAuth):** Eski projeden aldığınız Client ID
4. **Client Secret (for OAuth):** Eski projeden aldığınız Client Secret
5. **Save**

**Google Cloud Console'da Redirect URI'yi güncelleyin:**
1. https://console.cloud.google.com → **APIs & Services** → **Credentials**
2. OAuth 2.0 Client ID'nizi seçin
3. **Authorized redirect URIs**'ye yeni projenizin callback URL'sini ekleyin:
   ```
   https://[YENI-PROJECT-REF].supabase.co/auth/v1/callback
   ```
4. **Authorized JavaScript origins**'e yeni projenizin URL'sini ekleyin:
   ```
   https://[YENI-PROJECT-REF].supabase.co
   ```

Detaylı bilgi: `GOOGLE_LOGIN_SETUP.md`

### 6. Environment Variables'ı Güncelle

**Mobile App (`app.json` veya EAS Secrets):**
```json
{
  "extra": {
    "supabaseUrl": "https://[YENI-PROJECT-REF].supabase.co",
    "supabaseAnonKey": "[YENI-ANON-KEY]"
  }
}
```

**Admin Panel (`.env`):**
```env
VITE_SUPABASE_URL=https://[YENI-PROJECT-REF].supabase.co
VITE_SUPABASE_ANON_KEY=[YENI-ANON-KEY]
```

**Yeni credentials'ları almak için:**
1. Supabase Dashboard → **Settings** → **API**
2. **Project URL** ve **anon/public key**'i kopyalayın

### 7. Admin Panel Base Path'i Güncelle (GitHub Pages için)

Eğer admin panel GitHub Pages'de deploy edildiyse:

1. `admin-panel/vite.config.ts` dosyasını kontrol edin
2. Base path doğru mu kontrol edin
3. GitHub Actions workflow'u yeni URL ile güncelleyin

---

## ✅ Kontrol Listesi

Restore sonrası kontrol edin:

- [ ] Tüm tablolar oluşturuldu mu? (Table Editor'den kontrol edin)
- [ ] RLS policies aktif mi? (Table Editor → RLS sekmesi)
- [ ] Functions ve triggers çalışıyor mu? (Test edin)
- [ ] Storage bucket'lar oluşturuldu mu? (Storage → Buckets)
- [ ] OAuth provider'lar yapılandırıldı mı? (Authentication → Providers)
- [ ] Veriler yüklendi mi? (Table Editor'den kontrol edin)
- [ ] Mobile app yeni URL ile çalışıyor mu?
- [ ] Admin panel yeni URL ile çalışıyor mu?

---

## 📝 Eksik Olanlar

`supabase-schema.sql` dosyası şunları içeriyor:
- ✅ Tüm tablolar (categories, products, orders, vb.)
- ✅ RLS policies
- ✅ Functions (update_updated_at_column, update_product_rating, vb.)
- ✅ Triggers
- ✅ Indexes
- ✅ Extensions (uuid-ossp)

**Eksik olanlar:**
- ❌ Campaigns tablosu (ayrı dosyada: `admin-panel/supabase-campaigns-setup.sql`)
- ❌ Storage bucket setup (ayrı dosyada: `admin-panel/supabase-storage-setup.sql`)

**Dashboard'dan yapılması gerekenler:**
- OAuth provider ayarları (Google, vb.)
- Storage bucket dosyaları (manuel yükleme)
- Database password (proje oluştururken)

---

## 🚀 Hızlı Restore Script'i

Tüm SQL dosyalarını tek seferde çalıştırmak için:

```sql
-- 1. Ana schema
-- supabase-schema.sql içeriğini buraya yapıştırın

-- 2. Campaigns tablosu
-- admin-panel/supabase-campaigns-setup.sql içeriğini buraya yapıştırın

-- 3. Storage setup
-- admin-panel/supabase-storage-setup.sql içeriğini buraya yapıştırın
```

VEYA ayrı ayrı çalıştırın (önerilen - hata ayıklama daha kolay).

---

## 🔄 Otomatik Restore Script (Gelecekte)

Tam otomatik restore için script hazırlanabilir:

```bash
# Tüm SQL dosyalarını sırayla çalıştırır
node scripts/restore-supabase-full.js
```

---

## 📚 İlgili Dosyalar

- `supabase-schema.sql` - Ana database schema
- `admin-panel/supabase-campaigns-setup.sql` - Campaigns tablosu
- `admin-panel/supabase-storage-setup.sql` - Storage bucket setup
- `backups/supabase_backup_*.sql` - Veri backup'ları
- `GOOGLE_LOGIN_SETUP.md` - OAuth setup rehberi
- `SUPABASE_BACKUP_GUIDE.md` - Backup rehberi

---

## ❓ Sorun Giderme

**"Table already exists" hatası:**
- Tablolar zaten oluşturulmuş, devam edebilirsiniz
- Veya `DROP TABLE` ile önce silin

**"Policy already exists" hatası:**
- RLS policies zaten var, devam edebilirsiniz
- Veya `DROP POLICY` ile önce silin

**"Function already exists" hatası:**
- Functions zaten var, `CREATE OR REPLACE FUNCTION` kullanın

**OAuth çalışmıyor:**
- Google Cloud Console'da redirect URI'yi kontrol edin
- Supabase Dashboard'da provider ayarlarını kontrol edin
- Client ID ve Secret'ın doğru olduğundan emin olun

---

## 💡 İpuçları

1. **Test ortamında önce deneyin** - Production'da silmeden önce
2. **Backup'ları güvenli yerde saklayın** - Cloud storage, external drive
3. **Password'leri kaydedin** - Database password, OAuth secrets
4. **Adım adım ilerleyin** - Her adımı kontrol edin
5. **Documentation'ı güncelleyin** - Yeni proje bilgilerini kaydedin

