<<<<<<< HEAD
import React, { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { AuthState, User } from "../types/types";
import * as api from "../api/api";

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
=======

import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AuthState, User } from '../types/types';
import * as api from '../api/api';

interface AuthContextType extends AuthState {
  login: (identifier: string) => Promise<void>;
>>>>>>> main
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
<<<<<<< HEAD
    const token = localStorage.getItem("ft_token") || localStorage.getItem("token");
    const user = localStorage.getItem("ft_user");

=======
    // Check for saved token in local storage on mount
    const token = localStorage.getItem('ft_token');
    const user = localStorage.getItem('ft_user');
    
>>>>>>> main
    if (token && user) {
      setState({
        token,
        user: JSON.parse(user),
        isAuthenticated: true,
<<<<<<< HEAD
        loading: false,
      });
    } else {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const { user, token } = await api.login(email, password);
      localStorage.setItem("ft_token", token);
      localStorage.setItem("ft_user", JSON.stringify(user));

=======
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
>>>>>>> main
      setState({
        user,
        token,
        isAuthenticated: true,
<<<<<<< HEAD
        loading: false,
      });
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false }));
      throw error;
    }
  };

  const register = async (email: string, password: string, displayName: string) => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const { user, token } = await api.register(email, password, displayName);
      localStorage.setItem("ft_token", token);
      localStorage.setItem("ft_user", JSON.stringify(user));

      setState({
        user,
        token,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false }));
=======
        loading: false
      });
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
>>>>>>> main
      throw error;
    }
  };

  const logout = async () => {
    await api.logout();
<<<<<<< HEAD
    localStorage.removeItem("ft_token");
    localStorage.removeItem("ft_user");
    localStorage.removeItem("token");

=======
    localStorage.removeItem('ft_token');
    localStorage.removeItem('ft_user');
>>>>>>> main
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
<<<<<<< HEAD
      loading: false,
=======
      loading: false
>>>>>>> main
    });
  };

  const changePassword = async (current: string, next: string) => {
    await api.changePassword(current, next);
  };

  const updateProfile = async (data: Partial<User>) => {
    const updatedUser = await api.updateProfile(data);
<<<<<<< HEAD
    localStorage.setItem("ft_user", JSON.stringify(updatedUser));
    setState((prev) => ({ ...prev, user: updatedUser }));
  };

  const updateBalance = (newBalance: number) => {
    setState((prev) => {
      if (!prev.user) return prev;
      const updatedUser = { ...prev.user, balance: newBalance };
      localStorage.setItem("ft_user", JSON.stringify(updatedUser));
=======
    localStorage.setItem('ft_user', JSON.stringify(updatedUser));
    setState(prev => ({ ...prev, user: updatedUser }));
  };

  const updateBalance = (newBalance: number) => {
    setState(prev => {
      if (!prev.user) return prev;
      const updatedUser = { ...prev.user, balance: newBalance };
      localStorage.setItem('ft_user', JSON.stringify(updatedUser));
>>>>>>> main
      return { ...prev, user: updatedUser };
    });
  };

  return (
<<<<<<< HEAD
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateBalance,
        changePassword,
        updateProfile,
      }}
    >
=======
    <AuthContext.Provider value={{ ...state, login, logout, updateBalance, changePassword, updateProfile }}>
>>>>>>> main
      {children}
    </AuthContext.Provider>
  );
};
