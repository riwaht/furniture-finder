import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Alert, Switch, ScrollView, StatusBar } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { SafeAreaView } from 'react-native-safe-area-context';

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

  // Dynamic colors based on theme
  const containerBg = theme === 'light' ? 'bg-white' : 'bg-gray-900';
  const headerBg = theme === 'light' ? 'bg-indigo-600' : 'bg-gray-800';
  const textPrimary = theme === 'light' ? 'text-gray-900' : 'text-white';
  const textSecondary = theme === 'light' ? 'text-gray-600' : 'text-gray-300';
  const cardBg = theme === 'light' ? 'bg-white' : 'bg-gray-800';
  const cardBorder = theme === 'light' ? 'border-gray-200' : 'border-gray-700';
  const buttonBg = theme === 'light' ? 'bg-indigo-600' : 'bg-indigo-500';
  const logoutButtonBg = theme === 'light' ? 'bg-red-600' : 'bg-red-700';
  const switchTrackFalse = theme === 'light' ? '#E5E7EB' : '#4B5563';
  const switchTrackTrue = theme === 'light' ? '#81b0ff' : '#6366F1';
  const switchThumbColor = theme === 'light' ? '#F9FAFB' : '#D1D5DB';


  return (
    // Use edges prop to exclude 'top' if header is shown
    <SafeAreaView edges={['bottom', 'left', 'right']} className={`flex-1 ${containerBg}`}>
      <StatusBar barStyle={theme === 'light' ? 'light-content' : 'light-content'} backgroundColor={headerBg === 'bg-indigo-600' ? '#4F46E5' : '#1F2937'} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        
        <View className={`w-full p-6 items-center justify-center ${headerBg} rounded-b-3xl shadow-lg`}>
          <Image
            source={
              profileImage
                ? { uri: profileImage }
                : require('../../assets/placeholder.png')
            }
            className="w-36 h-36 rounded-full mb-4 border-4 border-white shadow-lg"
          />
          <Text className="text-lg font-inter text-indigo-100">{userEmail}</Text>
        </View>

        <View className={`mx-4 mt-8 p-5 rounded-lg shadow-md ${cardBg} border ${cardBorder}`}>
          <Text className={`text-xl font-inter-semibold mb-4 ${textPrimary}`}>Profile Picture</Text>
          <TouchableOpacity
            className={`${buttonBg} px-6 py-3 rounded-lg shadow-md items-center`}
            onPress={handleTakePhoto}
          >
            <Text className="text-white text-lg font-inter-semibold">Update Photo</Text>
          </TouchableOpacity>
        </View>

        <View className={`mx-4 mt-4 p-5 rounded-lg shadow-md ${cardBg} border ${cardBorder}`}>
          <Text className={`text-xl font-inter-semibold mb-4 ${textPrimary}`}>App Settings</Text>
          <View className="flex-row items-center justify-between">
            <Text className={`text-lg font-inter ${textPrimary}`}>Dark Mode</Text>
            <Switch
              trackColor={{ false: switchTrackFalse, true: switchTrackTrue }}
              thumbColor={switchThumbColor}
              ios_backgroundColor={switchTrackFalse}
              onValueChange={toggleTheme}
              value={theme === 'dark'}
            />
          </View>
        </View>

        <View className="mx-4 mt-6 mb-8">
          <TouchableOpacity
            className={`${logoutButtonBg} px-6 py-3 rounded-lg shadow-md items-center`}
            onPress={handleLogout}
          >
            <Text className="text-white text-lg font-inter-semibold">Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
