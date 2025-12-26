import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, Address } from '../types';

interface AddressScreenProps {
  navigation: NavigationProp<'Address'>;
}

interface AddressFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
}

const AddressScreen: React.FC<AddressScreenProps> = ({ navigation }) => {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      name: 'Home',
      address: '123 Main St',
      city: 'City',
      state: 'State',
      zipCode: '12345',
      phone: '123-456-7890',
      isDefault: true,
    },
    {
      id: 2,
      name: 'Work',
      address: '456 Business Ave',
      city: 'City',
      state: 'State',
      zipCode: '12345',
      phone: '123-456-7890',
      isDefault: false,
    },
  ]);

  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [formData, setFormData] = useState<AddressFormData>({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
  });

  const handleSave = (): void => {
    // Save address logic
    setShowAddForm(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Addresses</Text>
        <TouchableOpacity onPress={() => setShowAddForm(true)}>
          <Ionicons name="add" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {showAddForm ? (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Input
            label="Address Name"
            placeholder="e.g., Home, Work"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
          <Input
            label="Street Address"
            placeholder="Enter street address"
            value={formData.address}
            onChangeText={(text) => setFormData({ ...formData, address: text })}
          />
          <Input
            label="City"
            placeholder="Enter city"
            value={formData.city}
            onChangeText={(text) => setFormData({ ...formData, city: text })}
          />
          <Input
            label="State"
            placeholder="Enter state"
            value={formData.state}
            onChangeText={(text) => setFormData({ ...formData, state: text })}
          />
          <Input
            label="Zip Code"
            placeholder="Enter zip code"
            value={formData.zipCode}
            onChangeText={(text) => setFormData({ ...formData, zipCode: text })}
          />
          <Input
            label="Phone Number"
            placeholder="Enter phone number"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            keyboardType="phone-pad"
          />
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
          {addresses.map((address) => (
            <View key={address.id} style={styles.addressCard}>
              <View style={styles.addressHeader}>
                <Text style={styles.addressName}>{address.name}</Text>
                {address.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>Default</Text>
                  </View>
                )}
              </View>
              <Text style={styles.addressText}>
                {address.address}, {address.city}, {address.state} {address.zipCode}
              </Text>
              <Text style={styles.phoneText}>{address.phone}</Text>
              <View style={styles.addressActions}>
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
  addressCard: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  addressName: {
    ...Typography.h4,
    color: Colors.text,
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
  addressText: {
    ...Typography.body,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  phoneText: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  addressActions: {
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

export default AddressScreen;


