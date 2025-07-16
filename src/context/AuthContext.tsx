import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  isLoggedIn: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  userEmail: string | null;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: async (_email: string) => {},
  logout: async () => { },
  userEmail: null,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null); // <-- Move it here

  useEffect(() => {
    AsyncStorage.getItem('isLoggedIn').then((val) => {
      setIsLoggedIn(val === 'true');
    });
    AsyncStorage.getItem('userEmail').then(setUserEmail);
  }, []);

  const login = async (email: string) => {
    await AsyncStorage.setItem('isLoggedIn', 'true');
    await AsyncStorage.setItem('userEmail', email);
    setIsLoggedIn(true);
    setUserEmail(email);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('isLoggedIn');
    await AsyncStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, userEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);