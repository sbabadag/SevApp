# PostgreSQL Client Tools Installer for Windows
# This script downloads and installs PostgreSQL client tools

Write-Host ""
Write-Host "PostgreSQL Client Tools yukleniyor..." -ForegroundColor Cyan
Write-Host ""

# Check if already installed
$pgDumpPath = Get-Command pg_dump -ErrorAction SilentlyContinue
if ($pgDumpPath) {
    Write-Host "✅ PostgreSQL client tools zaten yuklu!" -ForegroundColor Green
    Write-Host "   Konum: $($pgDumpPath.Source)" -ForegroundColor Gray
    exit 0
}

Write-Host "PostgreSQL client tools yuklu degil." -ForegroundColor Yellow
Write-Host "Yukleme secenekleri:" -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Manuel Yukleme (Onerilen):" -ForegroundColor Yellow
Write-Host "   a) https://www.postgresql.org/download/windows/ adresine gidin" -ForegroundColor White
Write-Host "   b) Download the installer butonuna tiklayin" -ForegroundColor White
Write-Host "   c) Command Line Tools secenegini secin" -ForegroundColor White
Write-Host "   d) Kurulum sonrasi PATH'e ekleyin" -ForegroundColor White
Write-Host ""

Write-Host "2. Chocolatey ile (Eger yuklu ise):" -ForegroundColor Yellow
Write-Host "   choco install postgresql --params '/Password:postgres'" -ForegroundColor White
Write-Host ""

Write-Host "3. Scoop ile (Eger yuklu ise):" -ForegroundColor Yellow
Write-Host "   scoop install postgresql" -ForegroundColor White
Write-Host ""

Write-Host "Yukleme sonrasi PowerShell'i yeniden baslatin ve tekrar deneyin." -ForegroundColor Green
Write-Host ""

