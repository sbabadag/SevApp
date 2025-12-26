import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, Review } from '../types';

interface ReviewsScreenProps {
  navigation: NavigationProp<'Reviews'>;
}

interface ReviewFormData {
  rating: number;
  comment: string;
}

const ReviewsScreen: React.FC<ReviewsScreenProps> = ({ navigation }) => {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      userName: 'John Doe',
      userImage: 'https://via.placeholder.com/50',
      rating: 5,
      date: '2024-01-15',
      comment: 'Great product! Very satisfied with the quality.',
      productName: 'Classic White Shirt',
      productImage: 'https://via.placeholder.com/80',
    },
    {
      id: 2,
      userName: 'Jane Smith',
      userImage: 'https://via.placeholder.com/50',
      rating: 4,
      date: '2024-01-10',
      comment: 'Good quality, but could be better.',
      productName: 'Denim Jacket',
      productImage: 'https://via.placeholder.com/80',
    },
  ]);

  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newReview, setNewReview] = useState<ReviewFormData>({
    rating: 5,
    comment: '',
  });

  const renderStars = (rating: number): JSX.Element[] => {
    return Array.from({ length: 5 }, (_, i) => (
      <Ionicons
        key={i}
        name={i < rating ? 'star' : 'star-outline'}
        size={16}
        color={i < rating ? Colors.warning : Colors.border}
      />
    ));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reviews</Text>
        <TouchableOpacity onPress={() => setShowAddForm(true)}>
          <Ionicons name="add" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {showAddForm ? (
        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Rate Your Purchase</Text>
          <View style={styles.ratingContainer}>
            {Array.from({ length: 5 }, (_, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setNewReview({ ...newReview, rating: i + 1 })}
              >
                <Ionicons
                  name={i < newReview.rating ? 'star' : 'star-outline'}
                  size={32}
                  color={i < newReview.rating ? Colors.warning : Colors.border}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Input
            label="Your Review"
            placeholder="Write your review here..."
            value={newReview.comment}
            onChangeText={(text) => setNewReview({ ...newReview, comment: text })}
            multiline
            numberOfLines={4}
            style={styles.textArea}
          />
          <View style={styles.actions}>
            <Button
              title="Cancel"
              variant="outline"
              onPress={() => setShowAddForm(false)}
              style={styles.cancelButton}
            />
            <Button
              title="Submit"
              onPress={() => {
                // Submit review logic
                setShowAddForm(false);
              }}
              style={styles.submitButton}
            />
          </View>
        </View>
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Image source={{ uri: item.userImage }} style={styles.userImage} />
                <View style={styles.reviewInfo}>
                  <Text style={styles.userName}>{item.userName}</Text>
                  <View style={styles.ratingRow}>
                    {renderStars(item.rating)}
                    <Text style={styles.date}>{item.date}</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.comment}>{item.comment}</Text>
              <View style={styles.productInfo}>
                <Image source={{ uri: item.productImage }} style={styles.productImage} />
                <Text style={styles.productName}>{item.productName}</Text>
              </View>
            </View>
          )}
        />
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
  sectionTitle: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  cancelButton: {
    flex: 1,
  },
  submitButton: {
    flex: 1,
  },
  list: {
    padding: Spacing.lg,
  },
  reviewCard: {
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  reviewHeader: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: Spacing.md,
  },
  reviewInfo: {
    flex: 1,
  },
  userName: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  date: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginLeft: Spacing.sm,
  },
  comment: {
    ...Typography.body,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.sm,
    marginRight: Spacing.md,
  },
  productName: {
    ...Typography.body,
    color: Colors.text,
  },
});

export default ReviewsScreen;


