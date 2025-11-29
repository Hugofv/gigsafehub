'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from '../contexts/I18nContext';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { t, locale, changeLocale } = useTranslation();

  const isActive = (path: string) => {
    const fullPath = `/${locale}${path === '/' ? '' : path}`;
    if (path === '/') return pathname === `/${locale}` || pathname === `/${locale}/`;
    return pathname.startsWith(fullPath);
  };

  const getLink = (path: string) => `/${locale}${path === '/' ? '' : path}`;

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive(path)
        ? 'bg-brand-50 text-brand-700'
        : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
    }`;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href={getLink('/')} className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-brand-600 tracking-tight">GigSafeHub</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4 items-center">
              <Link href={getLink('/')} className={linkClass('/')}>{t('nav.home')}</Link>
              <Link href={getLink('/articles')} className={linkClass('/articles')}>{t('nav.articles')}</Link>
              <Link href={getLink('/reviews')} className={linkClass('/reviews')}>{t('nav.reviews')}</Link>
              <Link href={getLink('/compare')} className={linkClass('/compare')}>{t('nav.compare')}</Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
             {/* Language Switcher */}
             <div className="relative inline-flex items-center bg-slate-100 rounded-lg p-1">
                <button
                    onClick={() => changeLocale('en-US')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${locale === 'en-US' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    EN
                </button>
                <button
                    onClick={() => changeLocale('pt-BR')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${locale === 'pt-BR' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    PT
                </button>
             </div>

             <Link href={getLink('/calculator')} className="hidden md:block px-4 py-2 text-sm font-bold text-white bg-brand-600 rounded-full hover:bg-brand-700 transition">
                {t('nav.getQuote')}
             </Link>
            <Link href="/admin" className="text-sm text-slate-500 hover:text-slate-900 font-medium">
              {t('nav.admin')}
            </Link>
          </div>
        </div>
      </div>
      {/* Mobile Menu Placeholder */}
      <div className="sm:hidden flex justify-around py-2 border-t border-slate-100 bg-slate-50">
          <Link href={getLink('/')} className="text-xs text-slate-600">{t('nav.home')}</Link>
          <Link href={getLink('/articles')} className="text-xs text-slate-600">{t('nav.articles')}</Link>
          <Link href={getLink('/reviews')} className="text-xs text-slate-600">{t('nav.reviews')}</Link>
      </div>
    </nav>
  );
};

export default Navbar;

