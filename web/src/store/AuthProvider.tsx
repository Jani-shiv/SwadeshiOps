import { useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import { authAPI } from '../services/api';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem('access_token');
    if (token) {
      authAPI.me()
        .then((res) => {
          if (res.data && isMounted) setUser(res.data);
        })
        .catch(() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        })
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });
    } else {
      Promise.resolve().then(() => {
        if (isMounted) setIsLoading(false);
      });
    }
    return () => { isMounted = false; };
  }, []);

  const login = async (email: string, password: string) => {
    const res = await authAPI.login(email, password);
    if (res.data) {
      setUser(res.data.user);
    }
  };

  const register = async (email: string, username: string, password: string, fullName: string) => {
    await authAPI.register(email, username, password, fullName);
  };

  const logout = () => {
    setUser(null);
    authAPI.logout();
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
