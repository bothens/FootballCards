
import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthState, User } from '../types/types';
import * as api from '../api/api';

interface AuthContextType extends AuthState {
  login: (identifier: string) => Promise<void>;
  logout: () => Promise<void>;
  updateBalance: (newBalance: number) => void;
  changePassword: (current: string, next: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    loading: true,
  });

  useEffect(() => {
    // Check for saved token in local storage on mount
    const token = localStorage.getItem('ft_token');
    const user = localStorage.getItem('ft_user');
    
    if (token && user) {
      setState({
        token,
        user: JSON.parse(user),
        isAuthenticated: true,
        loading: false
      });
    } else {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (identifier: string) => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const { user, token } = await api.login(identifier);
      localStorage.setItem('ft_token', token);
      localStorage.setItem('ft_user', JSON.stringify(user));
      setState({
        user,
        token,
        isAuthenticated: true,
        loading: false
      });
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      throw error;
    }
  };

  const logout = async () => {
    await api.logout();
    localStorage.removeItem('ft_token');
    localStorage.removeItem('ft_user');
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false
    });
  };

  const changePassword = async (current: string, next: string) => {
    await api.changePassword(current, next);
  };

  const updateProfile = async (data: Partial<User>) => {
    const updatedUser = await api.updateProfile(data);
    localStorage.setItem('ft_user', JSON.stringify(updatedUser));
    setState(prev => ({ ...prev, user: updatedUser }));
  };

  const updateBalance = (newBalance: number) => {
    setState(prev => {
      if (!prev.user) return prev;
      const updatedUser = { ...prev.user, balance: newBalance };
      localStorage.setItem('ft_user', JSON.stringify(updatedUser));
      return { ...prev, user: updatedUser };
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateBalance, changePassword, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
