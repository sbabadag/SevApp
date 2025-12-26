# Populate Supabase with Real Product Data

This guide will help you populate your Supabase database with real product data from the Fake Store API.

## Prerequisites

1. Supabase project set up with the schema from `supabase-schema.sql`
2. `.env` file with your Supabase credentials

## Setup

1. **Create a `.env` file** in the root directory (if you don't have one):
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

2. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

## Running the Script

Simply run:
```bash
npm run populate
```

Or directly:
```bash
node scripts/populateProducts.js
```

## What the Script Does

1. **Fetches Products**: Gets real product data from [Fake Store API](https://fakestoreapi.com/)
   - 20+ real products with images, prices, descriptions, and ratings
   - Categories: Men's clothing, Women's clothing, Electronics, Jewelry

2. **Creates Categories**: Automatically creates categories if they don't exist:
   - All
   - Men
   - Women
   - Kids
   - Shoes
   - Accessories
   - Electronics (if needed)

3. **Maps Products**: Maps API products to your category structure:
   - Men's clothing → Men category
   - Women's clothing → Women category
   - Jewelry → Accessories category
   - Electronics → Electronics category (or creates new)

4. **Inserts Data**: 
   - Products with prices, descriptions, ratings
   - Product images
   - Calculates discounts and original prices
   - Sets stock quantities

## Sample Output

```
Fetching products from Fake Store API...
Fetched 20 products
Created category: All
Created category: Men
Created category: Women
Created category: Kids
Created category: Shoes
Created category: Accessories
✓ Inserted: Fjallraven - Foldsack No. 1 Backpack...
✓ Inserted: Mens Casual Premium Slim Fit T-Shirts...
✓ Inserted: White Gold Plated Princess...
...

=== Population Complete ===
Successfully inserted: 20 products
Errors: 0 products

Database populated successfully!
```

## Data Source

The script uses the [Fake Store API](https://fakestoreapi.com/), which provides:
- Real product names and descriptions
- High-quality product images
- Realistic prices
- Ratings and review counts
- Multiple categories

## Customization

You can modify `scripts/populateProducts.js` to:
- Use a different API
- Add more product variants (sizes, colors)
- Customize pricing logic
- Add more product images
- Filter specific categories

## Troubleshooting

### Error: "EXPO_PUBLIC_SUPABASE_URL is not set"
- Make sure your `.env` file exists and has the correct values
- Check that the file is in the root directory

### Error: "relation does not exist"
- Make sure you've run the `supabase-schema.sql` script in your Supabase SQL Editor first

### Error: "permission denied"
- Check your Supabase RLS (Row Level Security) policies
- Make sure the anon key has insert permissions

### Products not showing in app
- Clear the app cache and reload
- Check that the products were inserted correctly in Supabase dashboard
- Verify your app is using the correct Supabase credentials

## Next Steps

After populating:
1. Check your Supabase dashboard → Table Editor → products
2. Verify products are showing in your app
3. Test product details, cart, and wishlist features
4. Add more products manually or run the script again

## Notes

- The script will not duplicate products if run multiple times (it will create new entries each time)
- To clear existing data, delete products manually in Supabase dashboard or use SQL
- Product images are hosted by Fake Store API and may take time to load
- You can modify the script to use your own image URLs or upload images to Supabase Storage


