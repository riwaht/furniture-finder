import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import StackNavigator from './src/navigation/StackNavigator';
import './global.css';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext'; 
import { FavoritesProvider } from './src/context/FavoritesContext'; 

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <FavoritesProvider>
        <NavigationContainer>
          <StackNavigator />
          </NavigationContainer>
        </FavoritesProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
