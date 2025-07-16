import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { isValidEmail } from '../utils/validation'; 

export default function LoginScreen() {
  const { login } = useAuth();
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
      await login();
    } else {
      Alert.alert('Invalid Credentials', 'Email or password is incorrect.');
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-2xl font-bold mb-6">Login</Text>

      <TextInput
        className="border p-3 rounded mb-4"
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        className="border p-3 rounded mb-6"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        className="bg-blue-500 p-3 rounded"
        onPress={handleLogin}
      >
        <Text className="text-white text-center font-medium">Log In</Text>
      </TouchableOpacity>
    </View>
  );
}
