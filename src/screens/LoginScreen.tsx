import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { isValidEmail } from '../utils/validation';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const { login } = useAuth();
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Info', 'Please enter both email and password.');
      return;
    }

    if (!isValidEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email.');
      return;
    }

    if (email === 'test@example.com' && password === '123456') {
      await login(email);
    } else {
      Alert.alert('Invalid Credentials', 'Email or password is incorrect.');
    }
  };

  // Dynamic colors based on theme
  const containerBg = theme === 'light' ? 'bg-white' : 'bg-gray-900';
  const textPrimary = theme === 'light' ? 'text-gray-900' : 'text-white';
  const inputBg = theme === 'light' ? 'bg-white' : 'bg-gray-800';
  const inputBorder = theme === 'light' ? 'border-gray-300' : 'border-gray-700';
  const inputTextColor = theme === 'light' ? 'text-gray-900' : 'text-white';
  const inputPlaceholderColor = theme === 'light' ? '#9CA3AF' : '#6B7280';
  const buttonBg = theme === 'light' ? 'bg-indigo-600' : 'bg-indigo-500';

  return (
    <SafeAreaView className={`flex-1 justify-center px-6 ${containerBg}`}>
      <Text className={`text-3xl font-inter-bold mb-8 text-center ${textPrimary}`}>Welcome Back!</Text>

      <TextInput
        className={`border ${inputBorder} p-4 rounded-lg mb-4 ${inputBg} ${inputTextColor} font-inter`}
        placeholder="Email"
        placeholderTextColor={inputPlaceholderColor}
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        className={`border ${inputBorder} p-4 rounded-lg mb-6 ${inputBg} ${inputTextColor} font-inter`}
        placeholder="Password"
        placeholderTextColor={inputPlaceholderColor}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        className={`${buttonBg} p-4 rounded-lg shadow-md`}
        onPress={handleLogin}
      >
        <Text className="text-white text-center font-inter-semibold text-lg">Log In</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
