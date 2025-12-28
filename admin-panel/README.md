# SevApp Admin Panel

A modern web-based admin panel for managing products in the SevApp eCommerce application.

## Features

- 🔐 **Authentication**: Secure login with Supabase Auth
- 📦 **Product Management**: Create, read, update, and delete products
- 🖼️ **Image Upload**: Upload product images to Supabase Storage
- 📂 **Category Management**: Organize products by categories
- 🎨 **Modern UI**: Built with React, TypeScript, and Tailwind CSS

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Set up Supabase Storage:**
   - Go to Supabase Dashboard → Storage
   - Create a new bucket named `product-images`
   - Set it to public (or configure RLS policies)

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

## Admin Access

To create an admin user:
1. Sign up through the mobile app or Supabase Dashboard
2. Manually set user role in Supabase (if implementing role-based access)

## Project Structure

```
admin-panel/
├── src/
│   ├── components/     # Reusable components
│   ├── config/        # Configuration files
│   ├── context/       # React contexts
│   ├── pages/         # Page components
│   └── App.tsx        # Main app component
├── public/            # Static assets
└── package.json       # Dependencies
```

## Technologies

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Supabase** - Backend (Auth, Database, Storage)
- **React Router** - Navigation
