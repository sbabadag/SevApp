import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, Address, PaymentMethod } from '../types';

interface CheckoutScreenProps {
  navigation: NavigationProp<'Checkout'>;
}

interface AddressItem {
  id: number;
  name: string;
  address: string;
  isDefault: boolean;
}

interface PaymentMethodItem {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
}

const CheckoutScreen: React.FC<CheckoutScreenProps> = ({ navigation }) => {
  const [selectedAddress, setSelectedAddress] = useState<number>(1);
  const [selectedPayment, setSelectedPayment] = useState<string>('card');

  const addresses: AddressItem[] = [
    {
      id: 1,
      name: 'Home',
      address: '123 Main St, City, State 12345',
      isDefault: true,
    },
    {
      id: 2,
      name: 'Work',
      address: '456 Business Ave, City, State 12345',
      isDefault: false,
    },
  ];

  const paymentMethods: PaymentMethodItem[] = [
    { id: 'card', name: 'Credit/Debit Card', icon: 'card-outline' },
    { id: 'paypal', name: 'PayPal', icon: 'wallet-outline' },
    { id: 'cash', name: 'Cash on Delivery', icon: 'cash-outline' },
  ];

  const handlePlaceOrder = (): void => {
    // Handle order placement
    const mockOrder = {
      id: '12345',
      date: new Date().toISOString().split('T')[0],
      status: 'Processing' as const,
      items: [],
      subtotal: 89.98,
      shipping: 10.00,
      tax: 8.00,
      total: 107.98,
    };
    navigation.navigate('OrderDetail', { order: mockOrder });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Address')}>
              <Text style={styles.addButton}>Add New</Text>
            </TouchableOpacity>
          </View>
          {addresses.map((address) => (
            <TouchableOpacity
              key={address.id}
              style={[
                styles.addressCard,
                selectedAddress === address.id && styles.addressCardActive,
              ]}
              onPress={() => setSelectedAddress(address.id)}
            >
              <View style={styles.addressContent}>
                <Text style={styles.addressName}>{address.name}</Text>
                <Text style={styles.addressText}>{address.address}</Text>
                {address.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>Default</Text>
                  </View>
                )}
              </View>
              <Ionicons
                name={selectedAddress === address.id ? 'radio-button-on' : 'radio-button-off'}
                size={24}
                color={selectedAddress === address.id ? Colors.primary : Colors.border}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentCard,
                selectedPayment === method.id && styles.paymentCardActive,
              ]}
              onPress={() => setSelectedPayment(method.id)}
            >
              <Ionicons
                name={method.icon}
                size={24}
                color={selectedPayment === method.id ? Colors.primary : Colors.text}
              />
              <Text
                style={[
                  styles.paymentName,
                  selectedPayment === method.id && styles.paymentNameActive,
                ]}
              >
                {method.name}
              </Text>
              <Ionicons
                name={selectedPayment === method.id ? 'radio-button-on' : 'radio-button-off'}
                size={24}
                color={selectedPayment === method.id ? Colors.primary : Colors.border}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>$89.98</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>$10.00</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>$8.00</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>$107.98</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>$107.98</Text>
        </View>
        <Button title="Place Order" onPress={handlePlaceOrder} style={styles.orderButton} />
      </View>
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
  section: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  addButton: {
    ...Typography.bodySmall,
    color: Colors.primary,
  },
  addressCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.white,
  },
  addressCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
  },
  addressContent: {
    flex: 1,
  },
  addressName: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  addressText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  defaultBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    marginTop: Spacing.xs,
  },
  defaultText: {
    ...Typography.caption,
    color: Colors.white,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
    backgroundColor: Colors.white,
    gap: Spacing.md,
  },
  paymentCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
  },
  paymentName: {
    ...Typography.body,
    color: Colors.text,
    flex: 1,
  },
  paymentNameActive: {
    color: Colors.primary,
  },
  summaryCard: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  summaryLabel: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  summaryValue: {
    ...Typography.body,
    color: Colors.text,
  },
  totalRow: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  totalLabel: {
    ...Typography.h4,
    color: Colors.text,
  },
  totalValue: {
    ...Typography.h4,
    color: Colors.primary,
  },
  footer: {
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  totalAmount: {
    ...Typography.h2,
    color: Colors.primary,
  },
  orderButton: {
    marginTop: Spacing.sm,
  },
});

export default CheckoutScreen;

