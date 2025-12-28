# Admin Panel Setup Guide

## Quick Start

1. **Navigate to admin panel:**
   ```bash
   cd admin-panel
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create `.env` file:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

4. **Set up Supabase Storage:**
   - Go to Supabase Dashboard → Storage
   - Run the SQL in `supabase-storage-setup.sql` OR
   - Manually create bucket named `product-images` and set it to public

5. **Start development server:**
   ```bash
   npm run dev
   ```

6. **Access the admin panel:**
   Open http://localhost:5173 in your browser

## Features

✅ **Product Management**
- View all products in a table
- Add new products with image upload
- Edit existing products
- Delete products
- Image preview and upload to Supabase Storage

✅ **Authentication**
- Secure login with Supabase Auth
- Protected routes
- Session management

✅ **Modern UI**
- Responsive design with Tailwind CSS
- Clean and intuitive interface
- Loading states and error handling

## Next Steps

- [ ] Add category management page
- [ ] Add product variants management (sizes, colors, stock)
- [ ] Add bulk operations
- [ ] Add search and filtering
- [ ] Add order management
- [ ] Add analytics dashboard

## Troubleshooting

**Image upload not working?**
- Make sure `product-images` bucket exists in Supabase Storage
- Check that bucket is set to public or RLS policies allow uploads
- Verify Supabase Storage is enabled in your project

**Can't login?**
- Make sure you have a user account in Supabase Auth
- Check that `.env` file has correct Supabase credentials
- Verify RLS policies allow authenticated users to access products table

**Build errors?**
- Run `npm install` to ensure all dependencies are installed
- Check that TypeScript types are correct
- Verify all environment variables are set



