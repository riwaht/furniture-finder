import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  isLoggedIn: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('isLoggedIn').then((val) => {
      setIsLoggedIn(val === 'true');
    });
  }, []);

  const login = async () => {
    await AsyncStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
