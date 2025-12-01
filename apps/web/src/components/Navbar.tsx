'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from '../contexts/I18nContext';
import { useMenu } from '../contexts/MenuContext';
import { GenericMegaMenu, GenericMobileMenu } from './MegaMenu';

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { t, locale, changeLocale } = useTranslation();
  const { menu } = useMenu();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState<string | null>(null);
  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const isActive = (path: string) => {
    const fullPath = `/${locale}${path === '/' ? '' : path}`;
    if (path === '/') return pathname === `/${locale}` || pathname === `/${locale}/`;
    return pathname.startsWith(fullPath);
  };

  const getLink = (path: string) => `/${locale}${path === '/' ? '' : path}`;

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive(path)
        ? 'bg-navy-50 text-navy-700'
        : 'text-slate-600 hover:text-teal-500 hover:bg-slate-50'
    }`;

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      // Don't close if clicking on a link (let navigation happen)
      if ((target as Element).closest('a')) {
        return;
      }
      Object.values(menuRefs).forEach((ref) => {
        if (ref.current && !ref.current.contains(target)) {
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
              <img
                src="/logo.png"
                alt="GigSafeHub"
                className="h-8 sm:h-10 w-auto"
              />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="ml-4 lg:hidden inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
            <div className="hidden lg:ml-8 lg:flex lg:space-x-1 items-center">
              {/* Dynamic Menu Items from Database */}
              {menu?.items?.map((menuItem) => {
                if (!menuItem.root) return null;

                const categorySlug = menuItem.root.slug;
                const menuKey = categorySlug.toLowerCase();
                // Use category name from database, fallback to translation if available
                const categoryName = menuItem.root.name;

                // Determine if this menu item is active based on pathname
                const isActive = pathname.includes(`/${categorySlug}`) ||
                                 pathname.includes(`/${menuItem.root.slugPt}`) ||
                                 pathname.includes(`/${menuItem.root.slugEn}`);

                return (
                  <div
                    key={menuItem.root.id}
                    className="relative"
                    ref={(el) => {
                      menuRefs.current[menuKey] = el;
                    }}
                  >
                    <button
                      onClick={() => toggleMenu(menuKey)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                        isActive
                          ? 'bg-navy-50 text-navy-700'
                          : 'text-slate-600 hover:text-teal-500 hover:bg-slate-50'
                      }`}
                    >
                      {categoryName}
                      <svg
                        className={`w-4 h-4 transition-transform ${openMenu === menuKey ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                    {openMenu === menuKey && (
                      <GenericMegaMenu
                        locale={locale}
                        getLink={getLink}
                        onClose={() => setOpenMenu(null)}
                        rootCategory={menuItem.root}
                        items={menuItem.items}
                        menuArticles={menuItem.menuArticles}
                      />
                    )}
                  </div>
                );
              })}

              <Link
                href={getLink(locale === 'pt-BR' ? '/sobre-nos' : '/about')}
                className={linkClass(locale === 'pt-BR' ? '/sobre-nos' : '/about')}
              >
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
                  locale === 'en-US'
                    ? 'bg-white text-navy-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => changeLocale('pt-BR')}
                className={`px-2 sm:px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                  locale === 'pt-BR'
                    ? 'bg-white text-navy-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                PT
              </button>
            </div>

            <Link
              href={getLink('/calculator')}
              className="hidden sm:block px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-white bg-orange-500 rounded-full hover:bg-orange-600 transition shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transform hover:-translate-y-0.5"
            >
              {t('nav.getQuote')}
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
                  ? 'bg-navy-50 text-navy-700'
                  : 'text-slate-600 hover:text-teal-500 hover:bg-slate-50'
              }`}
            >
              {t('nav.home')}
            </Link>

            {/* Dynamic Mobile Menu Items from Database */}
            {menu?.items?.map((menuItem) => {
              if (!menuItem.root) return null;

              const categorySlug = menuItem.root.slug;
              const menuKey = categorySlug.toLowerCase();
              // Use category name from database
              const categoryName = menuItem.root.name;

              // Determine if this menu item is active based on pathname
              const isActiveMenu = pathname.includes(`/${categorySlug}`) ||
                                  pathname.includes(`/${menuItem.root.slugPt}`) ||
                                  pathname.includes(`/${menuItem.root.slugEn}`);

              return (
                <div key={menuItem.root.id}>
                  <button
                    onClick={() => toggleMobileSubmenu(menuKey)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md ${
                      isActiveMenu
                        ? 'bg-navy-50 text-navy-700'
                        : 'text-slate-600 hover:text-teal-500 hover:bg-slate-50'
                    }`}
                  >
                    <span>{categoryName}</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${mobileSubmenuOpen === menuKey ? 'rotate-180' : ''}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {mobileSubmenuOpen === menuKey && (
                    <GenericMobileMenu
                      locale={locale}
                      getLink={getLink}
                      onClose={closeMobileMenu}
                      rootCategory={menuItem.root}
                      items={menuItem.items}
                      menuArticles={menuItem.menuArticles}
                    />
                  )}
                </div>
              );
            })}

            <Link
              href={getLink(locale === 'pt-BR' ? '/sobre-nos' : '/about')}
              onClick={closeMobileMenu}
              className={`block px-3 py-2 text-sm font-medium rounded-md ${
                isActive(locale === 'pt-BR' ? '/sobre-nos' : '/about')
                  ? 'bg-navy-50 text-navy-700'
                  : 'text-slate-600 hover:text-teal-500 hover:bg-slate-50'
              }`}
            >
              {t('nav.about')}
            </Link>

            <Link
              href={getLink('/calculator')}
              onClick={closeMobileMenu}
              className="block px-3 py-2 text-sm font-bold text-white bg-orange-500 rounded-md hover:bg-orange-600 transition mt-2 text-center"
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
