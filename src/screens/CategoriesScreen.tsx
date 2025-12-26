import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, RoutePropType, Category } from '../types';

interface CategoriesScreenProps {
  navigation: NavigationProp<'Categories'>;
  route?: RoutePropType<'Categories'>;
}

interface CategoryDisplay {
  id: number;
  name: string;
  image: string;
  count: number;
}

const CategoriesScreen: React.FC<CategoriesScreenProps> = ({ navigation, route }) => {
  const categories: CategoryDisplay[] = [
    { id: 1, name: 'Men', image: 'https://via.placeholder.com/200', count: 120 },
    { id: 2, name: 'Women', image: 'https://via.placeholder.com/200', count: 150 },
    { id: 3, name: 'Kids', image: 'https://via.placeholder.com/200', count: 80 },
    { id: 4, name: 'Shoes', image: 'https://via.placeholder.com/200', count: 90 },
    { id: 5, name: 'Accessories', image: 'https://via.placeholder.com/200', count: 60 },
    { id: 6, name: 'Bags', image: 'https://via.placeholder.com/200', count: 45 },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Categories</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryCard}
            onPress={() => navigation.navigate('Products', { category: category.name })}
          >
            <Image source={{ uri: category.image }} style={styles.categoryImage} />
            <View style={styles.categoryOverlay}>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryCount}>{category.count} items</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  content: {
    flex: 1,
  },
  categoryCard: {
    height: 150,
    margin: Spacing.lg,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  categoryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.md,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  categoryName: {
    ...Typography.h3,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  categoryCount: {
    ...Typography.bodySmall,
    color: Colors.white,
  },
});

export default CategoriesScreen;


