'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { authService } from '@/services/auth.service';
import type { User } from '@/types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setSession: (token: string, user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('anime_guide_token');
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await authService.me();
      setUser(currentUser);
    } catch {
      logout();
    }
  }, [logout]);

  const setSession = useCallback((token: string, sessionUser: User) => {
    localStorage.setItem('anime_guide_token', token);
    setUser(sessionUser);
  }, []);

  useEffect(() => {
    const hydrate = async () => {
      const token = localStorage.getItem('anime_guide_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      await refreshUser();
      setIsLoading(false);
    };

    void hydrate();
  }, [refreshUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      setSession,
      logout,
      refreshUser,
    }),
    [isLoading, logout, refreshUser, setSession, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }

  return context;
}
