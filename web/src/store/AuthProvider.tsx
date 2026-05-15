import { useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import { AuthContext } from './AuthContext';
import { supabase } from '../lib/supabase';
import { authAPI } from '../services/api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Create our own User object mapping from Supabase
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || '',
          full_name: session.user.user_metadata?.full_name || '',
          role: 'member',
          is_active: true,
          created_at: session.user.created_at,
          updated_at: session.user.updated_at || session.user.created_at,
        });
        localStorage.setItem('access_token', session.access_token);
      } else {
        setUser(null);
        localStorage.removeItem('access_token');
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || '',
          full_name: session.user.user_metadata?.full_name || '',
          role: 'member',
          is_active: true,
          created_at: session.user.created_at,
          updated_at: session.user.updated_at || session.user.created_at,
        });
        localStorage.setItem('access_token', session.access_token);
      } else {
        setUser(null);
        localStorage.removeItem('access_token');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const register = async (email: string, username: string, password: string, fullName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name: fullName,
        }
      }
    });
    if (error) throw error;
    
    // Also try to register on our backend to keep DB in sync
    try {
      await authAPI.register(email, username, password, fullName);
    } catch (err) {
      console.warn('Backend registration failed, but Supabase auth succeeded', err);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('access_token');
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
