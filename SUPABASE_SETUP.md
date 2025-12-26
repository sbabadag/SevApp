# Supabase Integration Setup Guide

This guide will help you set up Supabase for your eCommerce app with real data.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. A Supabase project created

## Step 1: Create Supabase Project

1. Go to https://app.supabase.com
2. Click "New Project"
3. Fill in your project details:
   - Name: Your project name
   - Database Password: Choose a strong password
   - Region: Choose the closest region
4. Wait for the project to be created (takes a few minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (under Project URL)
   - **anon/public key** (under Project API keys)

## Step 3: Set Up Environment Variables

### Option 1: Using .env file (Recommended for development)

1. Create a `.env` file in the root of your project:
```bash
EXPO_PUBLIC_SUPABASE_URL=your_project_url_here
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

2. Install dotenv if needed:
```bash
npm install dotenv
```

### Option 2: Using app.json (Current setup)

The app is configured to read from `app.json` extra section. You can set environment variables there, but for security, use `.env` file and add it to `.gitignore`.

## Step 4: Create Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the entire contents of `supabase-schema.sql`
4. Click **Run** to execute the SQL
5. Verify that all tables are created by going to **Table Editor**

## Step 5: Insert Sample Data (Optional)

You can insert sample data to test the app:

```sql
-- Insert Categories
INSERT INTO categories (name, icon) VALUES
  ('All', 'grid-outline'),
  ('Men', 'shirt-outline'),
  ('Women', 'woman-outline'),
  ('Kids', 'happy-outline'),
  ('Shoes', 'walk-outline'),
  ('Accessories', 'bag-outline');

-- Insert Sample Products
INSERT INTO products (name, description, price, original_price, image_url, category_id, discount_percentage, rating, review_count) VALUES
  ('Classic White Shirt', 'A classic white shirt perfect for any occasion', 29.99, 39.99, 'https://via.placeholder.com/300', 2, 25, 4.5, 120),
  ('Denim Jacket', 'Stylish denim jacket with modern fit', 59.99, 79.99, 'https://via.placeholder.com/300', 2, 25, 4.8, 89),
  ('Summer Dress', 'Beautiful summer dress with floral pattern', 49.99, NULL, 'https://via.placeholder.com/300', 3, NULL, 4.3, 156),
  ('Sneakers', 'Comfortable sneakers for everyday wear', 89.99, 119.99, 'https://via.placeholder.com/300', 5, 25, 4.7, 234);

-- Insert Product Images
INSERT INTO product_images (product_id, image_url, display_order) VALUES
  (1, 'https://via.placeholder.com/400', 0),
  (1, 'https://via.placeholder.com/400', 1),
  (2, 'https://via.placeholder.com/400', 0);

-- Insert Product Variants (Sizes and Colors)
INSERT INTO product_variants (product_id, size, color, stock_quantity) VALUES
  (1, 'S', '#FFFFFF', 10),
  (1, 'M', '#FFFFFF', 15),
  (1, 'L', '#FFFFFF', 8),
  (1, 'XL', '#FFFFFF', 5),
  (1, 'M', '#000000', 12),
  (2, 'M', '#000000', 10),
  (2, 'L', '#000000', 8);
```

## Step 6: Configure Authentication

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Configure your authentication providers (Email, Google, etc.)
3. Set up email templates if needed
4. Configure redirect URLs for your app

## Step 7: Test the Integration

1. Start your app:
```bash
npm start
```

2. The app will now use Supabase for:
   - User authentication (sign up, sign in, sign out)
   - Product data
   - Categories
   - Shopping cart
   - Wishlist
   - Orders
   - Reviews

## Services Available

The app includes the following services in `src/services/`:

- **authService.ts** - User authentication
- **productService.ts** - Product operations
- **categoryService.ts** - Category operations
- **cartService.ts** - Shopping cart operations
- **wishlistService.ts** - Wishlist operations
- **orderService.ts** - Order operations

## Usage Example

```typescript
import { productService } from '../services/productService';
import { authService } from '../services/authService';

// Get products
const { data: products, error } = await productService.getProducts();

// Sign in user
const { user, session, error } = await authService.signIn({
  email: 'user@example.com',
  password: 'password123'
});
```

## Security Notes

1. **Never commit `.env` file** - Add it to `.gitignore`
2. **Use Row Level Security (RLS)** - Already configured in the schema
3. **Use environment variables** - Don't hardcode credentials
4. **The anon key is safe for client-side use** - RLS policies protect your data

## Troubleshooting

### Connection Issues
- Verify your Supabase URL and anon key are correct
- Check that your Supabase project is active
- Ensure you're using the correct environment variables

### Authentication Issues
- Check that email authentication is enabled in Supabase
- Verify redirect URLs are configured correctly
- Check Supabase logs for errors

### Data Not Loading
- Verify tables exist in your database
- Check RLS policies are set up correctly
- Review Supabase logs for query errors

## Next Steps

1. Update screens to use real data from services
2. Add error handling and loading states
3. Implement real-time subscriptions if needed
4. Add image upload functionality for products
5. Set up payment integration

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)

