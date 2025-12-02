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
            {/* Social Media Links - Desktop */}
            <div className="hidden md:flex items-center gap-2">
              <a
                href="https://www.facebook.com/people/Gig-Safe-Hub/61584231165738/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-teal-500 transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/gigsafehub/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-teal-500 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://x.com/GigSafeHub"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-teal-500 transition-colors"
                aria-label="Twitter/X"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>

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

            {/* <Link
              href={getLink('/calculator')}
              className="hidden sm:block px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold text-white bg-orange-500 rounded-full hover:bg-orange-600 transition shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 transform hover:-translate-y-0.5"
            >
              {t('nav.getQuote')}
            </Link> */}
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

            {/* <Link
              href={getLink('/calculator')}
              onClick={closeMobileMenu}
              className="block px-3 py-2 text-sm font-bold text-white bg-orange-500 rounded-md hover:bg-orange-600 transition mt-2 text-center"
            >
              {t('nav.getQuote')}
            </Link> */}

            {/* Social Media Links - Mobile */}
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-200">
              <span className="text-sm text-slate-600 font-medium">
                {locale === 'pt-BR' ? 'Siga-nos:' : 'Follow us:'}
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.facebook.com/people/Gig-Safe-Hub/61584231165738/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-teal-500 transition-colors"
                  aria-label="Facebook"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a
                  href="https://www.instagram.com/gigsafehub/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-teal-500 transition-colors"
                  aria-label="Instagram"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a
                  href="https://x.com/GigSafeHub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-600 hover:text-teal-500 transition-colors"
                  aria-label="Twitter/X"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
