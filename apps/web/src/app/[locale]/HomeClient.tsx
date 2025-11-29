'use client';

import React from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import type { FinancialProduct } from '@gigsafehub/types';
import { useTranslation } from '@/contexts/I18nContext';

export default function HomeClient({
  locale,
  featuredProducts
}: {
  locale: string;
  featuredProducts: FinancialProduct[];
}) {
  const { t } = useTranslation();
  const getLink = (path: string) => `/${locale}${path}`;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-brand-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/1920/1080?blur=5')] opacity-10 bg-cover bg-center"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-6">
            {t('home.title')} <span className="text-brand-500">{t('home.titleHighlight')}</span>.
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-300">
            {t('home.subtitle')}
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link href={getLink('/calculator')} className="px-8 py-4 rounded-full bg-brand-500 text-white font-bold text-lg hover:bg-brand-400 transition-all shadow-lg shadow-brand-500/30 transform hover:-translate-y-1">
              {t('home.cta')}
            </Link>
            <Link href={getLink('/articles')} className="px-8 py-4 rounded-full bg-slate-800 text-white font-bold text-lg hover:bg-slate-700 border border-slate-700 transition-all">
              {t('home.readGuides')}
            </Link>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-white py-10 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-16 text-slate-400 grayscale opacity-70">
           {/* Mock Logos */}
           <div className="font-bold text-xl">THE VERGE</div>
           <div className="font-bold text-xl">TechCrunch</div>
           <div className="font-bold text-xl">WIRED</div>
           <div className="font-bold text-xl">Forbes</div>
           <div className="font-bold text-xl">FastCompany</div>
        </div>
      </div>

      {/* Featured Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-8">
            <div>
                <h2 className="text-3xl font-bold text-slate-900">{t('home.topRated')}</h2>
                <p className="text-slate-500 mt-2">{t('home.curated')}</p>
            </div>
            <Link href={getLink('/reviews')} className="text-brand-600 font-semibold hover:text-brand-700 hidden sm:block">{t('home.viewAll')} &rarr;</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
            <Link href={getLink('/reviews')} className="text-brand-600 font-semibold hover:text-brand-700">{t('home.viewAll')} &rarr;</Link>
        </div>
      </div>
    </div>
  );
}

