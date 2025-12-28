# Backup Scripts

Bu dizinde Supabase database yedekleme scriptleri bulunur.

## 📋 Scriptler

### Windows PowerShell: `backup-supabase.ps1`

```powershell
# Temel kullanım
.\scripts\backup-supabase.ps1 -Password "YOUR_DB_PASSWORD"

# Sadece schema (tablo yapıları)
.\scripts\backup-supabase.ps1 -Password "YOUR_DB_PASSWORD" -SchemaOnly

# Sadece data (veriler)
.\scripts\backup-supabase.ps1 -Password "YOUR_DB_PASSWORD" -DataOnly

# Özel backup dizini
.\scripts\backup-supabase.ps1 -Password "YOUR_DB_PASSWORD" -BackupDir "my-backups"

# Retention süresini değiştir (varsayılan: 30 gün)
.\scripts\backup-supabase.ps1 -Password "YOUR_DB_PASSWORD" -RetentionDays 60
```

### Linux/macOS: `backup-supabase.sh`

```bash
# İlk kullanımda çalıştırılabilir yapın
chmod +x scripts/backup-supabase.sh

# Temel kullanım
export SUPABASE_DB_PASSWORD="YOUR_DB_PASSWORD"
./scripts/backup-supabase.sh

# Veya inline
SUPABASE_DB_PASSWORD="YOUR_DB_PASSWORD" ./scripts/backup-supabase.sh
```

## 🔑 Database Password Nasıl Alınır?

1. Supabase Dashboard → https://app.supabase.com
2. Projenizi seçin
3. **Settings** → **Database**
4. **Connection string** → **URI** formatını kopyalayın
5. Password'ü connection string'den çıkarın:
   ```
   postgresql://postgres:[PASSWORD]@db.xxx.supabase.co:5432/postgres
                              ^^^^^^^^
                              Bu kısım password
   ```

## 📁 Backup Dosyaları Nerede?

Backup'lar varsayılan olarak `backups/` dizininde saklanır:
- Format: `supabase_backup_full_YYYYMMDD_HHMMSS.sql`
- Örnek: `supabase_backup_full_20240115_143022.sql`

## ⚙️ Otomatik Yedekleme

### Windows Task Scheduler

1. **Task Scheduler**'ı açın
2. **Create Basic Task**
3. **Name:** Supabase Daily Backup
4. **Trigger:** Daily, 02:00 AM
5. **Action:** Start a program
   - Program: `powershell.exe`
   - Arguments: `-File "C:\path\to\scripts\backup-supabase.ps1" -Password "YOUR_PASSWORD"`
   - Start in: `C:\path\to\SevApp`

### Linux/macOS Cron

```bash
# Crontab'ı düzenle
crontab -e

# Her gün saat 02:00'de backup al
0 2 * * * cd /path/to/SevApp && SUPABASE_DB_PASSWORD="YOUR_PASSWORD" ./scripts/backup-supabase.sh >> /var/log/supabase-backup.log 2>&1
```

## 🔒 Güvenlik

⚠️ **ÖNEMLİ:** Database password'ü script'lere hardcode etmeyin!

**Güvenli Yöntemler:**

1. **Environment Variable (Önerilen)**
   ```bash
   # Linux/macOS
   export SUPABASE_DB_PASSWORD="your_password"
   
   # Windows PowerShell
   $env:SUPABASE_DB_PASSWORD = "your_password"
   ```

2. **Windows Credential Manager**
   ```powershell
   # Password'ü kaydet
   cmdkey /generic:supabase-db /user:postgres /pass:"your_password"
   
   # Script'te kullan (script'i güncelleyin)
   $cred = cmdkey /list:supabase-db
   ```

3. **Secret Management Tools**
   - Windows: PowerShell SecretManagement
   - macOS: Keychain
   - Linux: pass, gopass

## 📊 Backup'ı Geri Yükleme

```bash
# PostgreSQL ile
psql "postgresql://postgres:PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres" \
  < backups/supabase_backup_full_20240115_143022.sql

# Supabase CLI ile
supabase db push --project-ref PROJECT_REF --file backups/backup.sql
```

## 🧹 Eski Backup'ları Temizleme

Script otomatik olarak 30 günden eski backup'ları siler. Manuel temizleme:

```powershell
# Windows
Get-ChildItem backups\*.sql | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-30) } | Remove-Item
```

```bash
# Linux/macOS
find backups -name "*.sql" -mtime +30 -delete
```

## ❓ Sorun Giderme

### "pg_dump: command not found"
- PostgreSQL client tools'u yükleyin
- Windows: https://www.postgresql.org/download/windows/
- macOS: `brew install postgresql`
- Linux: `sudo apt-get install postgresql-client`

### "Connection refused" veya "Timeout"
- Internet bağlantınızı kontrol edin
- Firewall ayarlarını kontrol edin
- Supabase dashboard'da database'in aktif olduğundan emin olun

### "Authentication failed"
- Database password'ün doğru olduğundan emin olun
- Connection string formatını kontrol edin
- Supabase dashboard'dan yeni password oluşturun (Settings → Database → Reset database password)

## 📚 Daha Fazla Bilgi

Detaylı bilgi için: [SUPABASE_BACKUP_GUIDE.md](../SUPABASE_BACKUP_GUIDE.md)

