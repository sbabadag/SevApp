/**
 * Script to populate Supabase with real product data from Fake Store API
 * 
 * Usage:
 * 1. Set your Supabase credentials in .env file:
 *    EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
 *    EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
 * 
 * 2. Run: node scripts/populateProducts.js
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Error: EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY must be set in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Map Fake Store API categories to our categories
const categoryMapping = {
  "men's clothing": { name: "Men", icon: "shirt-outline" },
  "women's clothing": { name: "Women", icon: "woman-outline" },
  "electronics": { name: "Electronics", icon: "phone-portrait-outline" },
  "jewelery": { name: "Accessories", icon: "briefcase-outline" },
};

// Default category for unmapped items
const defaultCategory = { name: "All", icon: "grid-outline" };

async function fetchProductsFromAPI() {
  try {
    console.log('Fetching products from Fake Store API...');
    const response = await fetch('https://fakestoreapi.com/products');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const products = await response.json();
    console.log(`Fetched ${products.length} products`);
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

async function getOrCreateCategory(categoryName, icon) {
  // Check if category exists
  const { data: existing } = await supabase
    .from('categories')
    .select('id')
    .eq('name', categoryName)
    .single();

  if (existing) {
    return existing.id;
  }

  // Create new category
  const { data, error } = await supabase
    .from('categories')
    .insert({ name: categoryName, icon })
    .select('id')
    .single();

  if (error) {
    console.error(`Error creating category ${categoryName}:`, error);
    throw error;
  }

  console.log(`Created category: ${categoryName}`);
  return data.id;
}

async function insertProduct(productData, categoryId) {
  const discountPercentage = Math.floor(Math.random() * 30) + 10; // Random discount 10-40%
  const originalPrice = productData.price * (1 + discountPercentage / 100);
  
  const { data, error } = await supabase
    .from('products')
    .insert({
      name: productData.title || productData.name,
      description: productData.description || productData.title || 'No description available',
      price: parseFloat(productData.price),
      original_price: parseFloat(originalPrice.toFixed(2)),
      image_url: productData.image,
      category_id: categoryId,
      discount_percentage: discountPercentage,
      rating: productData.rating?.rate ? parseFloat(productData.rating.rate.toFixed(1)) : 4.0,
      review_count: productData.rating?.count || Math.floor(Math.random() * 200) + 10,
      in_stock: true,
    })
    .select('id')
    .single();

  if (error) {
    console.error(`Error inserting product ${productData.title || productData.name}:`, error);
    throw error;
  }

  return data.id;
}

async function insertProductImages(productId, imageUrl) {
  // Insert main image
  const { error } = await supabase
    .from('product_images')
    .insert({
      product_id: productId,
      image_url: imageUrl,
      display_order: 0,
    });

  if (error) {
    console.error(`Error inserting image for product ${productId}:`, error);
    // Don't throw - continue with other products
  }
}

async function populateDatabase() {
  try {
    console.log('Starting database population...\n');

    // Fetch products from API
    const apiProducts = await fetchProductsFromAPI();

    // First, ensure default categories exist
    const allCategoryId = await getOrCreateCategory('All', 'grid-outline');
    const menCategoryId = await getOrCreateCategory('Men', 'shirt-outline');
    const womenCategoryId = await getOrCreateCategory('Women', 'woman-outline');
    const kidsCategoryId = await getOrCreateCategory('Kids', 'happy-outline');
    const shoesCategoryId = await getOrCreateCategory('Shoes', 'walk-outline');
    const accessoriesCategoryId = await getOrCreateCategory('Accessories', 'briefcase-outline');

    // Process each product
    let successCount = 0;
    let errorCount = 0;

    for (const apiProduct of apiProducts) {
      try {
        // Map category
        const categoryInfo = categoryMapping[apiProduct.category] || defaultCategory;
        let categoryId;

        // For clothing, map to Men or Women based on category
        if (apiProduct.category === "men's clothing") {
          categoryId = menCategoryId;
        } else if (apiProduct.category === "women's clothing") {
          categoryId = womenCategoryId;
        } else if (apiProduct.category === "jewelery") {
          categoryId = accessoriesCategoryId;
        } else {
          // For electronics and others, use a default or create a new category
          categoryId = await getOrCreateCategory(
            categoryInfo.name,
            categoryInfo.icon
          );
        }

        // Insert product
        const productId = await insertProduct(apiProduct, categoryId);

        // Insert product image
        await insertProductImages(productId, apiProduct.image);

        successCount++;
        console.log(`✓ Inserted: ${apiProduct.title.substring(0, 50)}...`);
      } catch (error) {
        errorCount++;
        console.error(`✗ Failed to insert product: ${apiProduct.title}`, error.message);
      }
    }

    console.log('\n=== Population Complete ===');
    console.log(`Successfully inserted: ${successCount} products`);
    console.log(`Errors: ${errorCount} products`);
    console.log('\nDatabase populated successfully!');
  } catch (error) {
    console.error('Fatal error during population:', error);
    process.exit(1);
  }
}

// Run the script
populateDatabase();

