import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';
import { RootStackParamList, HomeStackParamList, ProductsStackParamList, CartStackParamList, ProfileStackParamList } from '../types';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import ProductsScreen from '../screens/ProductsScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import ProfileScreen from '../screens/ProfileScreen';
import WishlistScreen from '../screens/WishlistScreen';
import OrdersScreen from '../screens/OrdersScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import SearchScreen from '../screens/SearchScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AddressScreen from '../screens/AddressScreen';
import PaymentScreen from '../screens/PaymentScreen';
import ReviewsScreen from '../screens/ReviewsScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import SplashScreen from '../screens/SplashScreen';

const Stack = createStackNavigator<RootStackParamList>();
const HomeStackNavigator = createStackNavigator<HomeStackParamList>();
const ProductsStackNavigator = createStackNavigator<ProductsStackParamList>();
const CartStackNavigator = createStackNavigator<CartStackParamList>();
const ProfileStackNavigator = createStackNavigator<ProfileStackParamList>();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <HomeStackNavigator.Navigator>
    <HomeStackNavigator.Screen 
      name="HomeMain" 
      component={HomeScreen}
      options={{ headerShown: false }}
    />
    <HomeStackNavigator.Screen 
      name="ProductDetail" 
      component={ProductDetailScreen}
      options={{ headerShown: false }}
    />
    <HomeStackNavigator.Screen 
      name="Products" 
      component={ProductsScreen}
      options={{ headerShown: false }}
    />
    <HomeStackNavigator.Screen 
      name="Search" 
      component={SearchScreen}
      options={{ headerShown: false }}
    />
    <HomeStackNavigator.Screen 
      name="Categories" 
      component={CategoriesScreen}
      options={{ headerShown: false }}
    />
  </HomeStackNavigator.Navigator>
);

const ProductsStack = () => (
  <ProductsStackNavigator.Navigator>
    <ProductsStackNavigator.Screen 
      name="ProductsMain" 
      component={ProductsScreen}
      options={{ headerShown: false }}
    />
    <ProductsStackNavigator.Screen 
      name="ProductDetail" 
      component={ProductDetailScreen}
      options={{ headerShown: false }}
    />
    <ProductsStackNavigator.Screen 
      name="Categories" 
      component={CategoriesScreen}
      options={{ headerShown: false }}
    />
  </ProductsStackNavigator.Navigator>
);

const CartStack = () => (
  <CartStackNavigator.Navigator>
    <CartStackNavigator.Screen 
      name="CartMain" 
      component={CartScreen}
      options={{ headerShown: false }}
    />
    <CartStackNavigator.Screen 
      name="Checkout" 
      component={CheckoutScreen}
      options={{ headerShown: false }}
    />
    <CartStackNavigator.Screen 
      name="Address" 
      component={AddressScreen}
      options={{ headerShown: false }}
    />
    <CartStackNavigator.Screen 
      name="Payment" 
      component={PaymentScreen}
      options={{ headerShown: false }}
    />
  </CartStackNavigator.Navigator>
);

const ProfileStack = () => (
  <ProfileStackNavigator.Navigator>
    <ProfileStackNavigator.Screen 
      name="ProfileMain" 
      component={ProfileScreen}
      options={{ headerShown: false }}
    />
    <ProfileStackNavigator.Screen 
      name="Orders" 
      component={OrdersScreen}
      options={{ headerShown: false }}
    />
    <ProfileStackNavigator.Screen 
      name="OrderDetail" 
      component={OrderDetailScreen}
      options={{ headerShown: false }}
    />
    <ProfileStackNavigator.Screen 
      name="Wishlist" 
      component={WishlistScreen}
      options={{ headerShown: false }}
    />
    <ProfileStackNavigator.Screen 
      name="Settings" 
      component={SettingsScreen}
      options={{ headerShown: false }}
    />
    <ProfileStackNavigator.Screen 
      name="Address" 
      component={AddressScreen}
      options={{ headerShown: false }}
    />
    <ProfileStackNavigator.Screen 
      name="Notifications" 
      component={NotificationsScreen}
      options={{ headerShown: false }}
    />
    <ProfileStackNavigator.Screen 
      name="Reviews" 
      component={ReviewsScreen}
      options={{ headerShown: false }}
    />
  </ProfileStackNavigator.Navigator>
);

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap;

        if (route.name === 'Home') {
          iconName = focused ? 'home' : 'home-outline';
        } else if (route.name === 'Products') {
          iconName = focused ? 'grid' : 'grid-outline';
        } else if (route.name === 'Cart') {
          iconName = focused ? 'cart' : 'cart-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        } else {
          iconName = 'help-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: Colors.primary,
      tabBarInactiveTintColor: Colors.textSecondary,
      headerShown: false,
      tabBarStyle: {
        borderTopWidth: 1,
        borderTopColor: Colors.border,
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeStack} />
    <Tab.Screen name="Products" component={ProductsStack} />
    <Tab.Screen name="Cart" component={CartStack} />
    <Tab.Screen name="Profile" component={ProfileStack} />
  </Tab.Navigator>
);

const AppNavigator = (): JSX.Element => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;


