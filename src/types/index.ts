import React from 'react';
import { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp as RNRouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Main: { screen?: string; params?: any };
  HomeMain: undefined;
  ProductDetail: { product: Product };
  Products: { category?: string };
  Search: undefined;
  Categories: { category?: string };
  CartMain: undefined;
  Checkout: undefined;
  Address: undefined;
  Payment: undefined;
  ProfileMain: undefined;
  Orders: undefined;
  OrderDetail: { order: Order; orderId?: string };
  Wishlist: undefined;
  Settings: undefined;
  Notifications: undefined;
  Reviews: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  ProductDetail: { product: Product };
  Products: { category?: string };
  Search: undefined;
  Categories: { category?: string };
  Notifications: undefined;
};

export type ProductsStackParamList = {
  ProductsMain: undefined;
  ProductDetail: { product: Product };
  Categories: { category?: string };
};

export type CartStackParamList = {
  CartMain: undefined;
  Checkout: undefined;
  Address: undefined;
  Payment: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  Orders: undefined;
  OrderDetail: { order: Order; orderId?: string };
  Wishlist: undefined;
  Settings: undefined;
  Address: undefined;
  Notifications: undefined;
  Reviews: undefined;
};

export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  description?: string;
  category?: string;
  sizes?: string[];
  colors?: string[];
  isFavorite?: boolean;
  discount?: number;
  rating?: number;
  reviews?: number;
  inStock?: boolean;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  status: 'Delivered' | 'Processing' | 'Cancelled' | 'Shipped';
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  address?: string;
}

export interface OrderItem {
  id: number;
  name: string;
  image?: string;
  quantity: number;
  price: number;
}

export interface Address {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: number;
  type: 'card' | 'paypal' | 'cash';
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  email?: string;
  isDefault: boolean;
}

export interface Review {
  id: number;
  userName: string;
  userImage: string;
  rating: number;
  date: string;
  comment: string;
  productName: string;
  productImage: string;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  count?: number;
  image?: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'order' | 'promotion' | 'general';
  read: boolean;
}

export type NavigationProp<T extends keyof RootStackParamList> = NativeStackNavigationProp<
  RootStackParamList,
  T
>;

export type RoutePropType<T extends keyof RootStackParamList> = RNRouteProp<RootStackParamList, T>;

export interface ScreenProps<T extends keyof RootStackParamList> {
  navigation: NavigationProp<T>;
  route?: RoutePropType<T>;
}

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  style?: StyleProp<ViewStyle>;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
}

export interface ProductCardProps {
  product: Product;
  onPress: () => void;
  onFavoritePress: () => void;
  style?: StyleProp<ViewStyle>;
}

