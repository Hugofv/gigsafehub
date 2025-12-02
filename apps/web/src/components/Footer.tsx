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
