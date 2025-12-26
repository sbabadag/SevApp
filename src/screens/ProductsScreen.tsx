import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProductCard } from '../components/ProductCard';
import { Colors, Spacing, Typography } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, RoutePropType, Product } from '../types';

interface ProductsScreenProps {
  navigation: NavigationProp<'Products'>;
  route?: RoutePropType<'Products'>;
}

type ViewMode = 'grid' | 'list';

const ProductsScreen: React.FC<ProductsScreenProps> = ({ navigation, route }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy] = useState<string>('popular');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    route?.params?.category || 'All'
  );

  const categories: string[] = ['All', 'Men', 'Women', 'Kids', 'Shoes', 'Accessories'];
  const sortOptions: string[] = ['Popular', 'Price: Low to High', 'Price: High to Low', 'Newest'];

  const products: Product[] = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: Math.floor(Math.random() * 100) + 10,
    originalPrice: Math.floor(Math.random() * 50) + 100,
    image: 'https://via.placeholder.com/300',
    isFavorite: Math.random() > 0.5,
    discount: Math.random() > 0.5 ? Math.floor(Math.random() * 50) + 10 : undefined,
  }));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Products</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Search')}>
          <Ionicons name="search-outline" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesFilter}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.filterChip,
                selectedCategory === category && styles.filterChipActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedCategory === category && styles.filterChipTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.viewControls}>
          <TouchableOpacity
            style={styles.sortButton}
            onPress={() => {
              // Show sort modal
            }}
          >
            <Ionicons name="options-outline" size={20} color={Colors.text} />
            <Text style={styles.sortText}>Sort</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            <Ionicons
              name={viewMode === 'grid' ? 'list-outline' : 'grid-outline'}
              size={20}
              color={Colors.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Products List */}
      <FlatList
        data={products}
        numColumns={viewMode === 'grid' ? 2 : 1}
        key={viewMode}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.productsList}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
            onFavoritePress={() => {}}
            style={viewMode === 'grid' ? styles.gridItem : styles.listItem}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    ...Typography.h3,
    color: Colors.text,
  },
  filters: {
    paddingVertical: Spacing.md,
  },
  categoriesFilter: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    marginRight: Spacing.sm,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterChipText: {
    ...Typography.bodySmall,
    color: Colors.text,
  },
  filterChipTextActive: {
    color: Colors.white,
  },
  viewControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  sortText: {
    ...Typography.bodySmall,
    color: Colors.text,
  },
  viewButton: {
    padding: Spacing.xs,
  },
  productsList: {
    padding: Spacing.lg,
  },
  gridItem: {
    flex: 1,
    margin: Spacing.sm,
  },
  listItem: {
    width: '100%',
    marginBottom: Spacing.md,
  },
});

export default ProductsScreen;


