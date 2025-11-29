'use client';

import React, { createContext, useContext, ReactNode, useEffect, useState, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { TRANSLATIONS } from '../constants';
import type { Locale } from '@gigsafehub/types';

interface I18nContextType {
  locale: Locale;
  t: (path: string) => string;
  changeLocale: (newLocale: Locale) => void;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

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
  const [locale, setLocale] = useState<Locale>('en-US');

  // Extract locale from URL path
  useEffect(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const firstSegment = pathSegments[0];
    if (firstSegment === 'pt-BR' || firstSegment === 'en-US') {
      setLocale(firstSegment as Locale);
    } else {
      setLocale('en-US');
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

  const changeLocale = (newLocale: Locale) => {
    if (newLocale === locale) return;

    // Replace the locale segment in the current path
    const pathSegments = pathname.split('/').filter(Boolean);
    if (pathSegments[0] === 'en-US' || pathSegments[0] === 'pt-BR') {
      pathSegments[0] = newLocale;
    } else {
      pathSegments.unshift(newLocale);
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

