# Supabase Backup Script for Windows PowerShell
# Usage: .\scripts\backup-supabase.ps1 -Password "YOUR_DB_PASSWORD"

param(
    [Parameter(Mandatory=$false)]
    [string]$ProjectRef = "isoydimyquabqfrezuuc",
    
    [Parameter(Mandatory=$true)]
    [string]$Password,
    
    [Parameter(Mandatory=$false)]
    [string]$BackupDir = "backups",
    
    [Parameter(Mandatory=$false)]
    [switch]$SchemaOnly = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$DataOnly = $false,
    
    [Parameter(Mandatory=$false)]
    [int]$RetentionDays = 30
)

# Backup dizinini oluştur
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir | Out-Null
    Write-Host "Backup dizini oluşturuldu: $BackupDir" -ForegroundColor Green
}

# Tarih formatı
$DateStamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupType = if ($SchemaOnly) { "schema" } elseif ($DataOnly) { "data" } else { "full" }
$BackupFile = "$BackupDir\supabase_backup_${BackupType}_$DateStamp.sql"

# Connection string
$ConnectionString = "postgresql://postgres:$Password@db.$ProjectRef.supabase.co:5432/postgres"

# pg_dump parametreleri
$DumpParams = @(
    $ConnectionString,
    "--file=$BackupFile",
    "--verbose",
    "--no-owner",
    "--no-acl"
)

if ($SchemaOnly) {
    $DumpParams += "--schema-only"
    Write-Host "Sadece schema yedekleniyor..." -ForegroundColor Yellow
} elseif ($DataOnly) {
    $DumpParams += "--data-only"
    Write-Host "Sadece data yedekleniyor..." -ForegroundColor Yellow
} else {
    Write-Host "Tam backup alınıyor (schema + data)..." -ForegroundColor Yellow
}

# Backup al
Write-Host "`nBackup alınıyor: $BackupFile" -ForegroundColor Cyan
Write-Host "Connection: db.$ProjectRef.supabase.co" -ForegroundColor Gray

$ErrorActionPreference = "Stop"
try {
    & pg_dump $DumpParams
    
    if ($LASTEXITCODE -eq 0) {
        $FileSize = (Get-Item $BackupFile).Length / 1MB
        Write-Host "`n✅ Backup başarılı!" -ForegroundColor Green
        Write-Host "   Dosya: $BackupFile" -ForegroundColor White
        Write-Host "   Boyut: $([math]::Round($FileSize, 2)) MB" -ForegroundColor White
        
        # Eski backup'ları temizle
        $OldBackups = Get-ChildItem -Path $BackupDir -Filter "supabase_backup_*.sql" | 
            Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays(-$RetentionDays) }
        
        if ($OldBackups.Count -gt 0) {
            Write-Host "`n🗑️  Eski backup'lar temizleniyor ($RetentionDays günden eski)..." -ForegroundColor Yellow
            $OldBackups | Remove-Item -Verbose
            Write-Host "   $($OldBackups.Count) dosya silindi" -ForegroundColor White
        } else {
            Write-Host "`n📦 Eski backup yok" -ForegroundColor Gray
        }
        
        Write-Host "`n✨ Tamamlandı!" -ForegroundColor Green
    } else {
        throw "pg_dump failed with exit code $LASTEXITCODE"
    }
} catch {
    Write-Host "`n❌ Backup başarısız!" -ForegroundColor Red
    Write-Host "   Hata: $_" -ForegroundColor Red
    Write-Host "`n💡 İpuçları:" -ForegroundColor Yellow
    Write-Host "   - pg_dump yüklü mü? (pg_dump --version)" -ForegroundColor White
    Write-Host "   - Database password doğru mu?" -ForegroundColor White
    Write-Host "   - Internet bağlantısı var mı?" -ForegroundColor White
    exit 1
}

