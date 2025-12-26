# SevApp - eCommerce Mobile App

A comprehensive React Native eCommerce mobile application built with Expo, featuring a complete shopping experience with product browsing, cart management, checkout, user profiles, and more.

## Features

### Authentication & Onboarding
- Splash Screen
- Onboarding Flow
- Login/Register
- Forgot Password
- Social Login Options

### Shopping Experience
- Home Screen with featured products
- Product Categories
- Product Listing with filters
- Product Detail View
- Search Functionality
- Shopping Cart
- Checkout Process
- Order Management

### User Features
- User Profile
- Wishlist/Favorites
- Order History
- Order Tracking
- Address Management
- Payment Methods
- Reviews & Ratings
- Notifications
- Settings

## Project Structure

```
SevApp/
├── App.js                 # Main app entry point
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── Button.js
│   │   ├── Card.js
│   │   ├── Input.js
│   │   └── ProductCard.js
│   ├── constants/        # Theme and constants
│   │   └── theme.js
│   ├── navigation/        # Navigation setup
│   │   └── AppNavigator.js
│   └── screens/          # All app screens
│       ├── SplashScreen.js
│       ├── OnboardingScreen.js
│       ├── LoginScreen.js
│       ├── RegisterScreen.js
│       ├── HomeScreen.js
│       ├── ProductsScreen.js
│       ├── ProductDetailScreen.js
│       ├── CartScreen.js
│       ├── CheckoutScreen.js
│       ├── ProfileScreen.js
│       ├── WishlistScreen.js
│       ├── OrdersScreen.js
│       ├── OrderDetailScreen.js
│       ├── CategoriesScreen.js
│       ├── SearchScreen.js
│       ├── NotificationsScreen.js
│       ├── SettingsScreen.js
│       ├── AddressScreen.js
│       ├── PaymentScreen.js
│       └── ReviewsScreen.js
├── package.json
└── app.json
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your preferred platform:
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Dependencies

- **expo**: Expo framework for React Native
- **@react-navigation/native**: Navigation library
- **@react-navigation/stack**: Stack navigator
- **@react-navigation/bottom-tabs**: Bottom tab navigator
- **react-native-safe-area-context**: Safe area handling
- **react-native-gesture-handler**: Gesture handling
- **react-native-reanimated**: Animations
- **@expo/vector-icons**: Icon library

## Design System

The app uses a consistent design system defined in `src/constants/theme.js`:

- **Colors**: Primary, secondary, background, text colors
- **Typography**: Font sizes and weights
- **Spacing**: Consistent spacing scale
- **Border Radius**: Standard border radius values
- **Shadows**: Elevation shadows

## Navigation Structure

- **Auth Stack**: Splash → Onboarding → Login/Register
- **Main Tabs**:
  - Home (with nested stack)
  - Products (with nested stack)
  - Cart (with nested stack)
  - Profile (with nested stack)

## Customization

### Colors
Edit `src/constants/theme.js` to customize the color scheme.

### Screens
All screens are located in `src/screens/` and can be customized to match your Figma designs.

### Components
Reusable components are in `src/components/` and can be extended or modified.

## Notes

- This is a template structure. You'll need to connect it to your backend API.
- Replace placeholder images with actual product images.
- Implement actual authentication logic.
- Add state management (Redux/Context) if needed.
- Connect to payment gateways for checkout.
- Implement push notifications.

## Next Steps

1. Review the Figma designs and adjust styling to match
2. Connect to your backend API
3. Implement state management
4. Add image assets
5. Test on physical devices
6. Implement analytics
7. Add error handling
8. Optimize performance

## License

This project is created for development purposes.


