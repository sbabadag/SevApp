# Supabase Storage Setup Guide

## Hata: "Failed to upload image"

Bu hatayı alıyorsanız, Supabase Storage bucket'ı düzgün yapılandırılmamış olabilir.

## Hızlı Çözüm

### Adım 1: Supabase Dashboard'a gidin
1. https://supabase.com/dashboard
2. Projenizi seçin

### Adım 2: Storage Bucket Oluşturun
1. Sol menüden **Storage** seçin
2. **"New bucket"** butonuna tıklayın
3. Bilgileri girin:
   - **Name:** `product-images`
   - **Public bucket:** ✅ **İşaretleyin** (ÖNEMLİ!)
4. **"Create bucket"** butonuna tıklayın

### Adım 3: RLS Policies Ayarlayın (Opsiyonel - SQL ile)

Supabase SQL Editor'de şu komutu çalıştırın:

```sql
-- Public read access
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT
USING (bucket_id = 'product-images');

-- Authenticated users can upload
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- Authenticated users can update
CREATE POLICY "Authenticated users can update" ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);

-- Authenticated users can delete
CREATE POLICY "Authenticated users can delete" ON storage.objects
FOR DELETE
USING (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
);
```

**VEYA** daha basit: `supabase-storage-setup.sql` dosyasındaki SQL'i çalıştırın.

### Adım 4: Test Edin
1. Admin panelde yeni bir ürün eklemeyi deneyin
2. Resim yükleme artık çalışmalı!

## Alternatif: Manuel URL ile Resim Ekleme

Eğer Storage kurulumu yapmak istemiyorsanız, resim URL'sini manuel olarak girebilirsiniz:

1. Ürün formunda "Product Image" alanında
2. Resmi başka bir yere yükleyin (ör: Imgur, Cloudinary)
3. URL'yi doğrudan "image_url" alanına yapıştırın

## Sorun Giderme

**"Bucket not found" hatası:**
- Bucket adının tam olarak `product-images` olduğundan emin olun
- Bucket'ın oluşturulduğunu kontrol edin

**"Permission denied" hatası:**
- Bucket'ın "Public" olarak işaretlendiğinden emin olun
- RLS policies'in doğru yapılandırıldığından emin olun

**"Upload failed" hatası:**
- Dosya boyutunu kontrol edin (max 50MB genellikle)
- Dosya formatını kontrol edin (jpg, png, webp desteklenir)
- Tarayıcı konsolundaki hata mesajlarını kontrol edin



