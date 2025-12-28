import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // For GitHub Pages: if repo is "SevApp", base will be "/SevApp/"
  // Change "SevApp" to your actual repository name
  base: process.env.NODE_ENV === 'production' ? '/SevApp/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
})
