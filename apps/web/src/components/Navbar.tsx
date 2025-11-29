'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '../contexts/I18nContext';
import { InsuranceMegaMenu, ComparisonMegaMenu, GuidesMegaMenu, BlogMegaMenu } from './MegaMenu';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { t, locale, changeLocale } = useTranslation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const menuRefs = {
    insurance: useRef<HTMLDivElement>(null),
    comparison: useRef<HTMLDivElement>(null),
    guides: useRef<HTMLDivElement>(null),
    blog: useRef<HTMLDivElement>(null),
  };

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

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.values(menuRefs).forEach((ref) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          setOpenMenu(null);
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = (menuName: string) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href={getLink('/')} className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-brand-600 tracking-tight">GigSafeHub</span>
            </Link>
            <div className="hidden lg:ml-8 lg:flex lg:space-x-1 items-center">
              {/* Insurance Mega Menu */}
              <div className="relative" ref={menuRefs.insurance}>
                <button
                  onClick={() => toggleMenu('insurance')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                    pathname.includes('/reviews') && pathname.includes('Insurance')
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                  }`}
                >
                  {t('nav.insurance')}
                  <svg
                    className={`w-4 h-4 transition-transform ${openMenu === 'insurance' ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openMenu === 'insurance' && (
                  <InsuranceMegaMenu locale={locale} getLink={getLink} onClose={() => setOpenMenu(null)} />
                )}
              </div>

              {/* Comparison Mega Menu */}
              <div className="relative" ref={menuRefs.comparison}>
                <button
                  onClick={() => toggleMenu('comparison')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${linkClass('/compare')}`}
                >
                  {t('nav.compare')}
                  <svg
                    className={`w-4 h-4 transition-transform ${openMenu === 'comparison' ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openMenu === 'comparison' && (
                  <ComparisonMegaMenu locale={locale} getLink={getLink} onClose={() => setOpenMenu(null)} />
                )}
              </div>

              {/* Guides Mega Menu */}
              <div className="relative" ref={menuRefs.guides}>
                <button
                  onClick={() => toggleMenu('guides')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${linkClass('/guides')}`}
                >
                  {t('nav.guides')}
                  <svg
                    className={`w-4 h-4 transition-transform ${openMenu === 'guides' ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openMenu === 'guides' && (
                  <GuidesMegaMenu locale={locale} getLink={getLink} onClose={() => setOpenMenu(null)} />
                )}
              </div>

              {/* Blog Mega Menu */}
              <div className="relative" ref={menuRefs.blog}>
                <button
                  onClick={() => toggleMenu('blog')}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${linkClass('/articles')}`}
                >
                  {t('nav.blog')}
                  <svg
                    className={`w-4 h-4 transition-transform ${openMenu === 'blog' ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openMenu === 'blog' && (
                  <BlogMegaMenu locale={locale} getLink={getLink} onClose={() => setOpenMenu(null)} />
                )}
              </div>

              <Link href={getLink('/about')} className={linkClass('/about')}>
                {t('nav.about')}
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="relative inline-flex items-center bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => changeLocale('en-US')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                  locale === 'en-US' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => changeLocale('pt-BR')}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                  locale === 'pt-BR' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                PT
              </button>
            </div>

            <Link
              href={getLink('/calculator')}
              className="hidden md:block px-4 py-2 text-sm font-bold text-white bg-brand-600 rounded-full hover:bg-brand-700 transition shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 transform hover:-translate-y-0.5"
            >
              {t('nav.getQuote')}
            </Link>

            <Link href={getLink('/admin')} className="hidden lg:block text-sm text-slate-500 hover:text-slate-900 font-medium">
              {t('nav.admin')}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Simplified */}
      <div className="lg:hidden border-t border-slate-100 bg-slate-50">
        <div className="px-4 py-3 space-y-1">
          <Link
            href={getLink('/')}
            className="block px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 hover:bg-white rounded-md"
          >
            {t('nav.home')}
          </Link>
          <Link
            href={getLink('/reviews')}
            className="block px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 hover:bg-white rounded-md"
          >
            {t('nav.insurance')}
          </Link>
          <Link
            href={getLink('/compare')}
            className="block px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 hover:bg-white rounded-md"
          >
            {t('nav.compare')}
          </Link>
          <Link
            href={getLink('/guides')}
            className="block px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 hover:bg-white rounded-md"
          >
            {t('nav.guides')}
          </Link>
          <Link
            href={getLink('/articles')}
            className="block px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 hover:bg-white rounded-md"
          >
            {t('nav.blog')}
          </Link>
          <Link
            href={getLink('/about')}
            className="block px-3 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 hover:bg-white rounded-md"
          >
            {t('nav.about')}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
