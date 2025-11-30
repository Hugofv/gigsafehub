'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getAllCategories, filterCategoriesByLevel, filterCategoriesByParent, findCategoryBySlug, buildCategoryPath } from '@/services/api';
import type { Category } from '@/services/api';

interface CategoriesContextType {
  categories: Category[];
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  // Helper functions
  getByLevel: (level: number) => Category[];
  getByParent: (parentId: string | null) => Category[];
  findBySlug: (slug: string, locale?: string) => Category | undefined;
  buildPath: (category: Category, locale?: string) => string;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export function CategoriesProvider({
  children,
  locale = 'pt-BR',
}: {
  children: React.ReactNode;
  locale?: string;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllCategories(locale);
      setCategories(data);
    } catch (err) {
      console.error('Error loading categories:', err);
      setError(err instanceof Error ? err : new Error('Failed to load categories'));
    } finally {
      setLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const getByLevel = useCallback(
    (level: number) => filterCategoriesByLevel(categories, level),
    [categories]
  );

  const getByParent = useCallback(
    (parentId: string | null) => filterCategoriesByParent(categories, parentId),
    [categories]
  );

  const findBySlug = useCallback(
    (slug: string, categoryLocale?: string) => findCategoryBySlug(categories, slug, categoryLocale || locale),
    [categories, locale]
  );

  const buildPath = useCallback(
    (category: Category, categoryLocale?: string) => buildCategoryPath(category, categories, categoryLocale || locale),
    [categories, locale]
  );

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        loading,
        error,
        refresh: loadCategories,
        getByLevel,
        getByParent,
        findBySlug,
        buildPath,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoriesProvider');
  }
  return context;
}

