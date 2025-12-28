#!/bin/bash

# Supabase Backup Script for Linux/macOS
# Usage: ./scripts/backup-supabase.sh

set -e  # Exit on error

# Configuration
PROJECT_REF="${SUPABASE_PROJECT_REF:-isoydimyquabqfrezuuc}"
PASSWORD="${SUPABASE_DB_PASSWORD:-}"
BACKUP_DIR="${SUPABASE_BACKUP_DIR:-backups}"
RETENTION_DAYS="${SUPABASE_RETENTION_DAYS:-30}"

# Check if password is provided
if [ -z "$PASSWORD" ]; then
    echo "❌ Error: SUPABASE_DB_PASSWORD environment variable is not set"
    echo ""
    echo "Usage:"
    echo "  export SUPABASE_DB_PASSWORD='your_password'"
    echo "  ./scripts/backup-supabase.sh"
    echo ""
    echo "Or set it inline:"
    echo "  SUPABASE_DB_PASSWORD='your_password' ./scripts/backup-supabase.sh"
    exit 1
fi

# Check if pg_dump is installed
if ! command -v pg_dump &> /dev/null; then
    echo "❌ Error: pg_dump is not installed"
    echo ""
    echo "Install it with:"
    echo "  macOS: brew install postgresql"
    echo "  Ubuntu/Debian: sudo apt-get install postgresql-client"
    echo "  Fedora: sudo dnf install postgresql"
    exit 1
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Date stamp
DATE_STAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/supabase_backup_full_$DATE_STAMP.sql"

# Connection string
CONNECTION_STRING="postgresql://postgres:$PASSWORD@db.$PROJECT_REF.supabase.co:5432/postgres"

# Backup
echo ""
echo "🔄 Backup alınıyor..." | tee -a /dev/stderr
echo "   Connection: db.$PROJECT_REF.supabase.co" | tee -a /dev/stderr
echo "   Dosya: $BACKUP_FILE" | tee -a /dev/stderr
echo ""

pg_dump "$CONNECTION_STRING" \
  --file="$BACKUP_FILE" \
  --verbose \
  --no-owner \
  --no-acl

if [ $? -eq 0 ]; then
    FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo ""
    echo "✅ Backup başarılı!" | tee -a /dev/stderr
    echo "   Dosya: $BACKUP_FILE" | tee -a /dev/stderr
    echo "   Boyut: $FILE_SIZE" | tee -a /dev/stderr
    
    # Clean old backups
    OLD_BACKUPS=$(find "$BACKUP_DIR" -name "supabase_backup_*.sql" -mtime +$RETENTION_DAYS)
    
    if [ -n "$OLD_BACKUPS" ]; then
        echo ""
        echo "🗑️  Eski backup'lar temizleniyor ($RETENTION_DAYS günden eski)..." | tee -a /dev/stderr
        OLD_COUNT=$(echo "$OLD_BACKUPS" | wc -l | tr -d ' ')
        echo "$OLD_BACKUPS" | xargs rm -v
        echo "   $OLD_COUNT dosya silindi" | tee -a /dev/stderr
    else
        echo ""
        echo "📦 Eski backup yok" | tee -a /dev/stderr
    fi
    
    echo ""
    echo "✨ Tamamlandı!" | tee -a /dev/stderr
else
    echo ""
    echo "❌ Backup başarısız!" | tee -a /dev/stderr
    exit 1
fi

