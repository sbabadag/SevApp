import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProductCard } from '../components/ProductCard';
import { Colors, Spacing, Typography } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, Product } from '../types';

interface WishlistScreenProps {
  navigation: NavigationProp<'Wishlist'>;
}

const WishlistScreen: React.FC<WishlistScreenProps> = ({ navigation }) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([
    {
      id: 1,
      name: 'Classic White Shirt',
      price: 29.99,
      originalPrice: 39.99,
      image: 'https://via.placeholder.com/300',
      isFavorite: true,
      discount: 25,
    },
    {
      id: 2,
      name: 'Denim Jacket',
      price: 59.99,
      originalPrice: 79.99,
      image: 'https://via.placeholder.com/300',
      isFavorite: true,
      discount: 25,
    },
  ]);

  if (wishlistItems.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Wishlist</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={80} color={Colors.textSecondary} />
          <Text style={styles.emptyText}>Your wishlist is empty</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wishlist</Text>
        <View style={{ width: 24 }} />
      </View>
      <FlatList
        data={wishlistItems}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
            onFavoritePress={() => {
              setWishlistItems((items) => items.filter((i) => i.id !== item.id));
            }}
            style={styles.productCard}
          />
        )}
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
  list: {
    padding: Spacing.lg,
  },
  productCard: {
    flex: 1,
    margin: Spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.h3,
    color: Colors.textSecondary,
    marginTop: Spacing.lg,
  },
});

export default WishlistScreen;


