import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-xl font-bold mb-6">Welcome to Furniture Finder!</Text>
      <TouchableOpacity
        className="bg-red-500 px-4 py-2 rounded"
        onPress={handleLogout}
      >
        <Text className="text-white">Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}
