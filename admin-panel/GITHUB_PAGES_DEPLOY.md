# GitHub Pages Deployment Guide

## Overview

This guide explains how to deploy the admin panel to GitHub Pages.

## Prerequisites

1. GitHub repository (e.g., `SevApp`)
2. GitHub Pages enabled in repository settings
3. Environment variables set as GitHub Secrets

## Setup Steps

### 1. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select:
   - **Source**: `GitHub Actions`
4. Save

### 2. Set GitHub Secrets

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add the following secrets:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key

### 3. Configure Base Path

The `vite.config.ts` is already configured with:
```typescript
base: process.env.NODE_ENV === 'production' ? '/SevApp/' : '/',
```

**Important**: If your repository name is different from `SevApp`, update the base path in:
- `admin-panel/vite.config.ts` (line 5)
- `admin-panel/src/App.tsx` (in `getBasePath()` function)

### 4. Deploy

#### Automatic Deployment (Recommended)

The GitHub Actions workflow (`.github/workflows/deploy-admin-panel.yml`) will automatically deploy when:
- You push to the `main` branch
- Files in `admin-panel/` directory change
- You manually trigger the workflow

**To deploy:**
```bash
git add .
git commit -m "Deploy admin panel"
git push origin main
```

#### Manual Deployment

If you prefer manual deployment:

1. Build the project:
   ```bash
   cd admin-panel
   npm install
   npm run build
   ```

2. Deploy `dist` folder to GitHub Pages:
   - Use GitHub Desktop
   - Or use `gh-pages` package:
     ```bash
     npm install -g gh-pages
     gh-pages -d dist
     ```

## Access Your Admin Panel

After deployment, your admin panel will be available at:

```
https://YOUR_USERNAME.github.io/SevApp/
```

Replace `YOUR_USERNAME` with your GitHub username.

## Troubleshooting

### 404 Errors on Routes

If you get 404 errors when navigating:
- Make sure `base` path in `vite.config.ts` matches your repository name
- Check that `getBasePath()` in `App.tsx` correctly extracts the repo name

### Environment Variables Not Working

- Make sure secrets are set in GitHub repository settings
- Check that secrets are named exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Re-run the workflow after adding secrets

### Build Fails

- Check GitHub Actions logs
- Ensure `package-lock.json` is committed
- Verify Node.js version (should be 20)

## Custom Domain (Optional)

To use a custom domain:

1. Add `CNAME` file in `admin-panel/public/`:
   ```
   admin.yourdomain.com
   ```

2. Configure DNS:
   - Add CNAME record pointing to `YOUR_USERNAME.github.io`

3. Update GitHub Pages settings:
   - Settings → Pages → Custom domain

## File Structure

```
.github/
  workflows/
    deploy-admin-panel.yml    # GitHub Actions workflow
admin-panel/
  dist/                       # Build output (gitignored)
  src/
  vite.config.ts              # Vite config with base path
  package.json
```

## Notes

- The workflow only runs when `admin-panel/` files change
- Build artifacts are automatically uploaded to GitHub Pages
- Each deployment creates a new commit in the `gh-pages` branch (managed by GitHub)

