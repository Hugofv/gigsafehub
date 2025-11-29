'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '../contexts/I18nContext';
import {
  InsuranceMegaMenu,
  ComparisonMegaMenu,
  GuidesMegaMenu,
  BlogMegaMenu,
  MobileInsuranceMenu,
  MobileComparisonMenu,
  MobileGuidesMenu,
  MobileBlogMenu,
} from './MegaMenu';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { t, locale, changeLocale } = useTranslation();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(null);
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

  const toggleMobileSubmenu = (menuName: string) => {
    setMobileSubmenuOpen(mobileSubmenuOpen === menuName ? null : menuName);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileSubmenuOpen(null);
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href={getLink('/')} className="flex-shrink-0 flex items-center">
              <span className="text-xl sm:text-2xl font-bold text-brand-600 tracking-tight">GigSafeHub</span>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="ml-4 lg:hidden inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
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

          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Language Switcher */}
            <div className="relative inline-flex items-center bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => changeLocale('en-US')}
                className={`px-2 sm:px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                  locale === 'en-US' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => changeLocale('pt-BR')}
                className={`px-2 sm:px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                  locale === 'pt-BR' ? 'bg-white text-brand-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                PT
              </button>
            </div>

            <Link
              href={getLink('/calculator')}
              className="hidden sm:block px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-white bg-brand-600 rounded-full hover:bg-brand-700 transition shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 transform hover:-translate-y-0.5"
            >
              {t('nav.getQuote')}
            </Link>

            <Link href={getLink('/admin')} className="hidden lg:block text-sm text-slate-500 hover:text-slate-900 font-medium">
              {t('nav.admin')}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white">
          <div className="px-4 py-2 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <Link
              href={getLink('/')}
              onClick={closeMobileMenu}
              className={`block px-3 py-2 text-sm font-medium rounded-md ${
                isActive('/')
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
              }`}
            >
              {t('nav.home')}
            </Link>

            {/* Insurance Mobile Submenu */}
            <div>
              <button
                onClick={() => toggleMobileSubmenu('insurance')}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md ${
                  pathname.includes('/reviews')
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                }`}
              >
                <span>{t('nav.insurance')}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${mobileSubmenuOpen === 'insurance' ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileSubmenuOpen === 'insurance' && (
                <MobileInsuranceMenu locale={locale} getLink={getLink} onClose={closeMobileMenu} />
              )}
            </div>

            {/* Comparison Mobile Submenu */}
            <div>
              <button
                onClick={() => toggleMobileSubmenu('comparison')}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/compare')
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                }`}
              >
                <span>{t('nav.compare')}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${mobileSubmenuOpen === 'comparison' ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileSubmenuOpen === 'comparison' && (
                <MobileComparisonMenu locale={locale} getLink={getLink} onClose={closeMobileMenu} />
              )}
            </div>

            {/* Guides Mobile Submenu */}
            <div>
              <button
                onClick={() => toggleMobileSubmenu('guides')}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/guides')
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                }`}
              >
                <span>{t('nav.guides')}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${mobileSubmenuOpen === 'guides' ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileSubmenuOpen === 'guides' && (
                <MobileGuidesMenu locale={locale} getLink={getLink} onClose={closeMobileMenu} />
              )}
            </div>

            {/* Blog Mobile Submenu */}
            <div>
              <button
                onClick={() => toggleMobileSubmenu('blog')}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/articles')
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                }`}
              >
                <span>{t('nav.blog')}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${mobileSubmenuOpen === 'blog' ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {mobileSubmenuOpen === 'blog' && (
                <MobileBlogMenu locale={locale} getLink={getLink} onClose={closeMobileMenu} />
              )}
            </div>

            <Link
              href={getLink('/about')}
              onClick={closeMobileMenu}
              className={`block px-3 py-2 text-sm font-medium rounded-md ${
                isActive('/about')
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
              }`}
            >
              {t('nav.about')}
            </Link>

            <Link
              href={getLink('/calculator')}
              onClick={closeMobileMenu}
              className="block px-3 py-2 text-sm font-bold text-white bg-brand-600 rounded-md hover:bg-brand-700 transition mt-2 text-center"
            >
              {t('nav.getQuote')}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
