'use client';

import React from 'react';
import Link from 'next/link';
import ArticleCarousel from '@/components/ArticleCarousel';
import ArticleList from '@/components/ArticleList';
import StructuredData, { generateFAQStructuredData } from '@/components/StructuredData';
import type { FinancialProduct } from '@gigsafehub/types';
import { useTranslation } from '@/contexts/I18nContext';
import { useCategories } from '@/contexts/CategoriesContext';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

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
  featuredProducts: _featuredProducts,
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
  const { categories, findBySlug, getByParent, buildPath } = useCategories();
  const getLink = (path: string) => `/${locale}${path}`;

  // Reduce animations on slow connections
  const shouldAnimate = !isSlowConnection && !saveData;

  // Get insurance categories for the "Types of Insurance" section
  const insuranceRoot = findBySlug(locale === 'pt-BR' ? 'seguros' : 'insurance', locale);
  const insuranceCategories = insuranceRoot ? getByParent(insuranceRoot.id).sort((a, b) => (a.order || 0) - (b.order || 0)).slice(0, 4) : [];

  // FAQ data for structured data
  const faqs = locale === 'pt-BR' ? [
    {
      question: 'O que é seguro para motoristas de aplicativo?',
      answer: 'Seguro para motoristas de aplicativo é uma apólice de seguro veicular especializada que cobre motoristas que trabalham com plataformas como Uber, 99, iFood e outras. Este tipo de seguro oferece cobertura adicional além do seguro básico, protegendo o motorista durante o período em que está trabalhando.',
    },
    {
      question: 'Qual a diferença entre seguro pessoal e seguro para aplicativo?',
      answer: 'O seguro pessoal cobre apenas o uso particular do veículo. O seguro para aplicativo oferece cobertura específica para quando o motorista está trabalhando, incluindo período online na plataforma, transporte de passageiros ou entregas. Muitas seguradoras tradicionais não cobrem acidentes durante o trabalho.',
    },
    {
      question: 'Freelancers precisam de seguro?',
      answer: 'Sim, freelancers devem considerar seguro de responsabilidade profissional e geral, especialmente se trabalham com clientes ou prestam serviços. Isso protege contra reclamações, erros profissionais e outros riscos do trabalho autônomo.',
    },
    // {
    //   question: 'Como comparar seguros para gig economy?',
    //   answer: 'Use nosso comparador para avaliar cobertura, preços, assistência 24h, facilidade de sinistros e reputação das seguradoras. Compare múltiplas opções lado a lado para encontrar a melhor proteção para seu perfil e orçamento.',
    // },
    {
      question: 'Quanto custa seguro para motoristas de aplicativo?',
      answer: 'O custo varia conforme o tipo de veículo, uso, localização e cobertura escolhida. Geralmente, seguros especializados para aplicativos podem custar entre R$ 150 a R$ 400 por mês, dependendo dos fatores mencionados.',
    },
  ] : [
    {
      question: 'What is rideshare insurance?',
      answer: 'Rideshare insurance is specialized vehicle insurance coverage for drivers who work with platforms like Uber, Lyft, DoorDash, and others. This type of insurance provides additional coverage beyond basic auto insurance, protecting the driver while they are working.',
    },
    {
      question: 'What is the difference between personal insurance and rideshare insurance?',
      answer: 'Personal insurance covers only private vehicle use. Rideshare insurance provides specific coverage for when the driver is working, including the period when online on the platform, transporting passengers, or making deliveries. Many traditional insurers do not cover accidents during work.',
    },
    {
      question: 'Do freelancers need insurance?',
      answer: 'Yes, freelancers should consider professional and general liability insurance, especially if they work with clients or provide services. This protects against claims, professional errors, and other risks of independent work.',
    },
    // {
    //   question: 'How to compare insurance for gig economy?',
    //   answer: 'Use our comparator to evaluate coverage, prices, 24/7 assistance, ease of claims, and insurer reputation. Compare multiple options side by side to find the best protection for your profile and budget.',
    // },
    {
      question: 'How much does rideshare insurance cost?',
      answer: 'Cost varies based on vehicle type, usage, location, and chosen coverage. Generally, specialized rideshare insurance can cost between $50 to $200 per month, depending on the mentioned factors.',
    },
  ];

  return (
    <>
      <StructuredData data={generateFAQStructuredData(faqs)} />
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-brand-900 via-brand-800 to-slate-900 overflow-hidden">
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
                <span className="text-sm font-medium text-brand-200">
                  {locale === 'pt-BR' ? 'Confiado por mais de 10.000 freelancers' : 'Trusted by 10,000+ freelancers'}
                </span>
              </div>

              <h1 className={`text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 ${shouldAnimate ? 'animate-fade-in-up' : ''}`}>
                {locale === 'pt-BR' ? (
                  <>
                    Seguros e Proteção para{' '}
                    <span className="bg-gradient-to-r from-brand-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      Trabalhadores da Gig Economy
                    </span>
                  </>
                ) : (
                  <>
                    Insurance and Protection for{' '}
                    <span className="bg-gradient-to-r from-brand-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      Gig Economy Workers
                    </span>
                  </>
                )}
              </h1>

              <p className={`mt-6 max-w-3xl mx-auto text-xl md:text-2xl text-slate-300 leading-relaxed ${shouldAnimate ? 'animate-fade-in-up delay-100' : ''}`}>
                {locale === 'pt-BR'
                  ? 'Encontre proteção financeira e descubra as melhores opções para motoristas de aplicativo, entregadores, freelancers e nômades digitais. Guias especializados e recomendações personalizadas.'
                  : 'Find financial protection and discover the best options for rideshare drivers, delivery workers, freelancers and digital nomads. Specialized guides and personalized recommendations.'}
              </p>

              <div className={`mt-12 flex flex-col sm:flex-row justify-center gap-4 ${shouldAnimate ? 'animate-fade-in-up delay-200' : ''}`}>
                {/* CTA de cotação comentado - funcionalidade ainda não está pronta */}
                {/* <Link
                  href={getLink('/calculator')}
                  className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold text-lg hover:from-brand-400 hover:to-brand-500 transition-all shadow-2xl shadow-brand-500/50 transform hover:-translate-y-1 hover:scale-105 overflow-hidden"
                  aria-label={locale === 'pt-BR' ? 'Iniciar cotação grátis de seguro' : 'Start free insurance quote'}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {t('home.cta')}
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-400 to-brand-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link> */}

                <Link
                  href={getLink('/articles')}
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold text-lg hover:from-brand-400 hover:to-brand-500 transition-all shadow-2xl shadow-brand-500/50 transform hover:-translate-y-1 hover:scale-105"
                  aria-label={locale === 'pt-BR' ? 'Ler guias e artigos' : 'Read guides and articles'}
                >
                  {t('home.readGuides')}
                </Link>
              </div>

              {/* Articles Carousel */}
              {carouselArticles && carouselArticles.length > 0 && (
                <div className="mt-16">
                  <ArticleCarousel articles={carouselArticles} locale={locale} />
                </div>
              )}
            </div>
          </div>

          {/* Scroll indicator - only on fast connections */}
          {shouldAnimate && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce" aria-hidden="true">
              <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          )}
        </section>

        {/* What is Gig Economy Section */}
        <section className="py-20 bg-white" aria-labelledby="gig-economy-heading">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 id="gig-economy-heading" className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                {locale === 'pt-BR' ? 'O que é a Gig Economy?' : 'What is the Gig Economy?'}
              </h2>
            </div>

            <div className="prose prose-lg max-w-none prose-slate">
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                {locale === 'pt-BR' ? (
                  <>
                    A <strong>Gig Economy</strong> (ou economia sob demanda) é um modelo econômico baseado em trabalhos temporários,
                    freelancers e contratos independentes. Neste modelo, trabalhadores oferecem seus serviços através de plataformas
                    digitais, como aplicativos de transporte (Uber, 99), entrega (iFood, Rappi) ou serviços profissionais (Upwork, Fiverr).
                  </>
                ) : (
                  <>
                    The <strong>Gig Economy</strong> (or on-demand economy) is an economic model based on temporary work,
                    freelancers, and independent contracts. In this model, workers offer their services through digital platforms,
                    such as transportation apps (Uber, Lyft), delivery (DoorDash, Instacart), or professional services (Upwork, Fiverr).
                  </>
                )}
              </p>

              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                {locale === 'pt-BR' ? (
                  <>
                    Trabalhadores da gig economy incluem <strong>motoristas de aplicativo</strong>, <strong>entregadores</strong>,
                    <strong>freelancers</strong>, <strong>consultores</strong> e <strong>nômades digitais</strong>. Estes profissionais
                    enfrentam desafios únicos de proteção financeira, pois não têm os benefícios tradicionais de empregados formais,
                    como seguro de saúde, seguro de vida ou proteção contra invalidez.
                  </>
                ) : (
                  <>
                    Gig economy workers include <strong>rideshare drivers</strong>, <strong>delivery workers</strong>,
                    <strong>freelancers</strong>, <strong>consultants</strong>, and <strong>digital nomads</strong>. These professionals
                    face unique financial protection challenges, as they don't have traditional employee benefits like health insurance,
                    life insurance, or disability protection.
                  </>
                )}
              </p>

              <p className="text-lg text-slate-700 leading-relaxed">
                {locale === 'pt-BR' ? (
                  <>
                    Por isso, é essencial que trabalhadores da gig economy tenham acesso a <strong>seguros especializados</strong> que
                    protejam sua renda, veículos, equipamentos e responsabilidade profissional. O GigSafeHub foi criado para ajudar
                    esses trabalhadores a encontrar a proteção ideal para suas necessidades específicas.
                  </>
                ) : (
                  <>
                    Therefore, it is essential that gig economy workers have access to <strong>specialized insurance</strong> that
                    protects their income, vehicles, equipment, and professional liability. GigSafeHub was created to help these workers
                    find the ideal protection for their specific needs.
                  </>
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Types of Insurance for Gig Workers Section */}
        <section className="py-20 bg-slate-50" aria-labelledby="insurance-types-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 id="insurance-types-heading" className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                {locale === 'pt-BR'
                  ? 'Tipos de Seguros para Trabalhadores da Gig Economy'
                  : 'Types of Insurance for Gig Economy Workers'}
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                {locale === 'pt-BR'
                  ? 'Descubra os principais tipos de seguro disponíveis para proteger sua renda e negócio na gig economy'
                  : 'Discover the main types of insurance available to protect your income and business in the gig economy'}
              </p>
            </div>

            {insuranceCategories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {insuranceCategories.map((category) => {
                  const categoryPath = buildPath(category, locale);
                  const categoryLink = categoryPath ? `/${categoryPath}` : `/${category.slug}`;

                  return (
                    <Link
                      key={category.id}
                      href={getLink(categoryLink)}
                      className="group bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg hover:border-brand-300 transition-all"
                    >
                      <div className="flex flex-col h-full">
                        <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-brand-200 transition-colors">
                          <svg className="w-6 h-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors">
                          {category.name}
                        </h3>
                        {category.description && (
                          <p className="text-slate-600 text-sm mb-4 flex-grow">
                            {category.description.length > 100
                              ? `${category.description.substring(0, 100)}...`
                              : category.description}
                          </p>
                        )}
                        <span className="text-brand-600 font-semibold text-sm group-hover:underline inline-flex items-center gap-1">
                          {locale === 'pt-BR' ? 'Ver opções' : 'View options'}
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Fallback insurance types if categories not loaded */}
                {[
                  {
                    name: locale === 'pt-BR' ? 'Seguro para Motoristas' : 'Driver Insurance',
                    description: locale === 'pt-BR'
                      ? 'Proteção especializada para motoristas de aplicativo como Uber e 99'
                      : 'Specialized protection for rideshare drivers like Uber and Lyft',
                    link: '/insurance/insurance-for-drivers',
                  },
                  {
                    name: locale === 'pt-BR' ? 'Seguro para Entregadores' : 'Delivery Insurance',
                    description: locale === 'pt-BR'
                      ? 'Cobertura para entregadores de comida e produtos'
                      : 'Coverage for food and product delivery workers',
                    link: '/insurance/insurance-for-delivery',
                  },
                  {
                    name: locale === 'pt-BR' ? 'Seguro para Freelancers' : 'Freelancer Insurance',
                    description: locale === 'pt-BR'
                      ? 'Proteção profissional e de responsabilidade para freelancers'
                      : 'Professional and liability protection for freelancers',
                    link: '/insurance/insurance-for-freelancers',
                  },
                  {
                    name: locale === 'pt-BR' ? 'Seguro de Responsabilidade' : 'Liability Insurance',
                    description: locale === 'pt-BR'
                      ? 'Proteção contra reclamações e responsabilidade civil'
                      : 'Protection against claims and civil liability',
                    link: '/insurance',
                  },
                ].map((type, index) => (
                  <Link
                    key={index}
                    href={getLink(type.link)}
                    className="group bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-lg hover:border-brand-300 transition-all"
                  >
                    <div className="flex flex-col h-full">
                      <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-brand-200 transition-colors">
                        <svg className="w-6 h-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors">
                        {type.name}
                      </h3>
                      <p className="text-slate-600 text-sm mb-4 flex-grow">
                        {type.description}
                      </p>
                      <span className="text-brand-600 font-semibold text-sm group-hover:underline inline-flex items-center gap-1">
                        {locale === 'pt-BR' ? 'Ver opções' : 'View options'}
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <div className="mt-12 text-center">
              <Link
                href={getLink(locale === 'pt-BR' ? '/seguros' : '/insurance')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors"
              >
                {locale === 'pt-BR' ? 'Ver todos os tipos de seguro' : 'View all insurance types'}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Smart Comparator Section - Comentado: funcionalidade ainda não está pronta */}
        {/* <section className="py-20 bg-white" aria-labelledby="comparator-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 id="comparator-heading" className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                  {locale === 'pt-BR'
                    ? 'Comparador Inteligente de Seguros'
                    : 'Smart Insurance Comparator'}
                </h2>
                <p className="text-xl text-slate-600 mb-6">
                  {locale === 'pt-BR'
                    ? 'Compare múltiplas opções de seguro lado a lado com nosso comparador avançado. Avalie cobertura, preços, assistência 24h e reputação das seguradoras em uma única tela.'
                    : 'Compare multiple insurance options side by side with our advanced comparator. Evaluate coverage, prices, 24/7 assistance, and insurer reputation in a single screen.'}
                </p>
                <ul className="space-y-4 mb-8">
                  {[
                    locale === 'pt-BR' ? 'Comparação lado a lado de coberturas' : 'Side-by-side coverage comparison',
                    locale === 'pt-BR' ? 'Análise de preços e custo-benefício' : 'Price and cost-benefit analysis',
                    locale === 'pt-BR' ? 'Avaliação de assistência e suporte' : 'Assistance and support evaluation',
                    locale === 'pt-BR' ? 'Reputação e avaliações de seguradoras' : 'Insurer reputation and ratings',
                  ].map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-brand-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate-700 text-lg">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={getLink(locale === 'pt-BR' ? '/comparador' : '/comparisons')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors"
                >
                  {locale === 'pt-BR' ? 'Acessar Comparador' : 'Access Comparator'}
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
              <div className="bg-gradient-to-br from-brand-50 to-blue-50 rounded-2xl p-8 border border-brand-200">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">
                        {locale === 'pt-BR' ? 'Compare até 3 seguros' : 'Compare up to 3 insurances'}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {locale === 'pt-BR' ? 'Análise detalhada lado a lado' : 'Detailed side-by-side analysis'}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[1, 2, 3].map((num) => (
                      <div key={num} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          {num}
                        </div>
                        <div className="flex-1">
                          <div className="h-3 bg-slate-200 rounded w-3/4 mb-2"></div>
                          <div className="h-2 bg-slate-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {/* Our Guides and Popular Content Section */}
        {blogArticles && blogArticles.length > 0 && (
          <section className="py-20 bg-slate-50" aria-labelledby="guides-heading">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 id="guides-heading" className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                  {locale === 'pt-BR'
                    ? 'Nossos Guias e Conteúdos Populares'
                    : 'Our Guides and Popular Content'}
                </h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  {locale === 'pt-BR'
                    ? 'Acesse guias especializados, artigos e comparações criados por especialistas para ajudá-lo a tomar decisões informadas sobre seguros e proteção financeira.'
                    : 'Access specialized guides, articles, and comparisons created by experts to help you make informed decisions about insurance and financial protection.'}
                </p>
              </div>
              <ArticleList
                articles={blogArticles}
                locale={locale}
                title=""
                showViewAll={true}
                viewAllLink={getLink('/articles')}
              />
            </div>
          </section>
        )}

        {/* How GigSafeHub Works Section */}
        <section className="py-20 bg-white" aria-labelledby="how-it-works-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 id="how-it-works-heading" className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                {locale === 'pt-BR' ? 'Como Funciona o GigSafeHub' : 'How GigSafeHub Works'}
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                {locale === 'pt-BR'
                  ? 'Encontre a proteção ideal para seu negócio em três passos simples'
                  : 'Find the ideal protection for your business in three simple steps'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-brand-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-6">
                    1
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {locale === 'pt-BR' ? 'Explore Guias e Artigos' : 'Explore Guides and Articles'}
                  </h3>
                  <p className="text-slate-600">
                    {locale === 'pt-BR'
                      ? 'Navegue por diferentes tipos de seguro e acesse guias especializados. Aprenda sobre coberturas, proteção financeira e como proteger sua renda na gig economy.'
                      : 'Browse different insurance types and access specialized guides. Learn about coverage, financial protection, and how to protect your income in the gig economy.'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-brand-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-6">
                  2
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {locale === 'pt-BR' ? 'Aprenda e Decida' : 'Learn and Decide'}
                </h3>
                <p className="text-slate-600">
                  {locale === 'pt-BR'
                    ? 'Acesse artigos detalhados e guias práticos criados por especialistas. Aprenda sobre tipos de seguro, coberturas necessárias e tome decisões informadas sobre proteção financeira.'
                    : 'Access detailed articles and practical guides created by experts. Learn about insurance types, necessary coverage, and make informed decisions about financial protection.'}
                </p>
              </div>

              {/* Passo 3 comentado - relacionado a cotação/contratação */}
              {/* <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-brand-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-6">
                  3
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {locale === 'pt-BR' ? 'Contrate com Confiança' : 'Contract with Confidence'}
                </h3>
                <p className="text-slate-600">
                  {locale === 'pt-BR'
                    ? 'Tome uma decisão informada baseada em análises imparciais e contrate o seguro ideal diretamente com a seguradora ou parceiro autorizado. Nós facilitamos a comparação, você escolhe a melhor opção.'
                    : 'Make an informed decision based on unbiased analysis and contract the ideal insurance directly with the insurer or authorized partner. We facilitate the comparison, you choose the best option.'}
                </p>
              </div> */}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-slate-50" aria-labelledby="faq-heading">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 id="faq-heading" className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
                {locale === 'pt-BR' ? 'Perguntas Frequentes' : 'Frequently Asked Questions'}
              </h2>
              <p className="text-xl text-slate-600">
                {locale === 'pt-BR'
                  ? 'Tire suas dúvidas sobre seguros para trabalhadores da gig economy'
                  : 'Get answers to your questions about insurance for gig economy workers'}
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
                >
                  <summary className="font-semibold text-slate-900 cursor-pointer text-lg mb-2">
                    {faq.question}
                  </summary>
                  <p className="text-slate-600 mt-4 leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Link
                href={getLink('/faq')}
                className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-semibold"
              >
                {locale === 'pt-BR' ? 'Ver todas as perguntas' : 'View all questions'}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section - Comentado: funcionalidade de cotação ainda não está pronta */}
        {/* <section className="bg-gradient-to-r from-brand-600 via-blue-600 to-cyan-600 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {locale === 'pt-BR'
                ? 'Pronto para Proteger seu Negócio?'
                : 'Ready to Protect Your Business?'}
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              {locale === 'pt-BR'
                ? 'Obtenha uma cotação gratuita em minutos e compare as melhores opções de seguro para sua profissão'
                : 'Get a free quote in minutes and compare the best insurance options for your profession'}
            </p>
            <Link
              href={getLink('/calculator')}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-brand-600 font-bold text-lg hover:bg-slate-100 transition-all shadow-2xl transform hover:-translate-y-1 hover:scale-105"
              aria-label={locale === 'pt-BR' ? 'Obter cotação gratuita' : 'Get free quote'}
            >
              {locale === 'pt-BR' ? 'Obter Cotação Grátis' : 'Get Your Free Quote'}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </section> */}
      </div>
    </>
  );
}
