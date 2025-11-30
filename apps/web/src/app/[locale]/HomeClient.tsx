'use client';

import React, { lazy, Suspense } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import ArticleCarousel from '@/components/ArticleCarousel';
import ArticleList from '@/components/ArticleList';
import type { FinancialProduct } from '@gigsafehub/types';
import { useTranslation } from '@/contexts/I18nContext';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

// Lazy load heavy components
const FeaturesSection = lazy(() => import('./FeaturesSection'));

interface Article {
  id: string;
  slug: string;
  slugEn?: string;
  slugPt?: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  imageAlt?: string;
  date: string | Date;
  partnerTag?: string;
  readingTime?: number;
}

export default function HomeClient({
  locale,
  featuredProducts,
  carouselArticles = [],
  blogArticles = [],
}: {
  locale: string;
  featuredProducts: FinancialProduct[];
  carouselArticles?: Article[];
  blogArticles?: Article[];
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

            {/* Articles Carousel */}
            {carouselArticles && carouselArticles.length > 0 && (
              <ArticleCarousel articles={carouselArticles} locale={locale} />
            )}
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

      {/* Blog Articles Section */}
      {blogArticles && blogArticles.length > 0 && (
        <ArticleList
          articles={blogArticles}
          locale={locale}
          title={t('home.latestArticles') || 'Latest Articles & Insights'}
          showViewAll={true}
          viewAllLink={getLink('/articles')}
        />
      )}

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
