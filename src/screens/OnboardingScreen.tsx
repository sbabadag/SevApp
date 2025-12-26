import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image, ScrollView as ScrollViewType } from 'react-native';
import { Button } from '../components/Button';
import { Colors, Spacing, Typography } from '../constants/theme';
import { NavigationProp } from '../types';

const { width } = Dimensions.get('window');

interface OnboardingItem {
  id: number;
  title: string;
  description: string;
  image: string;
}

const onboardingData: OnboardingItem[] = [
  {
    id: 1,
    title: 'Discover Fashion',
    description: 'Browse through thousands of trendy fashion items',
    image: 'https://via.placeholder.com/300',
  },
  {
    id: 2,
    title: 'Easy Shopping',
    description: 'Shop with ease and get your favorite items delivered',
    image: 'https://via.placeholder.com/300',
  },
  {
    id: 3,
    title: 'Best Deals',
    description: 'Get the best deals and discounts on premium products',
    image: 'https://via.placeholder.com/300',
  },
];

interface OnboardingScreenProps {
  navigation: NavigationProp<'Onboarding'>;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const scrollViewRef = useRef<ScrollViewType>(null);

  const handleNext = (): void => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
    } else {
      navigation.replace('Login');
    }
  };

  const handleSkip = (): void => {
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      >
        {onboardingData.map((item) => (
          <View key={item.id} style={styles.slide}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <View style={styles.dots}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, index === currentIndex && styles.activeDot]}
            />
          ))}
        </View>
        <View style={styles.buttons}>
          <Button
            title="Skip"
            variant="ghost"
            onPress={handleSkip}
            style={styles.skipButton}
          />
          <Button
            title={currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
            onPress={handleNext}
            style={styles.nextButton}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  slide: {
    width,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  image: {
    width: width * 0.8,
    height: width * 0.8,
    marginBottom: Spacing.xl,
  },
  title: {
    ...Typography.h1,
    color: Colors.text,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  description: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: Spacing.lg,
  },
  footer: {
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Colors.primary,
    width: 24,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  skipButton: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  nextButton: {
    flex: 2,
  },
});

export default OnboardingScreen;


