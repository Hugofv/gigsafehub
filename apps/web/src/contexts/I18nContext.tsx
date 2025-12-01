'use client';

import React, { createContext, useContext, ReactNode, useEffect, useState, useMemo, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { TRANSLATIONS } from '../constants';
import { getArticleBySlug, getAllCategories, findCategoryBySlug } from '../services/api';
import type { Locale } from '@gigsafehub/types';

interface I18nContextType {
  locale: Locale;
  t: (path: string) => string;
  changeLocale: (newLocale: Locale) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Cache for articles (simple in-memory cache)
const articleCache = new Map<string, { data: any; timestamp: number }>();
const ARTICLE_CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

// Cache for categories by locale
const categoriesCacheByLocale = new Map<string, { data: any[]; timestamp: number }>();
const CATEGORIES_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to get cached article
function getCachedArticle(slug: string, locale: string): any | null {
  const key = `${locale}:${slug}`;
  const cached = articleCache.get(key);
  if (cached && Date.now() - cached.timestamp < ARTICLE_CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

// Helper function to set cached article
function setCachedArticle(slug: string, locale: string, article: any): void {
  const key = `${locale}:${slug}`;
  articleCache.set(key, { data: article, timestamp: Date.now() });
  // Limit cache size to prevent memory leaks
  if (articleCache.size > 50) {
    const firstKey = articleCache.keys().next().value;
    if (firstKey) {
      articleCache.delete(firstKey);
    }
  }
}

// Helper function to get cached categories
function getCachedCategories(locale: string): any[] | null {
  const cached = categoriesCacheByLocale.get(locale);
  if (cached && Date.now() - cached.timestamp < CATEGORIES_CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

// Helper function to set cached categories
function setCachedCategories(locale: string, categories: any[]): void {
  categoriesCacheByLocale.set(locale, { data: categories, timestamp: Date.now() });
}

// Unified function to build category path
function buildCategoryPath(catId: string, allCats: any[], targetLocale: Locale): string[] {
  const path: string[] = [];
  const catMap = new Map(allCats.map(c => [c.id, c]));
  let current = catMap.get(catId);

  while (current) {
    const slug = targetLocale === 'pt-BR'
      ? (current.slugPt || current.slug)
      : targetLocale === 'en-US'
        ? (current.slugEn || current.slug)
        : current.slug;
    path.unshift(slug);

    if (current.parentId) {
      current = catMap.get(current.parentId);
    } else {
      break;
    }
  }

  return path;
}

// Helper to get article slug for locale
function getArticleSlugForLocale(article: any, targetLocale: Locale): string {
  return targetLocale === 'pt-BR' && article.slugPt
    ? article.slugPt
    : targetLocale === 'en-US' && article.slugEn
      ? article.slugEn
      : article.slug;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>('pt-BR');

  // Extract locale from URL path
  useEffect(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const firstSegment = pathSegments[0];
    if (firstSegment === 'pt-BR' || firstSegment === 'en-US') {
      setLocale(firstSegment as Locale);
    } else {
      setLocale('pt-BR');
    }
  }, [pathname]);

  const t = (path: string): string => {
    const keys = path.split('.');
    let value: any = TRANSLATIONS[locale];
    for (const key of keys) {
      if (value && value[key]) {
        value = value[key];
      } else {
        return path; // Fallback to key if not found
      }
    }
    return value as string;
  };

  const changeLocale = async (newLocale: Locale) => {
    if (newLocale === locale) return;

    // Replace the locale segment in the current path
    const pathSegments = pathname.split('/').filter(Boolean);
    if (pathSegments[0] === 'en-US' || pathSegments[0] === 'pt-BR') {
      pathSegments[0] = newLocale;
    } else {
      pathSegments.unshift(newLocale);
    }

    // Early return if path is too short (just locale)
    if (pathSegments.length <= 1) {
      router.push('/' + pathSegments.join('/'));
      return;
    }

    const lastSegment = pathSegments[pathSegments.length - 1];

    try {
      // Try to get article from cache first
      let article = getCachedArticle(lastSegment, locale);

      if (!article) {
        article = await getArticleBySlug(lastSegment, locale);
        if (article) {
          setCachedArticle(lastSegment, locale, article);
        }
      }

      if (article) {
        // Article found - convert article and category slugs
        const newArticleSlug = getArticleSlugForLocale(article, newLocale);

        if (article.category) {
          // Get categories (use cache if available)
          let currentCategories = getCachedCategories(locale);
          let newCategories = getCachedCategories(newLocale);

          if (!currentCategories || !newCategories) {
            const [fetchedCurrent, fetchedNew] = await Promise.all([
              currentCategories ? Promise.resolve(currentCategories) : getAllCategories(locale),
              newCategories ? Promise.resolve(newCategories) : getAllCategories(newLocale),
            ]);

            if (!currentCategories) {
              currentCategories = fetchedCurrent;
              setCachedCategories(locale, currentCategories);
            }
            if (!newCategories) {
              newCategories = fetchedNew;
              setCachedCategories(newLocale, newCategories);
            }
          }

          // Build category path for new locale
          const newCategoryPath = buildCategoryPath(article.category.id, newCategories, newLocale);

          // Build complete path: locale + category path + article slug
          const newPath = '/' + [newLocale, ...newCategoryPath, newArticleSlug].join('/');
          router.push(newPath);
          return;
        } else {
          // Article without category - just convert article slug
          if (newArticleSlug !== lastSegment) {
            pathSegments[pathSegments.length - 1] = newArticleSlug;
          }
        }
      } else {
        // No article found - try to convert category slugs
        let currentCategories = getCachedCategories(locale);
        let newCategories = getCachedCategories(newLocale);

        if (!currentCategories || !newCategories) {
          const [fetchedCurrent, fetchedNew] = await Promise.all([
            currentCategories ? Promise.resolve(currentCategories) : getAllCategories(locale),
            newCategories ? Promise.resolve(newCategories) : getAllCategories(newLocale),
          ]);

          if (!currentCategories) {
            currentCategories = fetchedCurrent;
            setCachedCategories(locale, currentCategories);
          }
          if (!newCategories) {
            newCategories = fetchedNew;
            setCachedCategories(newLocale, newCategories);
          }
        }

        // Convert each segment that might be a category
        const categoryMap = new Map(newCategories.map(c => [c.id, c]));
        const convertedSegments = pathSegments.slice(1).map(segment => {
          const currentCat = findCategoryBySlug(currentCategories, segment, locale);
          if (currentCat) {
            const newCat = categoryMap.get(currentCat.id);
            if (newCat) {
              return newLocale === 'pt-BR'
                ? (newCat.slugPt || newCat.slug)
                : newLocale === 'en-US'
                  ? (newCat.slugEn || newCat.slug)
                  : newCat.slug;
            }
          }
          return segment;
        });

        pathSegments.splice(1, convertedSegments.length, ...convertedSegments);
      }
    } catch (error) {
      console.error('Error converting slugs for locale change:', error);
      // Continue with basic locale change if conversion fails
    }

    const newPath = '/' + pathSegments.join('/');
    router.push(newPath);
  };

  return (
    <I18nContext.Provider value={{ locale, t, changeLocale }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};

