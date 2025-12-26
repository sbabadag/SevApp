import { supabase } from '../config/supabase';
import { Category } from '../types';

// Map invalid icon names to valid ones
const iconMapping: Record<string, string> = {
  'bag-outline': 'briefcase-outline',
  'footsteps-outline': 'walk-outline',
};

// Validate and normalize icon name
function normalizeIcon(icon: string | null | undefined): string {
  if (!icon) return 'grid-outline';
  // Check if icon needs to be mapped
  if (iconMapping[icon]) {
    return iconMapping[icon];
  }
  return icon;
}

class CategoryService {
  /**
   * Get all categories
   */
  async getCategories(): Promise<{ data: Category[]; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      const categories: Category[] = (data || []).map((item: any) => ({
        id: item.id,
        name: item.name,
        icon: normalizeIcon(item.icon),
        image: item.image_url,
      }));

      return { data: categories, error: null };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { data: [], error: error as Error };
    }
  }

  /**
   * Get category by ID
   */
  async getCategoryById(id: number): Promise<{ data: Category | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      if (!data) {
        return { data: null, error: null };
      }

      const category: Category = {
        id: data.id,
        name: data.name,
        icon: normalizeIcon(data.icon),
        image: data.image_url,
      };

      return { data: category, error: null };
    } catch (error) {
      console.error('Error fetching category:', error);
      return { data: null, error: error as Error };
    }
  }

  /**
   * Get product count for a category
   */
  async getCategoryProductCount(categoryId: number): Promise<{ count: number; error: Error | null }> {
    try {
      const { count, error } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', categoryId)
        .eq('in_stock', true);

      if (error) throw error;

      return { count: count || 0, error: null };
    } catch (error) {
      console.error('Error fetching category count:', error);
      return { count: 0, error: error as Error };
    }
  }
}

export const categoryService = new CategoryService();

