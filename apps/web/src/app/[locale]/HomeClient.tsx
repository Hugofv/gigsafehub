'use client';

import React, { lazy, Suspense } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import type { FinancialProduct } from '@gigsafehub/types';
import { useTranslation } from '@/contexts/I18nContext';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

// Lazy load heavy components
const FeaturesSection = lazy(() => import('./FeaturesSection'));

export default function HomeClient({
  locale,
  featuredProducts
}: {
  locale: string;
  featuredProducts: FinancialProduct[];
}) {
  const { t } = useTranslation();
  const { isSlowConnection, saveData } = useNetworkStatus();
  const getLink = (path: string) => `/${locale}${path}`;

  // Reduce animations on slow connections
  const shouldAnimate = !isSlowConnection && !saveData;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-brand-900 via-brand-800 to-slate-900 overflow-hidden">
        {/* Animated background elements - only on fast connections */}
        {shouldAnimate && (
          <>
            <div className="absolute inset-0">
              <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          </>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
          <div className="text-center">
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/20 backdrop-blur-sm border border-brand-400/30 mb-8 ${shouldAnimate ? 'animate-fade-in' : ''}`}>
              <span className={`w-2 h-2 bg-brand-400 rounded-full ${shouldAnimate ? 'animate-pulse' : ''}`}></span>
              <span className="text-sm font-medium text-brand-200">Trusted by 10,000+ freelancers</span>
            </div>

            <h1 className={`text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 ${shouldAnimate ? 'animate-fade-in-up' : ''}`}>
              {t('home.title')}{' '}
              <span className="bg-gradient-to-r from-brand-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {t('home.titleHighlight')}
              </span>
            </h1>

            <p className={`mt-6 max-w-3xl mx-auto text-xl md:text-2xl text-slate-300 leading-relaxed ${shouldAnimate ? 'animate-fade-in-up delay-100' : ''}`}>
              {t('home.subtitle')}
            </p>

            <div className={`mt-12 flex flex-col sm:flex-row justify-center gap-4 ${shouldAnimate ? 'animate-fade-in-up delay-200' : ''}`}>
              <Link
                href={getLink('/calculator')}
                className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold text-lg hover:from-brand-400 hover:to-brand-500 transition-all shadow-2xl shadow-brand-500/50 transform hover:-translate-y-1 hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {t('home.cta')}
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-brand-400 to-brand-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>

              <Link
                href={getLink('/articles')}
                className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm text-white font-bold text-lg hover:bg-white/20 border border-white/20 transition-all transform hover:-translate-y-1"
              >
                {t('home.readGuides')}
              </Link>
            </div>

            {/* Stats */}
            <div className={`mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto ${shouldAnimate ? 'animate-fade-in-up delay-300' : ''}`}>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">500+</div>
                <div className="text-sm text-slate-400">Products Reviewed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">50K+</div>
                <div className="text-sm text-slate-400">Monthly Visitors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">4.8★</div>
                <div className="text-sm text-slate-400">Avg Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">100+</div>
                <div className="text-sm text-slate-400">Expert Guides</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator - only on fast connections */}
        {shouldAnimate && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        )}
      </div>

      {/* Trust Indicators */}
      <div className="bg-gradient-to-b from-slate-50 to-white py-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider mb-8">
            Featured In
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {['THE VERGE', 'TechCrunch', 'WIRED', 'Forbes', 'FastCompany'].map((logo) => (
              <div
                key={logo}
                className="text-slate-400 hover:text-slate-600 transition-colors font-bold text-lg md:text-xl grayscale hover:grayscale-0 opacity-60 hover:opacity-100"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section - Lazy loaded */}
      {!isSlowConnection && (
        <Suspense fallback={<div className="bg-white py-20 min-h-[600px]" />}>
          <FeaturesSection />
        </Suspense>
      )}

      {/* Featured Products Section */}
      <div className="bg-gradient-to-b from-slate-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
            <div className="mb-6 md:mb-0">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                {t('home.topRated')}
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl">
                {t('home.curated')}
              </p>
            </div>
            <Link
              href={getLink('/reviews')}
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border-2 border-brand-600 text-brand-600 font-semibold hover:bg-brand-600 hover:text-white transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              prefetch={true}
            >
              {t('home.viewAll')}
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product, idx) => (
              <div
                key={product.id}
                className={`transform transition-all duration-300 ${shouldAnimate ? 'hover:scale-105' : ''}`}
                style={shouldAnimate ? { animationDelay: `${idx * 100}ms` } : undefined}
              >
                <ProductCard product={product} locale={locale} />
              </div>
            ))}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link
              href={getLink('/reviews')}
              className="inline-flex items-center gap-2 text-brand-600 font-semibold hover:text-brand-700"
            >
              {t('home.viewAll')}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-brand-600 via-blue-600 to-cyan-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Protect Your Business?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Get a free quote in minutes and compare the best insurance options for your profession
          </p>
          <Link
            href={getLink('/calculator')}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-brand-600 font-bold text-lg hover:bg-slate-100 transition-all shadow-2xl transform hover:-translate-y-1 hover:scale-105"
          >
            Get Your Free Quote
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
