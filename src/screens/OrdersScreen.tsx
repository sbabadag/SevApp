import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, Order, OrderItem } from '../types';

interface OrdersScreenProps {
  navigation: NavigationProp<'Orders'>;
}

interface OrderItemDisplay {
  name: string;
  image: string;
  quantity: number;
}

interface OrderDisplay {
  id: string;
  date: string;
  status: 'Delivered' | 'Processing' | 'Cancelled' | 'Shipped';
  items: OrderItemDisplay[];
  total: number;
}

const OrdersScreen: React.FC<OrdersScreenProps> = ({ navigation }) => {
  const orders: OrderDisplay[] = [
    {
      id: '12345',
      date: '2024-01-15',
      status: 'Delivered',
      items: [
        { name: 'Classic White Shirt', image: 'https://via.placeholder.com/80', quantity: 2 },
        { name: 'Denim Jacket', image: 'https://via.placeholder.com/80', quantity: 1 },
      ],
      total: 119.97,
    },
    {
      id: '12346',
      date: '2024-01-10',
      status: 'Processing',
      items: [
        { name: 'Summer Dress', image: 'https://via.placeholder.com/80', quantity: 1 },
      ],
      total: 49.99,
    },
  ];

  const getStatusColor = (status: OrderDisplay['status']): string => {
    switch (status) {
      case 'Delivered':
        return Colors.success;
      case 'Processing':
        return Colors.warning;
      case 'Cancelled':
        return Colors.error;
      default:
        return Colors.textSecondary;
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={{ width: 24 }} />
      </View>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.orderCard}
            onPress={() => {
              const order: Order = {
                id: item.id,
                date: item.date,
                status: item.status,
                items: item.items.map((i) => ({
                  id: 0,
                  name: i.name,
                  quantity: i.quantity,
                  price: 0,
                })),
                subtotal: item.total,
                shipping: 10,
                tax: 0,
                total: item.total,
              };
              navigation.navigate('OrderDetail', { order });
            }}
          >
            <View style={styles.orderHeader}>
              <View>
                <Text style={styles.orderId}>Order #{item.id}</Text>
                <Text style={styles.orderDate}>{item.date}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
            <View style={styles.itemsContainer}>
              {item.items.map((orderItem, index) => (
                <View key={index} style={styles.orderItem}>
                  <Image source={{ uri: orderItem.image }} style={styles.itemImage} />
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{orderItem.name}</Text>
                    <Text style={styles.itemQuantity}>Qty: {orderItem.quantity}</Text>
                  </View>
                </View>
              ))}
            </View>
            <View style={styles.orderFooter}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>${item.total.toFixed(2)}</Text>
            </View>
          </TouchableOpacity>
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
  orderCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  orderId: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  orderDate: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '600',
  },
  itemsContainer: {
    marginBottom: Spacing.md,
  },
  orderItem: {
    flexDirection: 'row',
    marginBottom: Spacing.sm,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.sm,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    ...Typography.body,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  itemQuantity: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  totalLabel: {
    ...Typography.body,
    color: Colors.text,
  },
  totalValue: {
    ...Typography.h4,
    color: Colors.primary,
  },
});

export default OrdersScreen;


