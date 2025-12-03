'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import StructuredData from '@/components/StructuredData';

// Extract locale from pathname
function getLocaleFromPathname(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  if (firstSegment === 'pt-BR' || firstSegment === 'en-US') {
    return firstSegment;
  }
  return 'pt-BR'; // Default
}

// Generate structured data for 404 page
function generateNotFoundStructuredData(locale: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: locale === 'pt-BR' ? 'Página Não Encontrada' : 'Page Not Found',
    description: locale === 'pt-BR'
      ? 'A página solicitada não foi encontrada'
      : 'The requested page could not be found',
    url: `${baseUrl}/${locale}/404`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: locale === 'pt-BR' ? 'Início' : 'Home',
          item: `${baseUrl}/${locale}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: locale === 'pt-BR' ? 'Produtos' : 'Products',
          item: `${baseUrl}/${locale}/products`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: locale === 'pt-BR' ? 'Artigos' : 'Articles',
          item: `${baseUrl}/${locale}/articles`,
        },
      ],
    },
  };
}

export default function NotFoundClient() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const structuredData = generateNotFoundStructuredData(locale);

  const content = {
    title: locale === 'pt-BR' ? 'Página Não Encontrada' : 'Page Not Found',
    subtitle: locale === 'pt-BR'
      ? 'Ops! A página que você está procurando não existe.'
      : "Oops! The page you're looking for doesn't exist.",
    description: locale === 'pt-BR'
      ? 'A página pode ter sido movida, removida ou o link pode estar incorreto.'
      : 'The page may have been moved, removed, or the link may be incorrect.',
    backHome: locale === 'pt-BR' ? 'Voltar para Início' : 'Back to Home',
    exploreProducts: locale === 'pt-BR' ? 'Explorar Produtos' : 'Explore Products',
    readArticles: locale === 'pt-BR' ? 'Ler Artigos' : 'Read Articles',
    popularLinks: locale === 'pt-BR' ? 'Links Populares' : 'Popular Links',
    helpfulLinks: locale === 'pt-BR' ? 'Links Úteis' : 'Helpful Links',
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center px-4 py-16">
        <div className="max-w-4xl w-full">
          {/* Main 404 Content */}
          <div className="text-center mb-12">
            {/* 404 Number with Animation */}
            <div className="relative mb-8">
              <h1 className="text-9xl md:text-[12rem] font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-blue-600 to-teal-600 animate-pulse">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 md:w-96 md:h-96 rounded-full bg-gradient-to-r from-brand-200/20 via-blue-200/20 to-teal-200/20 blur-3xl animate-pulse"></div>
              </div>
            </div>

            {/* Title and Description */}
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {content.title}
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 mb-2">
              {content.subtitle}
            </p>
            <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto">
              {content.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href={`/${locale}`}
              className="px-8 py-4 bg-gradient-to-r from-brand-600 to-blue-600 text-white font-semibold rounded-xl hover:from-brand-700 hover:to-blue-700 transition-all shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 transform hover:scale-105 duration-200 text-center"
            >
              {content.backHome}
            </Link>
            <Link
              href={`/${locale}/articles`}
              className="px-8 py-4 bg-white text-slate-700 font-semibold rounded-xl border-2 border-slate-300 hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50 transition-all shadow-md hover:shadow-lg transform hover:scale-105 duration-200 text-center"
            >
              {content.readArticles}
            </Link>
          </div>

          {/* Helpful Links Section */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 md:p-12">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
              {content.helpfulLinks}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Popular Links */}
              <div>
                <h4 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {content.popularLinks}
                </h4>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href={`/${locale}`}
                      className="text-slate-600 hover:text-brand-600 hover:underline transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      {locale === 'pt-BR' ? 'Início' : 'Home'}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${locale}/articles`}
                      className="text-slate-600 hover:text-brand-600 hover:underline transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      {locale === 'pt-BR' ? 'Artigos e Guias' : 'Articles & Guides'}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${locale}/compare`}
                      className="text-slate-600 hover:text-brand-600 hover:underline transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      {locale === 'pt-BR' ? 'Comparar Produtos' : 'Compare Products'}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${locale}/faq`}
                      className="text-slate-600 hover:text-brand-600 hover:underline transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {locale === 'pt-BR' ? 'Perguntas Frequentes' : 'FAQ'}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {locale === 'pt-BR' ? 'Recursos' : 'Resources'}
                </h4>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href={locale === 'pt-BR' ? `/${locale}/sobre-nos` : `/${locale}/about`}
                      className="text-slate-600 hover:text-brand-600 hover:underline transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {locale === 'pt-BR' ? 'Sobre Nós' : 'About Us'}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={locale === 'pt-BR' ? `/${locale}/termos-de-uso` : `/${locale}/terms-of-use`}
                      className="text-slate-600 hover:text-brand-600 hover:underline transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {locale === 'pt-BR' ? 'Termos de Uso' : 'Terms of Use'}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={locale === 'pt-BR' ? `/${locale}/politicas-e-privacidade` : `/${locale}/privacy-and-policies`}
                      className="text-slate-600 hover:text-brand-600 hover:underline transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      {locale === 'pt-BR' ? 'Políticas de Privacidade' : 'Privacy Policy'}
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={`/${locale}/reviews`}
                      className="text-slate-600 hover:text-brand-600 hover:underline transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      {locale === 'pt-BR' ? 'Avaliações' : 'Reviews'}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Search Suggestion */}
          <div className="mt-8 text-center">
            <p className="text-slate-500 mb-4">
              {locale === 'pt-BR'
                ? 'Tente usar a barra de pesquisa ou navegue pelos nossos produtos e artigos.'
                : 'Try using the search bar or browse our products and articles.'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

