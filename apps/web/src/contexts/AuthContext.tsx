'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { adminAuth } from '@/services/admin';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Ensure we're on client side before accessing localStorage
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Only run on client side after mount
    if (!mounted || typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    // Public routes that don't need authentication
    const publicRoutes = ['/admin/login', '/admin/register'];
    const isPublicRoute = pathname && publicRoutes.includes(pathname);

    // Check for stored token
    const token = localStorage.getItem('admin_token');
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
      // Only redirect if not on a public route
      if (pathname?.startsWith('/admin') && !isPublicRoute) {
        router.push('/admin/login');
      }
    }
  }, [pathname, router, mounted]);

  const verifyToken = async () => {
    try {
      const data = await adminAuth.verify();
      if (data.valid && data.user) {
        setUser(data.user);
      } else {
        throw new Error('Invalid token');
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('admin_token');
      if (pathname?.startsWith('/admin') && pathname !== '/admin/login' && pathname !== '/admin/register') {
        router.push('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await adminAuth.getMe();
      setUser(userData);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      logout();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const data = await adminAuth.login({ email, password });
      localStorage.setItem('admin_token', data.token);
      setUser(data.user);
      // Redirect to admin dashboard
      router.push('/admin');
      router.refresh(); // Force refresh to update layout
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const data = await adminAuth.register({ email, password, name });
      localStorage.setItem('admin_token', data.token);
      setUser(data.user);
      router.push('/admin');
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await adminAuth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('admin_token');
      setUser(null);
      router.push('/admin/login');
    }
  };

  // Prevent hydration mismatch by not rendering auth-dependent content until mounted
  if (!mounted) {
    return (
      <AuthContext.Provider
        value={{
          user: null,
          loading: true,
          login,
          register,
          logout,
          isAuthenticated: false,
          refreshUser,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

