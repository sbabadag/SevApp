import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, PaymentMethod } from '../types';

interface PaymentScreenProps {
  navigation: NavigationProp<'Payment'>;
}

interface PaymentFormData {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

interface PaymentMethodDisplay {
  id: number;
  type: 'card' | 'paypal';
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  email?: string;
  isDefault: boolean;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ navigation }) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodDisplay[]>([
    {
      id: 1,
      type: 'card',
      cardNumber: '**** **** **** 1234',
      cardHolder: 'John Doe',
      expiryDate: '12/25',
      isDefault: true,
    },
    {
      id: 2,
      type: 'paypal',
      email: 'john.doe@example.com',
      isDefault: false,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<PaymentFormData>({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });

  const handleSave = (): void => {
    // Save payment method logic
    setShowAddForm(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <TouchableOpacity onPress={() => setShowAddForm(true)}>
          <Ionicons name="add" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {showAddForm ? (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Input
            label="Card Number"
            placeholder="1234 5678 9012 3456"
            value={formData.cardNumber}
            onChangeText={(text) => setFormData({ ...formData, cardNumber: text })}
            keyboardType="numeric"
          />
          <Input
            label="Card Holder Name"
            placeholder="John Doe"
            value={formData.cardHolder}
            onChangeText={(text) => setFormData({ ...formData, cardHolder: text })}
          />
          <View style={styles.row}>
            <Input
              label="Expiry Date"
              placeholder="MM/YY"
              value={formData.expiryDate}
              onChangeText={(text) => setFormData({ ...formData, expiryDate: text })}
              style={styles.halfInput}
            />
            <Input
              label="CVV"
              placeholder="123"
              value={formData.cvv}
              onChangeText={(text) => setFormData({ ...formData, cvv: text })}
              keyboardType="numeric"
              style={styles.halfInput}
            />
          </View>
          <View style={styles.actions}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => setShowAddForm(false)}
              style={styles.cancelButton}
            />
            <Button title="Save" onPress={handleSave} style={styles.saveButton} />
          </View>
        </ScrollView>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {paymentMethods.map((method) => (
            <View key={method.id} style={styles.paymentCard}>
              <View style={styles.paymentHeader}>
                {method.type === 'card' ? (
                  <Ionicons name="card-outline" size={24} color={Colors.primary} />
                ) : (
                  <Ionicons name="wallet-outline" size={24} color={Colors.primary} />
                )}
                <View style={styles.paymentInfo}>
                  {method.type === 'card' ? (
                    <>
                      <Text style={styles.cardNumber}>{method.cardNumber}</Text>
                      <Text style={styles.cardDetails}>
                        {method.cardHolder} • {method.expiryDate}
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.cardNumber}>{method.email}</Text>
                  )}
                </View>
                {method.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>Default</Text>
                  </View>
                )}
              </View>
              <View style={styles.paymentActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="create-outline" size={20} color={Colors.primary} />
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="trash-outline" size={20} color={Colors.error} />
                  <Text style={[styles.actionText, { color: Colors.error }]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
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
    padding: Spacing.lg,
  },
  paymentCard: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  paymentInfo: {
    flex: 1,
  },
  cardNumber: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  cardDetails: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  defaultBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  defaultText: {
    ...Typography.caption,
    color: Colors.white,
  },
  paymentActions: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  actionText: {
    ...Typography.bodySmall,
    color: Colors.primary,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
});

export default PaymentScreen;

