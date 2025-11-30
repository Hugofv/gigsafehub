'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getMenu } from '@/services/api';

interface MenuItem {
  root: any;
  items: any[];
  menuArticles?: any[];
}

interface MenuStructure {
  items: MenuItem[]; // New dynamic structure
  // Legacy structure for backward compatibility
  insurance: {
    root: any;
    items: any[];
    menuArticles: any[];
  };
  comparison: {
    root: any;
    items: any[];
  };
  guides: {
    root: any;
    items: any[];
    menuArticles: any[];
  };
  blog: {
    root: any;
    items: any[];
  };
}

interface MenuContextType {
  menu: MenuStructure | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({
  children,
  locale = 'pt-BR',
  country,
}: {
  children: React.ReactNode;
  locale?: string;
  country?: string;
}) {
  const [menu, setMenu] = useState<MenuStructure | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadMenu = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMenu(locale, country);
      setMenu(data.menu as MenuStructure);
    } catch (err) {
      console.error('Error loading menu:', err);
      setError(err instanceof Error ? err : new Error('Failed to load menu'));
      // Set empty menu structure on error
      setMenu({
        items: [], // New dynamic structure
        insurance: { root: null, items: [], menuArticles: [] },
        comparison: { root: null, items: [] },
        guides: { root: null, items: [], menuArticles: [] },
        blog: { root: null, items: [] },
      });
    } finally {
      setLoading(false);
    }
  }, [locale, country]);

  useEffect(() => {
    loadMenu();
  }, [loadMenu]);

  return (
    <MenuContext.Provider
      value={{
        menu,
        loading,
        error,
        refresh: loadMenu,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}

