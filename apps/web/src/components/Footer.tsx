'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '../contexts/I18nContext';
import { useCategories } from '../contexts/CategoriesContext';

const Footer: React.FC = () => {
  const { locale, changeLocale } = useTranslation();
  const { categories, findBySlug, buildPath } = useCategories();
  const getLink = (path: string) => `/${locale}${path === '/' ? '' : path}`;

  // Get insurance categories for footer links
  const insuranceRoot = findBySlug(locale === 'pt-BR' ? 'seguros' : 'insurance', locale);
  const insuranceCategories = insuranceRoot
    ? categories
        .filter(cat => cat.parentId === insuranceRoot.id && cat.isActive)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .slice(0, 4)
    : [];

  // Get guides root category
  const guidesRoot = findBySlug(locale === 'pt-BR' ? 'guias' : 'guides', locale);
  const guidesPath = guidesRoot ? buildPath(guidesRoot, locale) : null;

  return (
    <footer className="bg-slate-900 text-slate-400 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Institutional */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {locale === 'pt-BR' ? 'Institucional' : 'Institutional'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href={getLink(locale === 'pt-BR' ? '/sobre-nos' : '/about')}
                  className="hover:text-white transition-colors"
                >
                  {locale === 'pt-BR' ? 'Sobre o GigSafeHub' : 'About GigSafeHub'}
                </Link>
              </li>
              <li>
                <Link
                  href={getLink(locale === 'pt-BR' ? '/sobre-nos#mission' : '/about#mission')}
                  className="hover:text-white transition-colors"
                >
                  {locale === 'pt-BR' ? 'Nossa Missão' : 'Our Mission'}
                </Link>
              </li>
              <li>
                <Link
                  href={getLink(locale === 'pt-BR' ? '/politicas-e-privacidade' : '/privacy-and-policies')}
                  className="hover:text-white transition-colors"
                >
                  {locale === 'pt-BR' ? 'Política de Privacidade' : 'Privacy Policy'}
                </Link>
              </li>
              <li>
                <Link
                  href={getLink(locale === 'pt-BR' ? '/termos-de-uso' : '/terms-of-use')}
                  className="hover:text-white transition-colors"
                >
                  {locale === 'pt-BR' ? 'Termos de Uso' : 'Terms of Use'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Insurance Categories */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {locale === 'pt-BR' ? 'Categorias de Seguros' : 'Insurance Categories'}
            </h3>
            <ul className="space-y-2 text-sm">
              {insuranceCategories.length > 0 ? (
                insuranceCategories.map((category) => {
                  const categoryPath = buildPath(category, locale);
                  const categoryLink = categoryPath ? `/${categoryPath}` : `/${category.slug}`;

                  return (
                    <li key={category.id}>
                      <Link
                        href={getLink(categoryLink)}
                        className="hover:text-white transition-colors"
                      >
                        {category.name}
                      </Link>
                    </li>
                  );
                })
              ) : (
                // Fallback links if categories not loaded
                <>
                  <li>
                    <Link
                      href={getLink(locale === 'pt-BR' ? '/seguros/seguros-para-motoristas' : '/insurance/insurance-for-drivers')}
                      className="hover:text-white transition-colors"
                    >
                  {locale === 'pt-BR' ? 'Motoristas' : 'Drivers'}
                </Link>
              </li>
              <li>
                    <Link
                      href={getLink(locale === 'pt-BR' ? '/seguros/seguros-para-entregadores' : '/insurance/insurance-for-delivery')}
                      className="hover:text-white transition-colors"
                    >
                  {locale === 'pt-BR' ? 'Entregadores' : 'Delivery Workers'}
                </Link>
              </li>
              <li>
                    <Link
                      href={getLink(locale === 'pt-BR' ? '/seguros/seguros-para-freelancers' : '/insurance/insurance-for-freelancers')}
                      className="hover:text-white transition-colors"
                    >
                  {locale === 'pt-BR' ? 'Freelancers' : 'Freelancers'}
                </Link>
              </li>
              <li>
                    <Link
                      href={getLink(locale === 'pt-BR' ? '/seguros' : '/insurance')}
                      className="hover:text-white transition-colors"
                    >
                      {locale === 'pt-BR' ? 'Ver Todos' : 'View All'}
                </Link>
              </li>
                </>
              )}
            </ul>
          </div>

          {/* Content */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {locale === 'pt-BR' ? 'Conteúdo' : 'Content'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href={getLink('/articles')} className="hover:text-white transition-colors">
                  {locale === 'pt-BR' ? 'Blog' : 'Blog'}
                </Link>
              </li>
              {guidesPath && (
              <li>
                  <Link href={getLink(`/${guidesPath}`)} className="hover:text-white transition-colors">
                  {locale === 'pt-BR' ? 'Guias' : 'Guides'}
                </Link>
              </li>
              )}
              <li>
                <Link href={getLink('/faq')} className="hover:text-white transition-colors">
                  {locale === 'pt-BR' ? 'Perguntas Frequentes' : 'FAQ'}
                </Link>
              </li>
            </ul>
          </div>

          {/* International */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {locale === 'pt-BR' ? 'Internacional' : 'International'}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => changeLocale('en-US')}
                  className={`hover:text-white transition-colors text-left ${locale === 'en-US' ? 'text-white font-semibold' : ''}`}
                  aria-label="Switch to English"
                >
                  English version
                </button>
              </li>
              <li>
                <button
                  onClick={() => changeLocale('pt-BR')}
                  className={`hover:text-white transition-colors text-left ${locale === 'pt-BR' ? 'text-white font-semibold' : ''}`}
                  aria-label="Mudar para Português"
                >
                  Português (Brasil)
                </button>
              </li>
            </ul>
            <div className="mt-6">
              <img
                src="/logo.png"
                alt="GigSafeHub"
                className="h-8 w-auto brightness-0 invert"
                loading="lazy"
              />
              <p className="mt-2 text-xs text-slate-500 max-w-xs">
                {locale === 'pt-BR'
                  ? 'Empoderando a economia gig com dados financeiros transparentes e ferramentas de segurança.'
                  : 'Empowering the gig economy with transparent financial data and safety tools.'}
              </p>

              {/* Social Media Links */}
              <div className="mt-4 flex items-center gap-3">
                <a
                  href="https://www.facebook.com/people/Gig-Safe-Hub/61584231165738/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white transition-colors"
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
                  className="text-slate-400 hover:text-white transition-colors"
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
                  className="text-slate-400 hover:text-white transition-colors"
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

        <div className="mt-12 pt-8 border-t border-slate-800 text-xs text-center">
          &copy; {new Date().getFullYear()} GigSafeHub. {locale === 'pt-BR' ? 'Todos os direitos reservados.' : 'All rights reserved.'}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
