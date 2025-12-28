import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors, Spacing, BorderRadius, Typography, Shadows } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { ProductCardProps } from '../types';

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onPress, 
  onFavoritePress,
  style 
}) => {
  const { name, price, originalPrice, image, isFavorite, discount } = product;

  // Check if image URL is valid
  const hasValidImage = image && image.trim() !== '' && 
    !image.includes('via.placeholder.com') && 
    !image.includes('placeholder');

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        {hasValidImage ? (
          <Image 
            source={{ uri: image }} 
            style={styles.image}
            onError={(e) => {
              console.warn('Failed to load product image:', image);
            }}
          />
        ) : (
          <View style={[styles.image, styles.placeholderImage]}>
            <Ionicons name="image-outline" size={48} color={Colors.textSecondary} />
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}
        {discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{discount}%</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={onFavoritePress}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={20}
            color={isFavorite ? Colors.primary : Colors.text}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>{name}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>${price}</Text>
          {originalPrice && (
            <Text style={styles.originalPrice}>${originalPrice}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 160,
    marginRight: Spacing.md,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: Spacing.sm,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.lightGray,
  },
  discountBadge: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: Colors.error,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  discountText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '600',
  },
  favoriteButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.round,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.small,
  },
  content: {
    paddingHorizontal: Spacing.xs,
  },
  name: {
    ...Typography.bodySmall,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  price: {
    ...Typography.h4,
    color: Colors.primary,
    marginRight: Spacing.xs,
  },
  originalPrice: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  placeholderImage: {
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
});


