import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Mock login - check if user exists in localStorage
    try {
      // Try real API first (will fail if backend not running)
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      return { success: true };
    } catch (error) {
      // Fallback to mock login
      const storedUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      const foundUser = storedUsers.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        localStorage.setItem('token', 'mock-token-' + Date.now());
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        setUser(userWithoutPassword);
        return { success: true };
      }
      
      return { 
        success: false, 
        error: 'Invalid email or password. Try signing up first!' 
      };
    }
  };

  const register = async (userData) => {
    // Mock registration - save to localStorage
    try {
      // Try real API first (will fail if backend not running)
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      return { success: true };
    } catch (error) {
      // Fallback to mock registration
      const storedUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
      
      // Check if user already exists
      if (storedUsers.find(u => u.email === userData.email)) {
        return { 
          success: false, 
          error: 'Email already registered. Try logging in!' 
        };
      }
      
      // Create new user
      const newUser = {
        ...userData,
        _id: 'user-' + Date.now(),
        createdAt: new Date().toISOString(),
      };
      
      storedUsers.push(newUser);
      localStorage.setItem('mockUsers', JSON.stringify(storedUsers));
      
      // Log them in
      const { password: _, ...userWithoutPassword } = newUser;
      localStorage.setItem('token', 'mock-token-' + Date.now());
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
      
      return { success: true };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
