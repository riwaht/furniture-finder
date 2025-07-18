import React, { useState, useEffect } from 'react';
import { View, Text, Image, ActivityIndicator, ScrollView, Alert, TouchableOpacity, StatusBar } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../context/FavoritesContext';

type ProductDetailType = {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
};

type ProductDetailScreenRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

export default function ProductDetailScreen() {
  const route = useRoute<ProductDetailScreenRouteProp>();
  const { productId } = route.params;
  const { theme } = useTheme();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const [product, setProduct] = useState<ProductDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await fetch(`https://dummyjson.com/products/${productId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ProductDetailType = await response.json();
        setProduct(data);
      } catch (e: any) {
        console.error("Failed to fetch product details:", e);
        setError("Failed to load product details. Please try again.");
        Alert.alert("Error", "Could not load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleToggleFavorite = () => {
    if (product) {
      if (isFavorite(product.id)) {
        removeFavorite(product.id);
      } else {
        addFavorite(product.id);
      }
    }
  };

  // Dynamic colors based on theme
  const containerBg = theme === 'light' ? 'bg-white' : 'bg-gray-900';
  const headerBgColor = theme === 'light' ? '#4F46E5' : '#1F2937';
  const textPrimary = theme === 'light' ? 'text-gray-900' : 'text-white';
  const textSecondary = theme === 'light' ? 'text-gray-600' : 'text-gray-300';
  const priceText = theme === 'light' ? 'text-green-600' : 'text-green-400';
  const borderColor = theme === 'light' ? 'border-gray-200' : 'border-gray-700';
  const activityIndicatorColor = theme === 'light' ? "#0000ff" : "#ffffff";
  const favoriteIconColor = theme === 'light' ? 'text-red-500' : 'text-red-400';
  const favoriteIconOutlineColor = theme === 'light' ? 'text-gray-400' : 'text-gray-500';


  if (loading) {
    return (
      // Use edges prop to exclude 'top' if header is shown
      <SafeAreaView edges={['bottom', 'left', 'right']} className={`flex-1 justify-center items-center ${containerBg}`}>
        <ActivityIndicator size="large" color={activityIndicatorColor} />
        <Text className={`mt-4 text-lg font-inter ${textSecondary}`}>Loading product details...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      // Use edges prop to exclude 'top' if header is shown
      <SafeAreaView edges={['bottom', 'left', 'right']} className={`flex-1 justify-center items-center ${containerBg} px-6`}>
        <Text className={`text-red-500 text-lg font-inter text-center mb-4 ${textPrimary}`}>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  if (!product) {
    return (
      // Use edges prop to exclude 'top' if header is shown
      <SafeAreaView edges={['bottom', 'left', 'right']} className={`flex-1 justify-center items-center ${containerBg}`}>
        <Text className={`text-gray-700 text-lg font-inter ${textSecondary}`}>Product not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    // Use edges prop to exclude 'top' if header is shown
    <SafeAreaView edges={['bottom', 'left', 'right']} className={`flex-1 ${containerBg}`}>
      <StatusBar barStyle={theme === 'light' ? 'light-content' : 'light-content'} backgroundColor={headerBgColor} />
      <ScrollView className="flex-1 p-4">
        <View className="relative">
          <Image
            source={{ uri: product.images && product.images.length > 0 ? product.images[0] : product.thumbnail }}
            className="w-full h-64 rounded-lg mb-4"
            resizeMode="contain"
          />
          <TouchableOpacity
            className="absolute top-2 right-2 p-2 rounded-full bg-white/70 dark:bg-gray-800/70"
            onPress={handleToggleFavorite}
          >
            <Text className={`text-3xl ${isFavorite(product.id) ? favoriteIconColor : favoriteIconOutlineColor}`}>
              {isFavorite(product.id) ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text className={`text-3xl font-inter-bold mb-2 ${textPrimary}`}>{product.title}</Text>

        <Text className={`text-2xl font-inter-semibold ${priceText} mb-4`}>${product.price.toFixed(2)}</Text>

        {product.category && (
          <Text className={`text-md font-inter ${textSecondary} mb-2`}>Category: {product.category}</Text>
        )}

        <Text className={`text-lg font-inter ${textSecondary} leading-relaxed mb-4`}>{product.description}</Text>

        <View className={`border-t ${borderColor} pt-4 mt-4`}>
          <Text className={`text-md font-inter ${textSecondary} mb-1`}>Brand: {product.brand}</Text>
          <Text className={`text-md font-inter ${textSecondary} mb-1`}>Rating: {product.rating} / 5</Text>
          <Text className={`text-md font-inter ${textSecondary}`}>In Stock: {product.stock}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
