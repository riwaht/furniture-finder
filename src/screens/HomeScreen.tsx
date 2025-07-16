import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext'; // Import useFavorites
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';

type FurnitureItem = {
  id: number;
  title: string;
  price: number;
  description: string;
  thumbnail: string;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const { logout } = useAuth();
  const { theme } = useTheme();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites(); // Get favorites functions
  const navigation = useNavigation<NavigationProp>();

  const [furnitureItems, setFurnitureItems] = useState<FurnitureItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFurniture = async () => {
      try {
        const response = await fetch('https://dummyjson.com/products/category/furniture');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFurnitureItems(data.products);
      } catch (e: any) {
        console.error("Failed to fetch furniture:", e);
        setError("Failed to load furniture. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFurniture();
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const handleToggleFavorite = (productId: number) => {
    if (isFavorite(productId)) {
      removeFavorite(productId);
    } else {
      addFavorite(productId);
    }
  };

  // Dynamic colors based on theme
  const containerBg = theme === 'light' ? 'bg-white' : 'bg-gray-900';
  const textPrimary = theme === 'light' ? 'text-gray-800' : 'text-white';
  const textSecondary = theme === 'light' ? 'text-gray-700' : 'text-gray-300';
  const cardBg = theme === 'light' ? 'bg-gray-100' : 'bg-gray-700';
  const cardText = theme === 'light' ? 'text-gray-900' : 'text-white';
  const cardPrice = theme === 'light' ? 'text-green-600' : 'text-green-400';
  const buttonBg = theme === 'light' ? 'bg-blue-500' : 'bg-blue-700';
  const logoutButtonBg = theme === 'light' ? 'bg-red-500' : 'bg-red-700';
  const activityIndicatorColor = theme === 'light' ? "#0000ff" : "#ffffff";


  const renderFurnitureItem = ({ item }: { item: FurnitureItem }) => (
    <TouchableOpacity
      className={`${cardBg} p-4 mb-4 rounded-lg shadow-md relative`} // Added relative for absolute positioning of favorite icon
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    >
      <Image
        source={{ uri: item.thumbnail }}
        className="w-full h-40 rounded-md mb-2"
        resizeMode="cover"
      />
      <Text className={`text-lg font-semibold mb-1 ${cardText}`}>{item.title}</Text>
      <Text className={`text-green-600 font-bold mb-1 ${cardPrice}`}>${item.price.toFixed(2)}</Text>
      <Text className={`text-gray-600 text-sm ${textSecondary}`} numberOfLines={2}>
        {item.description}
      </Text>

      {/* Favorite Button */}
      <TouchableOpacity
        className="absolute top-2 right-2 p-2 rounded-full bg-white/70" // Semi-transparent background
        onPress={() => handleToggleFavorite(item.id)}
      >
        <Text className="text-2xl">
          {isFavorite(item.id) ? '❤️' : '🤍'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView className={`flex-1 justify-center items-center ${containerBg}`}>
        <ActivityIndicator size="large" color={activityIndicatorColor} />
        <Text className={`mt-4 text-lg ${textSecondary}`}>Loading furniture...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className={`flex-1 justify-center items-center px-6 ${containerBg}`}>
        <Text className={`text-red-500 text-lg text-center mb-4 ${textPrimary}`}>Error: {error}</Text>
        <TouchableOpacity
          className={`${buttonBg} px-6 py-3 rounded-lg`}
          onPress={() => {
            setLoading(true);
            setError(null);
            Alert.alert("Retry", "Attempting to reload. Please close and re-open app if issue persists.");
          }}
        >
          <Text className="text-white text-lg font-semibold">Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${containerBg}`}>
      <View className="flex-1 p-4">
        <Text className={`text-2xl font-bold mb-6 text-center ${textPrimary}`}>Furniture Catalog</Text>

        <FlatList
          data={furnitureItems}
          renderItem={renderFurnitureItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />

        <View className="flex-row justify-around mt-4 pb-4">
          <TouchableOpacity
            className={`${buttonBg} px-6 py-3 rounded-lg flex-1 mx-2 items-center`}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text className="text-white text-lg font-semibold">Go to Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`${logoutButtonBg} px-6 py-3 rounded-lg flex-1 mx-2 items-center`}
            onPress={handleLogout}
          >
            <Text className="text-white text-lg font-semibold">Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
