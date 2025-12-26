import React from 'react';
import { View, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Colors, BorderRadius, Shadows } from '../constants/theme';
import { CardProps } from '../types';

export const Card: React.FC<CardProps> = ({ children, style, onPress, ...props }) => {
  const Component = onPress ? TouchableOpacity : View;
  
  return (
    <Component
      style={[styles.card, style]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      {...props}
    >
      {children}
    </Component>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    ...Shadows.medium,
    padding: 16,
  },
});


