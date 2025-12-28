import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { CommonActions } from '@react-navigation/native';
import { ProductCard } from '../components/ProductCard';
import { Colors, Spacing, Typography } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, Product, Category } from '../types';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../hooks/useNotifications';

const { width } = Dimensions.get('window');

interface HomeScreenProps {
  navigation: NavigationProp<'HomeMain'>;
}

interface Banner {
  id: number;
  image: string;
  title: string;
  subtitle?: string;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user } = useAuth();
  const { unreadCount, refreshNotifications } = useNotifications();
  const isFocused = useIsFocused();
  const rootNavigation = useNavigation();
  const [searchQuery] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    loadData();

    // Subscribe to real-time campaign changes
    let unsubscribe: (() => void) | null = null;

    campaignService.subscribeToCampaigns(async () => {
      console.log('HomeScreen: Campaign updated, refreshing...');
      // Reload campaigns when they change
      const { data: campaignsData } = await campaignService.getCampaigns();
      if (campaignsData) {
        const campaignBanners: Banner[] = campaignsData.map((campaign) => ({
          id: campaign.id,
          image: campaign.image_url,
          title: campaign.title,
          subtitle: campaign.subtitle,
        }));
        setBanners(campaignBanners);
      }
    }).then((cleanup) => {
      unsubscribe = cleanup;
    }).catch((error) => {
      console.error('HomeScreen: Error subscribing to campaigns:', error);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Refresh notifications only when screen comes into focus (not on scroll)
  useEffect(() => {
    if (isFocused) {
      refreshNotifications();
    }
  }, [isFocused, refreshNotifications]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load categories
      const { data: categoriesData } = await categoryService.getCategories();
      if (categoriesData) {
        setCategories(categoriesData);
      }

      // Load featured products
      const { data: featuredData } = await productService.getFeaturedProducts(10);
      if (featuredData) {
        setFeaturedProducts(featuredData);
      }

      // Load new arrivals (recent products)
      const { data: newArrivalsData } = await productService.getProducts({ limit: 10 });
      if (newArrivalsData) {
        setNewArrivals(newArrivalsData);
      }
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    await refreshNotifications();
    setRefreshing(false);
  }, [refreshNotifications]);

  const banners: Banner[] = [
    { id: 1, image: 'https://via.placeholder.com/400x200', title: 'Summer Sale' },
    { id: 2, image: 'https://via.placeholder.com/400x200', title: 'New Collection' },
  ];

  const renderBanner = (banner: Banner) => {
    const hasValidImage = banner.image && 
      banner.image.trim() !== '' && 
      !banner.image.includes('via.placeholder.com') &&
      !banner.image.includes('placeholder');
    
    return (
      <View key={banner.id} style={styles.banner}>
        {hasValidImage ? (
          <Image 
            source={{ uri: banner.image }} 
            style={styles.bannerImage}
            onError={(e) => {
              console.warn('Failed to load banner image:', banner.image);
            }}
          />
        ) : (
          <View style={[styles.bannerImage, styles.bannerPlaceholder]}>
            <Ionicons name="image-outline" size={64} color={Colors.textSecondary} />
            <Text style={styles.bannerPlaceholderText}>{banner.title}</Text>
          </View>
        )}
        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerTitle}>{banner.title}</Text>
          <Text style={styles.bannerSubtitle}>{banner.subtitle || 'Special Offer'}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>Hello,</Text>
              <Text style={styles.userName}>{user?.user_metadata?.full_name || user?.email || 'Guest'}</Text>
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => {
                  // Navigate to Profile tab - go up two levels: HomeStack -> Tab Navigator
                  const tabNavigator = navigation.getParent()?.getParent();
                  if (tabNavigator) {
                    tabNavigator.navigate('Profile');
                  } else {
                    // Fallback: use root navigation with CommonActions
                    rootNavigation.dispatch(
                      CommonActions.navigate({
                        name: 'Main',
                        params: {
                          screen: 'Profile',
                        },
                      })
                    );
                  }
                }}
              >
                <Ionicons name="person-outline" size={24} color={Colors.text} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => navigation.navigate('Notifications')}
              >
                <Ionicons name="notifications-outline" size={24} color={Colors.text} />
                {unreadCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate('Search')}
        >
          <Ionicons name="search-outline" size={20} color={Colors.textSecondary} />
          <Text style={styles.searchPlaceholder}>Search products...</Text>
        </TouchableOpacity>

        {/* Banners */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.bannerContainer}
          contentContainerStyle={styles.bannerContent}
        >
          {banners.map(renderBanner)}
        </ScrollView>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => navigation.navigate('Categories', { category: category.name })}
              >
                <View style={styles.categoryIcon}>
                  <Ionicons name={category.icon as any} size={24} color={Colors.primary} />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Products')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {featuredProducts.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.productsContainer}
            >
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPress={() => navigation.navigate('ProductDetail', { product })}
                  onFavoritePress={() => {}}
                />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No featured products available</Text>
            </View>
          )}
        </View>

        {/* New Arrivals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>New Arrivals</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Products')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {newArrivals.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.productsContainer}
            >
              {newArrivals.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPress={() => navigation.navigate('ProductDetail', { product })}
                  onFavoritePress={() => {}}
                />
              ))}
            </ScrollView>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No new arrivals available</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  userName: {
    ...Typography.h3,
    color: Colors.text,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  badgeText: {
    ...Typography.caption,
    color: Colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 12,
    gap: Spacing.sm,
  },
  searchPlaceholder: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  bannerContainer: {
    marginBottom: Spacing.lg,
  },
  bannerContent: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  banner: {
    width: width - Spacing.lg * 2,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  bannerPlaceholder: {
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerPlaceholderText: {
    ...Typography.h3,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  bannerTitle: {
    ...Typography.h2,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  bannerSubtitle: {
    ...Typography.body,
    color: Colors.white,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text,
  },
  seeAll: {
    ...Typography.bodySmall,
    color: Colors.primary,
  },
  categoriesContainer: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  categoryIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  categoryName: {
    ...Typography.bodySmall,
    color: Colors.text,
  },
  productsContainer: {
    paddingHorizontal: Spacing.lg,
  },
  emptyState: {
    padding: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});

export default HomeScreen;
