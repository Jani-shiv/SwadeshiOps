import { useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import { AuthContext } from './AuthContext';
import { authAPI } from '../services/api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      authAPI.me()
        .then((response) => {
          if (response.data) {
            setUser(response.data);
          }
        })
        .catch(() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          setUser(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authAPI.login(email, password);
    if (response.data) {
      setUser(response.data.user);
    }
  };

  const register = async (email: string, username: string, password: string, fullName: string) => {
    const response = await authAPI.register(email, username, password, fullName);
    if (response.data) {
      // Auto-login after registration
      await login(email, password);
    }
  };

  const logout = async () => {
    authAPI.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
