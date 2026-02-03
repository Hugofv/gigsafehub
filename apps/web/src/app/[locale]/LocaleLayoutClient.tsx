'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { I18nProvider, useTranslation } from '@/contexts/I18nContext';
import { CategoriesProvider } from '@/contexts/CategoriesContext';
import { MenuProvider } from '@/contexts/MenuContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface LocaleLayoutClientProps {
  children: ReactNode;
  htmlLang?: string;
}

function LayoutContent({ children }: { children: ReactNode }) {
  const { locale } = useTranslation();

  return (
    <CategoriesProvider locale={locale}>
      <MenuProvider locale={locale}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </MenuProvider>
    </CategoriesProvider>
  );
}

export default function LocaleLayoutClient({ children, htmlLang }: LocaleLayoutClientProps) {
  useEffect(() => {
    if (htmlLang && typeof document !== 'undefined') {
      document.documentElement.lang = htmlLang;
    }
  }, [htmlLang]);

  return (
    <I18nProvider>
      <LayoutContent>{children}</LayoutContent>
    </I18nProvider>
  );
}

