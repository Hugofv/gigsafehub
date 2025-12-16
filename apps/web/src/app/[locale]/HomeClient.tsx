'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ArticleCarousel from '@/components/ArticleCarousel';
import ArticleList from '@/components/ArticleList';
import StructuredData, { generateFAQStructuredData } from '@/components/StructuredData';
import type { FinancialProduct } from '@gigsafehub/types';
import { useTranslation } from '@/contexts/I18nContext';
import { useCategories } from '@/contexts/CategoriesContext';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useToast } from '@/contexts/ToastContext';
import { trackSimulatorCTAClick } from '@/lib/analytics';

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
  const toast = useToast();
  const getLink = (path: string) => `/${locale}${path}`;
  const [toastShown, setToastShown] = useState(false);

  // Reduce animations on slow connections
  const shouldAnimate = !isSlowConnection && !saveData;

  // Show toast after user has been on page for a few seconds
  useEffect(() => {
    // Don't show on slow connections or if already shown
    if (isSlowConnection || saveData || toastShown) return;

    // Check if toast was already shown in this session
    const toastShownInSession = sessionStorage.getItem('home-toast-shown');
    if (toastShownInSession) return;

    // Show toast after 5 seconds
    const timer = setTimeout(() => {
      const message = locale === 'pt-BR'
        ? '⚠️ Descubra seus riscos em 2 minutos'
        : '⚠️ Discover your risks in 2 minutes';

      const linkText = locale === 'pt-BR' ? 'Ver artigos' : 'View articles';
      const articlesLink = getLink('/articles');

      toast.warning(message, 8000, articlesLink, linkText); // Show for 8 seconds with link
      setToastShown(true);
      sessionStorage.setItem('home-toast-shown', 'true');
    }, 5000);

    return () => clearTimeout(timer);
  }, [locale, toast, isSlowConnection, saveData, toastShown]);

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

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
            <div className="text-center">
              {/* Trust Badges */}
              <div className={`flex flex-wrap items-center justify-center gap-3 mb-6 ${shouldAnimate ? 'animate-fade-in' : ''}`}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/20 backdrop-blur-sm border border-brand-400/30">
                  <span className={`w-2 h-2 bg-brand-400 rounded-full ${shouldAnimate ? 'animate-pulse' : ''}`}></span>
                  <span className="text-sm font-medium text-brand-200">
                    {locale === 'pt-BR' ? 'Conteúdo Verificado' : 'Verified Content'}
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 backdrop-blur-sm border border-green-400/30">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-green-200">
                    {locale === 'pt-BR' ? '100% Gratuito' : '100% Free'}
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 backdrop-blur-sm border border-blue-400/30">
                  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-blue-200">
                    {locale === 'pt-BR' ? 'Atualizado Regularmente' : 'Regularly Updated'}
                  </span>
                </div>
              </div>

              <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 ${shouldAnimate ? 'animate-fade-in-up' : ''}`}>
                {locale === 'pt-BR' ? (
                  <>
                    Você Sabe Quanto Está{' '}
                    <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                      Descoberto?
                    </span>
                  </>
                ) : (
                  <>
                    Do You Know How{' '}
                    <span className="bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                      Exposed You Are?
                    </span>
                  </>
                )}
              </h1>

              <p className={`mt-4 max-w-2xl mx-auto text-lg sm:text-xl md:text-2xl text-slate-200 leading-relaxed ${shouldAnimate ? 'animate-fade-in-up delay-100' : ''}`}>
                {locale === 'pt-BR'
                  ? 'Descubra quanto você está deixando de ganhar e quanto está em risco sem a proteção adequada. Aprenda como proteger sua renda, veículos e responsabilidade profissional com guias práticos criados por especialistas.'
                  : 'Discover how much you\'re losing and how much you\'re at risk without proper protection. Learn how to protect your income, vehicles, and professional liability with practical guides created by experts.'}
              </p>

              {/* Social Proof - Quick Stats */}
              {blogArticles && blogArticles.length > 0 && (
                <div className={`mt-6 flex items-center justify-center gap-6 text-sm text-slate-300 ${shouldAnimate ? 'animate-fade-in-up delay-150' : ''}`}>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-brand-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{blogArticles.length}+ {locale === 'pt-BR' ? 'Guias Disponíveis' : 'Guides Available'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{locale === 'pt-BR' ? 'Sem Cadastro' : 'No Signup'}</span>
                  </div>
                </div>
              )}

              <div className={`mt-10 flex flex-col sm:flex-row justify-center gap-4 ${shouldAnimate ? 'animate-fade-in-up delay-200' : ''}`}>
                <Link
                  href={getLink('/articles')}
                  className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold text-lg hover:from-brand-400 hover:to-brand-500 transition-all shadow-2xl shadow-brand-500/50 transform hover:-translate-y-1 hover:scale-105"
                  aria-label={locale === 'pt-BR' ? 'Ler guias e artigos' : 'Read guides and articles'}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {t('home.readGuides')}
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>

                <Link
                  href={getLink(locale === 'pt-BR' ? '/seguros' : '/insurance')}
                  className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-lg hover:bg-white/20 transition-all shadow-xl transform hover:-translate-y-1 hover:scale-105"
                  aria-label={locale === 'pt-BR' ? 'Explorar seguros' : 'Explore insurance'}
                >
                  {locale === 'pt-BR' ? 'Explorar Seguros' : 'Explore Insurance'}
                </Link>
              </div>

              {/* Quick Stats */}
              <div className={`mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto ${shouldAnimate ? 'animate-fade-in-up delay-300' : ''}`}>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">20+</div>
                  <div className="text-sm text-slate-300">{locale === 'pt-BR' ? 'Guias Especializados' : 'Specialized Guides'}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">100%</div>
                  <div className="text-sm text-slate-300">{locale === 'pt-BR' ? 'Gratuito' : 'Free'}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">24/7</div>
                  <div className="text-sm text-slate-300">{locale === 'pt-BR' ? 'Acesso Ilimitado' : 'Unlimited Access'}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">✓</div>
                  <div className="text-sm text-slate-300">{locale === 'pt-BR' ? 'Por Especialistas' : 'By Experts'}</div>
                </div>
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

        {/* Urgency Callout */}
        <section className="py-8 bg-gradient-to-r from-red-600 to-orange-600 -mt-8 relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p className="text-white text-lg md:text-xl font-bold">
                {locale === 'pt-BR'
                  ? '⚠️ Você está trabalhando sem proteção? Descubra quanto está em risco e como se proteger em minutos.'
                  : '⚠️ Are you working without protection? Discover how much you\'re at risk and how to protect yourself in minutes.'}
              </p>
            </div>
          </div>
        </section>

        {/* Why You Need Protection - Value Proposition - MOVED UP */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 relative z-20" aria-labelledby="why-protection-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 id="why-protection-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3">
                {locale === 'pt-BR' ? 'Quanto Você Está Perdendo Sem Proteção?' : 'How Much Are You Losing Without Protection?'}
              </h2>
              <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-semibold">
                {locale === 'pt-BR'
                  ? 'Um único acidente ou processo pode acabar com meses de trabalho. Descubra os riscos reais que você enfrenta todos os dias.'
                  : 'A single accident or lawsuit can wipe out months of work. Discover the real risks you face every day.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-red-200 hover:border-red-400 transition-all">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {locale === 'pt-BR' ? 'Você Está 100% Descoberto' : 'You Are 100% Exposed'}
                </h3>
                <p className="text-slate-600 mb-3">
                  {locale === 'pt-BR'
                    ? 'Sem seguro de saúde, vida ou invalidez. Um acidente pode custar tudo que você ganhou em meses.'
                    : 'No health, life, or disability insurance. One accident can cost everything you\'ve earned in months.'}
                </p>
                <div className="text-red-600 font-bold text-sm">
                  {locale === 'pt-BR' ? '💰 Risco: R$ 0 a R$ 50.000+' : '💰 Risk: $0 to $50,000+'}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-orange-200 hover:border-orange-400 transition-all">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {locale === 'pt-BR' ? 'Um Processo Pode Arruinar Tudo' : 'One Lawsuit Can Ruin Everything'}
                </h3>
                <p className="text-slate-600 mb-3">
                  {locale === 'pt-BR'
                    ? 'Responsabilidade civil, acidentes de trabalho e perda de equipamentos. Sem proteção, você paga do próprio bolso.'
                    : 'Liability, work accidents, and equipment loss. Without protection, you pay out of pocket.'}
                </p>
                <div className="text-orange-600 font-bold text-sm">
                  {locale === 'pt-BR' ? '⚖️ Risco: R$ 10.000 a R$ 200.000+' : '⚖️ Risk: $10,000 to $200,000+'}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-yellow-200 hover:border-yellow-400 transition-all">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {locale === 'pt-BR' ? 'Renda Parada = Dinheiro Perdido' : 'Stopped Income = Lost Money'}
                </h3>
                <p className="text-slate-600 mb-3">
                  {locale === 'pt-BR'
                    ? 'Uma emergência interrompe sua renda sem rede de segurança. Cada dia parado é dinheiro que você nunca mais verá.'
                    : 'An emergency interrupts your income without a safety net. Each day stopped is money you\'ll never see again.'}
                </p>
                <div className="text-yellow-600 font-bold text-sm">
                  {locale === 'pt-BR' ? '📉 Risco: R$ 200 a R$ 2.000/dia' : '📉 Risk: $200 to $2,000/day'}
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <Link
                href={getLink('/articles')}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-lg hover:from-red-700 hover:to-orange-700 transition-all shadow-2xl transform hover:-translate-y-1 hover:scale-105"
              >
                {locale === 'pt-BR' ? 'Descobrir Meus Riscos Agora' : 'Discover My Risks Now'}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Free Tools Section */}
        <section className="py-12 md:py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-navy-900 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-orange-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-500/20 text-teal-400 text-sm font-medium mb-4">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                {locale === 'pt-BR' ? 'Ferramentas Gratuitas' : 'Free Tools'}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                {locale === 'pt-BR'
                  ? 'Tome Decisões Mais Inteligentes'
                  : 'Make Smarter Decisions'}
              </h2>
              <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                {locale === 'pt-BR'
                  ? 'Calculadoras gratuitas para você entender seus ganhos reais e proteger sua renda.'
                  : 'Free calculators to help you understand your real earnings and protect your income.'}
              </p>
            </div>

            {/* Tools Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Loss Income Simulator Card */}
              <Link
                href={getLink(locale === 'pt-BR' ? '/ferramentas/simulador-perda-renda' : '/tools/loss-income-simulator')}
                className="group relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-orange-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/10"
                onClick={() => trackSimulatorCTAClick('homepage_tools_card')}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex gap-5">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                      {locale === 'pt-BR' ? 'Simulador de Perda de Renda' : 'Loss Income Simulator'}
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">
                      {locale === 'pt-BR'
                        ? 'Calcule quanto você perderia se ficasse sem trabalhar por acidente ou doença.'
                        : 'Calculate how much you would lose if you couldn\'t work due to accident or illness.'}
                    </p>
                    <div className="flex items-center text-orange-400 text-sm font-semibold">
                      {locale === 'pt-BR' ? 'Simular Agora' : 'Simulate Now'}
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
                {/* Mini Preview */}
                <div className="mt-5 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {locale === 'pt-BR' ? 'Perda Estimada' : 'Estimated Loss'}
                    </span>
                    <span className="text-lg font-bold text-white">
                      {locale === 'pt-BR' ? 'R$ ???' : '$ ???'}
                    </span>
                  </div>
                  <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                  </div>
                </div>
              </Link>

              {/* Daily Profit Calculator Card */}
              <Link
                href={getLink(locale === 'pt-BR' ? '/ferramentas/calculadora-lucro-diario' : '/tools/daily-profit-calculator')}
                className="group relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-emerald-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/10"
                onClick={() => trackSimulatorCTAClick('homepage_profit_card')}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex gap-5">
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                      {locale === 'pt-BR' ? 'Calculadora de Lucro Real' : 'Daily Profit Calculator'}
                    </h3>
                    <p className="text-slate-400 text-sm mb-4">
                      {locale === 'pt-BR'
                        ? 'Descubra quanto você realmente ganha por hora após todas as despesas.'
                        : 'Discover how much you really earn per hour after all expenses.'}
                    </p>
                    <div className="flex items-center text-emerald-400 text-sm font-semibold">
                      {locale === 'pt-BR' ? 'Calcular Agora' : 'Calculate Now'}
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
                {/* Mini Preview */}
                <div className="mt-5 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {locale === 'pt-BR' ? 'Ganho Real/Hora' : 'Real Hourly Rate'}
                    </span>
                    <span className="text-lg font-bold text-white">
                      {locale === 'pt-BR' ? 'R$ ???' : '$ ???'}
                    </span>
                  </div>
                  <div className="mt-2 h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                  </div>
                </div>
              </Link>
            </div>

            {/* See All Tools Link */}
            <div className="text-center mt-8">
              <Link
                href={getLink(locale === 'pt-BR' ? '/ferramentas' : '/tools')}
                className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-medium"
              >
                {locale === 'pt-BR' ? 'Ver Todas as Ferramentas' : 'See All Tools'}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Articles Section - Main Focus */}
        {blogArticles && blogArticles.length > 0 && (
          <section className="py-12 md:py-16 bg-white relative z-20" aria-labelledby="featured-articles-heading">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <h2 id="featured-articles-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3">
                  {locale === 'pt-BR'
                    ? 'Descubra o Que Você Precisa Saber Agora'
                    : 'Discover What You Need to Know Now'}
                </h2>
                <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-semibold">
                  {locale === 'pt-BR'
                    ? 'Guias práticos que podem salvar sua renda. Aprenda com especialistas e descubra como proteger seu negócio antes que seja tarde.'
                    : 'Practical guides that can save your income. Learn from experts and discover how to protect your business before it\'s too late.'}
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

        {/* Types of Insurance for Gig Workers Section - Quick Navigation */}
        <section className=" mb-2 bg-white" aria-labelledby="insurance-types-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 id="insurance-types-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3">
                {locale === 'pt-BR'
                  ? 'Tipos de Seguro Disponíveis'
                  : 'Available Insurance Types'}
              </h2>
              <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
                {locale === 'pt-BR'
                  ? 'Proteção especializada para diferentes necessidades da gig economy'
                  : 'Specialized protection for different gig economy needs'}
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

            <div className="mt-8 text-center">
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


        {/* How GigSafeHub Works Section */}
        <section className="py-12 md:py-16 bg-white" aria-labelledby="how-it-works-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 id="how-it-works-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3">
                {locale === 'pt-BR' ? 'Como Funciona' : 'How It Works'}
              </h2>
              <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
                {locale === 'pt-BR'
                  ? 'Encontre a proteção ideal em passos simples'
                  : 'Find the ideal protection in simple steps'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-brand-50 to-blue-50 rounded-xl p-8 border border-brand-200">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-brand-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {locale === 'pt-BR' ? 'Explore e Aprenda' : 'Explore and Learn'}
                    </h3>
                    <p className="text-slate-600">
                      {locale === 'pt-BR'
                        ? 'Navegue por tipos de seguro e acesse guias especializados criados por especialistas.'
                        : 'Browse insurance types and access specialized guides created by experts.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-8 border border-blue-200">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {locale === 'pt-BR' ? 'Aprenda e Aplique' : 'Learn and Apply'}
                    </h3>
                    <p className="text-slate-600">
                      {locale === 'pt-BR'
                        ? 'Leia artigos detalhados, aprenda com especialistas e aplique o conhecimento para proteger seu negócio.'
                        : 'Read detailed articles, learn from experts, and apply knowledge to protect your business.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-12 md:py-16 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {locale === 'pt-BR'
                ? 'Não Deixe Para Depois - Proteja-se Agora'
                : 'Don\'t Wait - Protect Yourself Now'}
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-6 max-w-2xl mx-auto font-semibold">
              {locale === 'pt-BR'
                ? 'Cada dia sem proteção é um risco desnecessário. Descubra quanto você está perdendo e como proteger sua renda antes que seja tarde.'
                : 'Every day without protection is an unnecessary risk. Discover how much you\'re losing and how to protect your income before it\'s too late.'}
            </p>
            <p className="text-base text-white/80 mb-8 max-w-2xl mx-auto">
              {locale === 'pt-BR'
                ? '✅ 100% Gratuito • ✅ Sem Cadastro • ✅ Acesso Imediato'
                : '✅ 100% Free • ✅ No Signup • ✅ Immediate Access'}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href={getLink('/articles')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-brand-600 font-bold text-lg hover:bg-slate-100 transition-all shadow-2xl transform hover:-translate-y-1 hover:scale-105"
                aria-label={locale === 'pt-BR' ? 'Ler guias' : 'Read guides'}
              >
                {t('home.readGuides')}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href={getLink(locale === 'pt-BR' ? '/seguros' : '/insurance')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-lg hover:bg-white/20 transition-all shadow-xl transform hover:-translate-y-1 hover:scale-105"
                aria-label={locale === 'pt-BR' ? 'Explorar seguros' : 'Explore insurance'}
              >
                {locale === 'pt-BR' ? 'Explorar Seguros' : 'Explore Insurance'}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 md:py-16 bg-slate-50" aria-labelledby="faq-heading">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 id="faq-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3">
                {locale === 'pt-BR' ? 'Perguntas Frequentes' : 'Frequently Asked Questions'}
              </h2>
              <p className="text-lg md:text-xl text-slate-600">
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

            <div className="mt-8 text-center">
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
