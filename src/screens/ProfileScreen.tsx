import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, Switch } from 'react-native'; // Import Switch
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

const PROFILE_IMAGE_KEY = 'profileImage';

export default function ProfileScreen() {
  const { userEmail, logout } = useAuth();
  const { theme, toggleTheme } = useTheme(); 
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    AsyncStorage.getItem(PROFILE_IMAGE_KEY).then((uri) => {
      if (uri) setProfileImage(uri);
    });
  }, []);

  const handleTakePhoto = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Camera access is required.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.5,
      base64: false,
    });

    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setProfileImage(uri);
      await AsyncStorage.setItem(PROFILE_IMAGE_KEY, uri);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const containerBg = theme === 'light' ? 'bg-white' : 'bg-gray-800';
  const textPrimary = theme === 'light' ? 'text-gray-900' : 'text-white';
  const textSecondary = theme === 'light' ? 'text-gray-700' : 'text-gray-300';
  const buttonBg = theme === 'light' ? 'bg-blue-500' : 'bg-blue-700';
  const logoutButtonBg = theme === 'light' ? 'bg-red-500' : 'bg-red-700';


  return (
    <View className={`flex-1 items-center justify-center px-6 ${containerBg}`}>
      <Text className={`text-xl font-bold mb-2 ${textPrimary}`}>Profile</Text>
      <Text className={`mb-4 ${textSecondary}`}>{userEmail}</Text>

      <Image
        source={
          profileImage
            ? { uri: profileImage }
            : require('../../assets/placeholder.png')
        }
        className="w-32 h-32 rounded-full mb-4 bg-gray-200"
      />

      <TouchableOpacity
        className={`${buttonBg} px-4 py-2 rounded mb-4`}
        onPress={handleTakePhoto}
      >
        <Text className="text-white">Take Profile Photo</Text>
      </TouchableOpacity>

      {/* Theme Toggle */}
      <View className="flex-row items-center mb-6">
        <Text className={`text-lg mr-2 ${textPrimary}`}>Dark Mode</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={theme === 'dark' ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleTheme}
          value={theme === 'dark'}
        />
      </View>

      <TouchableOpacity
        className={`${logoutButtonBg} px-4 py-2 rounded`}
        onPress={handleLogout}
      >
        <Text className="text-white">Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}
