'use client';

import type { ReactNode } from 'react';
import { I18nProvider, useTranslation } from '@/contexts/I18nContext';
import { CategoriesProvider } from '@/contexts/CategoriesContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface LocaleLayoutProps {
  children: ReactNode;
  params: { locale: string };
}

function LayoutContent({ children }: { children: ReactNode }) {
  const { locale } = useTranslation();

  return (
    <CategoriesProvider locale={locale}>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </CategoriesProvider>
  );
}

export default function LocaleLayout({
  children,
}: LocaleLayoutProps) {
  return (
    <I18nProvider>
      <LayoutContent>{children}</LayoutContent>
    </I18nProvider>
  );
}

