import { supabase } from '../config/supabase';
import { Product } from '../types';

interface ProductWithImages extends Product {
  images?: string[];
  sizes?: string[];
  colors?: string[];
}

// Helper function to ensure image URL is not empty
// Returns null for invalid URLs so components can handle fallback UI
function ensureImageUrl(url: string | null | undefined): string | null {
  if (url && url.trim() !== '' && url.trim() !== 'null' && url.trim() !== 'undefined') {
    return url;
  }
  return null; // Return null to indicate no valid image
}

// Helper function to process product images
function processProductImages(productImages: any[], mainImage: string): string[] {
  const additionalImages = (productImages || [])
    .map((img: any) => img.image_url)
    .filter((url: string) => url && url.trim() !== '' && !url.includes('via.placeholder.com') && !url.includes('placeholder'));
  
  if (additionalImages.length > 0) {
    return additionalImages.sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0));
  }
  
  const mainImageUrl = ensureImageUrl(mainImage);
  return mainImageUrl ? [mainImageUrl] : [];
}

class ProductService {
  /**
   * Get all products with optional filters
   */
  async getProducts(filters?: {
    categoryId?: number;
    categoryName?: string;
    limit?: number;
    offset?: number;
    search?: string;
  }): Promise<{ data: Product[]; error: Error | null }> {
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            name,
            icon
          ),
          product_images (
            image_url,
            display_order
          )
        `)
        .eq('in_stock', true);

      if (filters?.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }

      if (filters?.categoryName) {
        query = query.eq('categories.name', filters.categoryName);
      }

      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;

      const products: Product[] = (data || []).map((item: any) => {
        const mainImage = ensureImageUrl(item.image_url) || '';
        const allImages = processProductImages(item.product_images || [], item.image_url || '');
        
        return {
          id: item.id,
          name: item.name,
          price: item.price,
          originalPrice: item.original_price,
          image: mainImage,
          images: allImages,
          description: item.description,
          category: item.categories?.name,
          isFavorite: false, // Will be set based on wishlist
          discount: item.discount_percentage,
          rating: item.rating,
          reviews: item.review_count,
          inStock: item.in_stock,
        };
      });

      return { data: products, error: null };
    } catch (error) {
      console.error('Error fetching products:', error);
      return { data: [], error: error as Error };
    }
  }

  /**
   * Get a single product by ID
   */
  async getProductById(id: number, userId?: string): Promise<{ data: ProductWithImages | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            name,
            icon
          ),
          product_images (
            image_url,
            display_order
          ),
          product_variants (
            size,
            color,
            stock_quantity
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      // Check if product is in wishlist
      let isFavorite = false;
      if (userId) {
        const { data: wishlistData } = await supabase
          .from('wishlist_items')
          .select('id')
          .eq('user_id', userId)
          .eq('product_id', id)
          .single();
        isFavorite = !!wishlistData;
      }

      const sizes = [...new Set((data.product_variants || []).map((v: any) => v.size).filter(Boolean))];
      const colors = [...new Set((data.product_variants || []).map((v: any) => v.color).filter(Boolean))];

      const mainImage = ensureImageUrl(data.image_url) || '';
      const allImages = processProductImages(data.product_images || [], data.image_url || '');

      const product: ProductWithImages = {
        id: data.id,
        name: data.name,
        price: data.price,
        originalPrice: data.original_price,
        image: mainImage,
        images: allImages,
        description: data.description,
        category: data.categories?.name,
        sizes: sizes.length > 0 ? sizes : undefined,
        colors: colors.length > 0 ? colors : undefined,
        isFavorite,
        discount: data.discount_percentage,
        rating: data.rating,
        reviews: data.review_count,
        inStock: data.in_stock,
      };

      return { data: product, error: null };
    } catch (error) {
      console.error('Error fetching product:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Search products
   */
  async searchProducts(searchQuery: string, limit: number = 20): Promise<{ data: Product[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name
          ),
          product_images (
            image_url,
            display_order
          )
        `)
        .ilike('name', `%${searchQuery}%`)
        .eq('in_stock', true)
        .limit(limit);

      if (error) throw error;

      const products: Product[] = (data || []).map((item: any) => {
        const mainImage = ensureImageUrl(item.image_url) || '';
        const allImages = processProductImages(item.product_images || [], item.image_url || '');
        
        return {
          id: item.id,
          name: item.name,
          price: item.price,
          originalPrice: item.original_price,
          image: mainImage,
          images: allImages,
          description: item.description,
          category: item.categories?.name,
          isFavorite: false,
          discount: item.discount_percentage,
          rating: item.rating,
          reviews: item.review_count,
          inStock: item.in_stock,
        };
      });

      return { data: products, error: null };
    } catch (error) {
      console.error('Error searching products:', error);
      return { data: [], error: error as Error };
    }
  }

  /**
   * Get featured products
   */
  async getFeaturedProducts(limit: number = 10): Promise<{ data: Product[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            name
          ),
          product_images (
            image_url,
            display_order
          )
        `)
        .eq('in_stock', true)
        .order('rating', { ascending: false, nullsFirst: false })
        .limit(limit);

      if (error) throw error;

      const products: Product[] = (data || []).map((item: any) => {
        const mainImage = ensureImageUrl(item.image_url) || '';
        const allImages = processProductImages(item.product_images || [], item.image_url || '');
        
        return {
          id: item.id,
          name: item.name,
          price: item.price,
          originalPrice: item.original_price,
          image: mainImage,
          images: allImages,
          description: item.description,
          category: item.categories?.name,
          isFavorite: false,
          discount: item.discount_percentage,
          rating: item.rating,
          reviews: item.review_count,
          inStock: item.in_stock,
        };
      });

      return { data: products, error: null };
    } catch (error) {
      console.error('Error fetching featured products:', error);
      return { data: [], error: error as Error };
    }
  }
}

export const productService = new ProductService();
