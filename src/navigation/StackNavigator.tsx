import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from './types';
import { useTheme } from '../context/ThemeContext';
import { TouchableOpacity, Text } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function StackNavigator() {
  const { isLoggedIn } = useAuth();
  const { theme } = useTheme();
  // Correctly type useNavigation for the entire stack
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Dynamic header styles based on theme
  const headerBackgroundColor = theme === 'light' ? '#4F46E5' : '#1F2937'; // Indigo-600 / Gray-800
  const headerTintColor = theme === 'light' ? '#FFFFFF' : '#E5E7EB'; // White / Gray-200

  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        <>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerShown: true,
              title: 'Furniture Finder',
              headerStyle: { backgroundColor: headerBackgroundColor },
              headerTintColor: headerTintColor,
              headerTitleStyle: { fontFamily: 'Inter-Bold', fontSize: 20 },
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Profile')} 
                  className="p-2 mr-2"
                >
                  <Text className={`text-2xl ${headerTintColor === '#FFFFFF' ? 'text-white' : 'text-gray-200'}`}>👤</Text>
                </TouchableOpacity>
              ),
            }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{
              headerShown: true,
              title: 'Your Profile',
              headerStyle: { backgroundColor: headerBackgroundColor },
              headerTintColor: headerTintColor,
              headerTitleStyle: { fontFamily: 'Inter-Bold', fontSize: 20 },
            }}
          />
          <Stack.Screen
            name="ProductDetail"
            component={ProductDetailScreen}
            options={{
              headerShown: true,
              title: 'Product Details',
              headerStyle: { backgroundColor: headerBackgroundColor },
              headerTintColor: headerTintColor,
              headerTitleStyle: { fontFamily: 'Inter-Bold', fontSize: 20 },
            }}
          />
        </>
      ) : (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
}
