# Supabase Backup Guide

Bu rehber, Supabase projenizi yedeklemenin farklı yöntemlerini açıklar.

## 📋 İçindekiler

1. [Supabase Dashboard ile Yedekleme](#1-supabase-dashboard-ile-yedekleme)
2. [pg_dump ile Komut Satırı Yedekleme](#2-pg_dump-ile-komut-satırı-yedekleme)
3. [Supabase CLI ile Yedekleme](#3-supabase-cli-ile-yedekleme)
4. [Otomatik Yedekleme Scripti](#4-otomatik-yedekleme-scripti)
5. [Storage Bucket Yedekleme](#5-storage-bucket-yedekleme)
6. [Point-in-Time Recovery (PITR)](#6-point-in-time-recovery-pitr)

---

## 1. Supabase Dashboard ile Yedekleme

### Yöntem A: SQL Editor ile Export

1. **Supabase Dashboard**'a gidin: https://app.supabase.com
2. Projenizi seçin
3. **SQL Editor** → **New Query**
4. Aşağıdaki SQL'i çalıştırarak tüm tabloları export edin:

```sql
-- Tüm tabloları listele
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Her tablo için veri export (örnek: products tablosu)
COPY products TO STDOUT WITH CSV HEADER;
```

**Not:** Bu yöntem sadece veriyi export eder, şema (schema) ve RLS politikalarını içermez.

### Yöntem B: Database Settings'den Backup

1. **Settings** → **Database**
2. **Backups** sekmesine gidin
3. **Download backup** butonuna tıklayın (Pro plan gerekir)

---

## 2. pg_dump ile Komut Satırı Yedekleme

### Adım 1: Database Connection String'i Alın

1. Supabase Dashboard → **Settings** → **Database**
2. **Connection string** → **URI** formatını kopyalayın
3. Format: `postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres`

### Adım 2: pg_dump Kurulumu

**Windows:**
```powershell
# PostgreSQL'i indirin ve kurun
# https://www.postgresql.org/download/windows/
# veya Chocolatey ile:
choco install postgresql
```

**macOS:**
```bash
brew install postgresql
```

**Linux:**
```bash
sudo apt-get install postgresql-client
```

### Adım 3: Backup Alın

**Tam Database Backup (Schema + Data):**
```bash
pg_dump "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres" \
  --file=supabase_backup_$(date +%Y%m%d_%H%M%S).sql \
  --verbose \
  --no-owner \
  --no-acl
```

**Sadece Schema (Tablo yapıları, RLS, fonksiyonlar):**
```bash
pg_dump "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres" \
  --schema-only \
  --file=supabase_schema_$(date +%Y%m%d_%H%M%S).sql \
  --verbose \
  --no-owner \
  --no-acl
```

**Sadece Data (Veriler):**
```bash
pg_dump "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres" \
  --data-only \
  --file=supabase_data_$(date +%Y%m%d_%H%M%S).sql \
  --verbose \
  --no-owner \
  --no-acl
```

**Belirli Tabloları Yedekleme:**
```bash
pg_dump "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres" \
  --table=products \
  --table=campaigns \
  --file=supabase_tables_$(date +%Y%m%d_%H%M%S).sql \
  --verbose \
  --no-owner \
  --no-acl
```

### Adım 4: Backup'ı Geri Yükleme

```bash
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres" \
  < supabase_backup_20240101_120000.sql
```

---

## 3. Supabase CLI ile Yedekleme

### Adım 1: Supabase CLI Kurulumu

```bash
npm install -g supabase
```

veya

```bash
# Windows (Scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# macOS (Homebrew)
brew install supabase/tap/supabase

# Linux
curl -fsSL https://supabase.com/install.sh | sh
```

### Adım 2: Login

```bash
supabase login
```

### Adım 3: Database Backup

```bash
# Proje referansınızı alın (Dashboard → Settings → General → Reference ID)
supabase db dump --project-ref [PROJECT_REF] --output backup.sql
```

### Adım 4: Backup'ı Geri Yükleme

```bash
supabase db push --project-ref [PROJECT_REF] --file backup.sql
```

---

## 4. Otomatik Yedekleme Scripti

### Windows PowerShell Script

`scripts/backup-supabase.ps1` dosyası oluşturun:

```powershell
# Supabase Backup Script
param(
    [string]$ProjectRef = "isoydimyquabqfrezuuc",
    [string]$Password = "",
    [string]$BackupDir = "backups"
)

# Backup dizinini oluştur
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir
}

# Tarih formatı
$DateStamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupFile = "$BackupDir\supabase_backup_$DateStamp.sql"

# Connection string
$ConnectionString = "postgresql://postgres:$Password@db.$ProjectRef.supabase.co:5432/postgres"

# Backup al
Write-Host "Backup alınıyor: $BackupFile" -ForegroundColor Green
pg_dump $ConnectionString --file=$BackupFile --verbose --no-owner --no-acl

if ($LASTEXITCODE -eq 0) {
    Write-Host "Backup başarılı: $BackupFile" -ForegroundColor Green
    
    # Eski backup'ları temizle (30 günden eski)
    Get-ChildItem -Path $BackupDir -Filter "supabase_backup_*.sql" | 
        Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-30) } | 
        Remove-Item
    
    Write-Host "Eski backup'lar temizlendi" -ForegroundColor Yellow
} else {
    Write-Host "Backup başarısız!" -ForegroundColor Red
    exit 1
}
```

**Kullanım:**
```powershell
.\scripts\backup-supabase.ps1 -Password "YOUR_DB_PASSWORD"
```

### Bash Script (Linux/macOS)

`scripts/backup-supabase.sh` dosyası oluşturun:

```bash
#!/bin/bash

# Supabase Backup Script
PROJECT_REF="isoydimyquabqfrezuuc"
PASSWORD="${SUPABASE_DB_PASSWORD:-}"
BACKUP_DIR="backups"

# Backup dizinini oluştur
mkdir -p "$BACKUP_DIR"

# Tarih formatı
DATE_STAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/supabase_backup_$DATE_STAMP.sql"

# Connection string
CONNECTION_STRING="postgresql://postgres:$PASSWORD@db.$PROJECT_REF.supabase.co:5432/postgres"

# Backup al
echo "Backup alınıyor: $BACKUP_FILE"
pg_dump "$CONNECTION_STRING" \
  --file="$BACKUP_FILE" \
  --verbose \
  --no-owner \
  --no-acl

if [ $? -eq 0 ]; then
    echo "✅ Backup başarılı: $BACKUP_FILE"
    
    # Eski backup'ları temizle (30 günden eski)
    find "$BACKUP_DIR" -name "supabase_backup_*.sql" -mtime +30 -delete
    
    echo "🗑️  Eski backup'lar temizlendi"
else
    echo "❌ Backup başarısız!"
    exit 1
fi
```

**Kullanım:**
```bash
chmod +x scripts/backup-supabase.sh
export SUPABASE_DB_PASSWORD="YOUR_DB_PASSWORD"
./scripts/backup-supabase.sh
```

### Windows Task Scheduler ile Otomatik Yedekleme

1. **Task Scheduler**'ı açın
2. **Create Basic Task**
3. **Trigger:** Günlük (ör. her gün saat 02:00)
4. **Action:** Start a program
   - Program: `powershell.exe`
   - Arguments: `-File "C:\path\to\scripts\backup-supabase.ps1" -Password "YOUR_PASSWORD"`

---

## 5. Storage Bucket Yedekleme

Supabase Storage'daki dosyaları da yedeklemelisiniz:

### Supabase Dashboard'dan

1. **Storage** → Bucket'ınızı seçin
2. Dosyaları manuel olarak indirin

### Supabase JS Client ile

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Tüm dosyaları listele
const { data: files, error } = await supabase.storage
  .from('campaign-images')
  .list('', {
    limit: 100,
    offset: 0,
  });

// Her dosyayı indir
for (const file of files) {
  const { data, error } = await supabase.storage
    .from('campaign-images')
    .download(file.name);
  
  // Dosyayı kaydet
  // ...
}
```

---

## 6. Point-in-Time Recovery (PITR)

**Pro Plan** gerektirir:

1. **Settings** → **Database** → **Backups**
2. **Point-in-time recovery** aktif
3. Belirli bir zamana geri dönebilirsiniz

---

## 📝 Önerilen Yedekleme Stratejisi

### Günlük Yedekleme
- **Otomatik script** ile günlük backup
- **30 gün** saklama süresi
- **Cloud storage** (Google Drive, Dropbox) ile senkronizasyon

### Haftalık Yedekleme
- **Tam database backup** (schema + data)
- **Uzun süreli saklama** (3-6 ay)

### Önemli Değişikliklerden Önce
- **Manuel backup** alın
- **Test ortamında** geri yükleme testi yapın

---

## 🔒 Güvenlik Notları

1. **Database password'ü güvenli tutun**
   - Environment variable olarak saklayın
   - Script'lere hardcode etmeyin

2. **Backup dosyalarını şifreleyin**
   ```bash
   # Backup'ı şifrele
   gpg --symmetric --cipher-algo AES256 supabase_backup.sql
   ```

3. **Backup'ları güvenli yerde saklayın**
   - `.gitignore`'a ekleyin
   - Cloud storage'da şifreli saklayın

---

## 🚀 Hızlı Başlangıç

### İlk Backup'ı Alın

```bash
# 1. Database password'ünüzü alın
# Supabase Dashboard → Settings → Database → Connection string

# 2. pg_dump ile backup alın
pg_dump "postgresql://postgres:[PASSWORD]@db.isoydimyquabqfrezuuc.supabase.co:5432/postgres" \
  --file=backups/supabase_backup_initial.sql \
  --verbose \
  --no-owner \
  --no-acl

# 3. Backup'ı kontrol edin
head -n 50 backups/supabase_backup_initial.sql
```

---

## 📚 Ek Kaynaklar

- [Supabase Database Backups](https://supabase.com/docs/guides/platform/backups)
- [PostgreSQL pg_dump Documentation](https://www.postgresql.org/docs/current/app-pgdump.html)
- [Supabase CLI Documentation](https://supabase.com/docs/reference/cli)

---

## ❓ Sorun Giderme

### "pg_dump: error: connection to server failed"
- Database password'ün doğru olduğundan emin olun
- Firewall ayarlarını kontrol edin
- Connection string formatını kontrol edin

### "Permission denied"
- Backup dizini için yazma izni verin
- Windows'ta PowerShell'i "Run as Administrator" olarak çalıştırın

### "Backup file çok büyük"
- `--schema-only` ile sadece şemayı yedekleyin
- Belirli tabloları yedekleyin
- Compression kullanın: `pg_dump ... | gzip > backup.sql.gz`

