# GitHub Pages Deployment - Admin Panel in Subdirectory

## Durum

Admin panel `admin-panel/` klasöründe, ama GitHub Pages'te root'ta deploy edilecek.

## Yapılandırma

### 1. Vite Config (`admin-panel/vite.config.ts`)

Base path repository adınıza göre ayarlanmış:
```typescript
base: process.env.NODE_ENV === 'production' ? '/SevApp/' : '/',
```

**Önemli**: Repository adınız `SevApp` değilse, bu satırı güncelleyin:
```typescript
base: process.env.NODE_ENV === 'production' ? '/YOUR_REPO_NAME/' : '/',
```

### 2. GitHub Actions Workflow

Workflow zaten doğru yapılandırılmış:
- `admin-panel/` klasöründe build yapıyor
- `admin-panel/dist` klasörünü GitHub Pages'e deploy ediyor
- Root'ta deploy edilecek (subdirectory değil)

### 3. Router Base Path

`App.tsx` içinde `getBasePath()` fonksiyonu otomatik olarak:
- GitHub Pages'te repo adını algılıyor
- BrowserRouter'a doğru base path'i veriyor

## Deployment Adımları

### 1. GitHub Repository Ayarları

1. GitHub'da repository'nize gidin
2. **Settings** → **Pages**
3. **Source**: `GitHub Actions` seçin
4. Save

### 2. GitHub Secrets

1. **Settings** → **Secrets and variables** → **Actions**
2. Şu secret'ları ekleyin:
   - `VITE_SUPABASE_URL`: `https://isoydimyquabqfrezuuc.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: Supabase anon key'iniz

### 3. Repository Adını Kontrol Edin

Eğer repository adınız `SevApp` değilse:

**`admin-panel/vite.config.ts`** dosyasında güncelleyin:
```typescript
base: process.env.NODE_ENV === 'production' ? '/YOUR_REPO_NAME/' : '/',
```

### 4. Deploy

```bash
git add .
git commit -m "Deploy admin panel to GitHub Pages"
git push origin main
```

## Erişim URL'i

Deployment sonrası admin panel şu adreste olacak:

```
https://YOUR_USERNAME.github.io/SevApp/
```

**Not**: 
- Admin panel root'ta deploy edilecek (subdirectory değil)
- Build `admin-panel/` klasöründen yapılacak
- Deploy edilen dosyalar root'ta olacak

## Yapı

```
Repository Root/
├── .github/
│   └── workflows/
│       └── deploy-admin-panel.yml  # Build admin-panel, deploy to root
├── admin-panel/
│   ├── src/
│   ├── dist/                       # Build output (gitignored)
│   └── vite.config.ts              # Base path: /SevApp/
└── ... (diğer dosyalar)
```

## Troubleshooting

### 404 Errors

- `vite.config.ts`'deki base path'in repository adınızla eşleştiğinden emin olun
- GitHub Pages'te repository adı URL'de görünüyor mu kontrol edin

### Assets Not Loading

- Base path doğru ayarlanmış mı kontrol edin
- Browser console'da 404 hataları var mı bakın

### Routes Not Working

- `getBasePath()` fonksiyonunun doğru çalıştığını kontrol edin
- BrowserRouter'a base path verildiğinden emin olun

