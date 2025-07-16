import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type FavoritesContextType = {
  favoriteProductIds: number[];
  addFavorite: (productId: number) => Promise<void>;
  removeFavorite: (productId: number) => Promise<void>;
  isFavorite: (productId: number) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType>({
  favoriteProductIds: [],
  addFavorite: async (_productId: number) => {},
  removeFavorite: async (_productId: number) => {},
  isFavorite: (_productId: number) => false,
});

const FAVORITES_STORAGE_KEY = 'favoriteProductIds';

export const FavoritesProvider = ({ children }: { children: React.ReactNode }) => {
  const [favoriteProductIds, setFavoriteProductIds] = useState<number[]>([]);

  useEffect(() => {
    // Load favorites from AsyncStorage on app start
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
        if (storedFavorites) {
          // Parse the stored string back into an array of numbers
          setFavoriteProductIds(JSON.parse(storedFavorites));
        }
      } catch (e) {
        console.error("Failed to load favorites from AsyncStorage", e);
      }
    };
    loadFavorites();
  }, []);

  // Function to save favorites to AsyncStorage
  const saveFavorites = async (favorites: number[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error("Failed to save favorites to AsyncStorage", e);
    }
  };

  const addFavorite = async (productId: number) => {
    setFavoriteProductIds((prevFavorites) => {
      if (!prevFavorites.includes(productId)) {
        const newFavorites = [...prevFavorites, productId];
        saveFavorites(newFavorites); // Save the updated list
        return newFavorites;
      }
      return prevFavorites;
    });
  };

  const removeFavorite = async (productId: number) => {
    setFavoriteProductIds((prevFavorites) => {
      const newFavorites = prevFavorites.filter((id) => id !== productId);
      saveFavorites(newFavorites); // Save the updated list
      return newFavorites;
    });
  };

  const isFavorite = (productId: number) => {
    return favoriteProductIds.includes(productId);
  };

  return (
    <FavoritesContext.Provider value={{ favoriteProductIds, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => useContext(FavoritesContext);
