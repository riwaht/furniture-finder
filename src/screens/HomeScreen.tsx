import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator, Alert, TextInput, StatusBar } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context'; // Ensure SafeAreaView is imported

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
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const navigation = useNavigation<NavigationProp>();

  const [furnitureItems, setFurnitureItems] = useState<FurnitureItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredFurniture = useMemo(() => {
    if (!searchQuery) {
      return furnitureItems;
    }
    const lowercasedQuery = searchQuery.toLowerCase();
    return furnitureItems.filter(item =>
      item.title.toLowerCase().includes(lowercasedQuery) ||
      item.description.toLowerCase().includes(lowercasedQuery)
    );
  }, [furnitureItems, searchQuery]);

  const handleToggleFavorite = (productId: number) => {
    if (isFavorite(productId)) {
      removeFavorite(productId);
    } else {
      addFavorite(productId);
    }
  };

  // Dynamic colors based on theme
  const containerBg = theme === 'light' ? 'bg-white' : 'bg-gray-900';
  const textPrimary = theme === 'light' ? 'text-gray-900' : 'text-white';
  const textSecondary = theme === 'light' ? 'text-gray-600' : 'text-gray-300';
  const cardBg = theme === 'light' ? 'bg-gray-50' : 'bg-gray-800';
  const cardText = theme === 'light' ? 'text-gray-900' : 'text-white';
  const cardPrice = theme === 'light' ? 'text-green-600' : 'text-green-400';
  const buttonBg = theme === 'light' ? 'bg-indigo-600' : 'bg-indigo-500';
  const activityIndicatorColor = theme === 'light' ? "#0000ff" : "#ffffff";
  const searchInputBg = theme === 'light' ? 'bg-white' : 'bg-gray-800';
  const searchInputBorder = theme === 'light' ? 'border-gray-300' : 'border-gray-700';
  const searchInputPlaceholderColor = theme === 'light' ? '#9CA3AF' : '#6B7280';
  const favoriteIconColor = theme === 'light' ? 'text-red-500' : 'text-red-400';
  const favoriteIconOutlineColor = theme === 'light' ? 'text-gray-400' : 'text-gray-500';


  const renderFurnitureItem = ({ item }: { item: FurnitureItem }) => (
    <TouchableOpacity
      className={`${cardBg} p-4 mb-4 rounded-lg shadow-md relative`}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    >
      <Image
        source={{ uri: item.thumbnail }}
        className="w-full h-40 rounded-md mb-2"
        resizeMode="cover"
      />
      <Text className={`text-lg font-inter-semibold mb-1 ${cardText}`}>{item.title}</Text>
      <Text className={`text-green-600 font-inter-bold mb-1 ${cardPrice}`}>${item.price.toFixed(2)}</Text>
      <Text className={`text-gray-600 text-sm font-inter ${textSecondary}`} numberOfLines={2}>
        {item.description}
      </Text>

      <TouchableOpacity
        className="absolute top-2 right-2 p-2 rounded-full bg-white/70 dark:bg-gray-800/70"
        onPress={() => handleToggleFavorite(item.id)}
      >
        <Text className={`text-2xl ${isFavorite(item.id) ? favoriteIconColor : favoriteIconOutlineColor}`}>
          {isFavorite(item.id) ? '❤️' : '🤍'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      // Use edges prop to exclude 'top' if header is shown
      <SafeAreaView edges={['bottom', 'left', 'right']} className={`flex-1 justify-center items-center ${containerBg}`}>
        <ActivityIndicator size="large" color={activityIndicatorColor} />
        <Text className={`mt-4 text-lg font-inter ${textSecondary}`}>Loading furniture...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      // Use edges prop to exclude 'top' if header is shown
      <SafeAreaView edges={['bottom', 'left', 'right']} className={`flex-1 justify-center items-center px-6 ${containerBg}`}>
        <Text className={`text-red-500 text-lg font-inter text-center mb-4 ${textPrimary}`}>Error: {error}</Text>
        <TouchableOpacity
          className={`${buttonBg} px-6 py-3 rounded-lg shadow-md`}
          onPress={() => {
            setLoading(true);
            setError(null);
            Alert.alert("Retry", "Attempting to reload. Please close and re-open app if issue persists.");
          }}
        >
          <Text className="text-white text-lg font-inter-semibold">Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    // Use edges prop to exclude 'top' if header is shown
    <SafeAreaView edges={['bottom', 'left', 'right']} className={`flex-1 ${containerBg}`}>
      <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} backgroundColor={theme === 'light' ? '#FFFFFF' : '#1F2937'} />
      <View className="flex-1 p-4">
        <TextInput
          className={`w-full p-3 rounded-lg border ${searchInputBorder} mb-4 ${searchInputBg} ${textPrimary} font-inter`}
          placeholder="Search furniture..."
          placeholderTextColor={searchInputPlaceholderColor}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {filteredFurniture.length === 0 && !loading && !error ? (
          <View className="flex-1 justify-center items-center">
            <Text className={`text-lg font-inter ${textSecondary}`}>No furniture found matching your search.</Text>
          </View>
        ) : (
          <FlatList
            data={filteredFurniture}
            renderItem={renderFurnitureItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}
