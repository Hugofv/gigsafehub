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
import { trackSimulatorCTAClick, trackToolsCTAClick } from '@/lib/analytics';

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

  // Tool data with badges and stats
  const tools = [
    {
      id: 'simulador-perda-renda',
      name: locale === 'pt-BR' ? 'Simulador de Perda de Renda' : 'Loss Income Simulator',
      description: locale === 'pt-BR'
        ? 'Quanto você perderia sem trabalhar? Descubra o impacto real na sua renda.'
        : 'How much would you lose without working? Discover the real impact on your income.',
      icon: '⚠️',
      color: 'orange',
      badge: 'popular',
      stats: locale === 'pt-BR' ? 'Ferramenta gratuita' : 'Free tool',
      link: locale === 'pt-BR' ? '/ferramentas/simulador-perda-renda' : '/tools/loss-income-simulator',
    },
    {
      id: 'calculadora-lucro-diario',
      name: locale === 'pt-BR' ? 'Calculadora de Lucro Real' : 'Real Profit Calculator',
      description: locale === 'pt-BR'
        ? 'Quanto você ganha por hora de verdade? Descubra seu lucro real após todos os custos.'
        : 'What\'s your real hourly rate? Discover your actual profit after all costs.',
      icon: '💰',
      color: 'emerald',
      badge: 'trending',
      stats: locale === 'pt-BR' ? 'Sem cadastro' : 'No signup',
      link: locale === 'pt-BR' ? '/ferramentas/calculadora-lucro-diario' : '/tools/daily-profit-calculator',
    },
    {
      id: 'calculadora-custos-ocultos',
      name: locale === 'pt-BR' ? 'Calculadora de Custos Ocultos' : 'Hidden Costs Calculator',
      description: locale === 'pt-BR'
        ? 'Descubra gastos que você ignora: depreciação, desgaste e manutenção.'
        : 'Discover costs you overlook: depreciation, wear and maintenance.',
      icon: '🔍',
      color: 'rose',
      badge: 'recommended',
      stats: locale === 'pt-BR' ? 'Resultado imediato' : 'Instant results',
      link: locale === 'pt-BR' ? '/ferramentas/calculadora-custos-ocultos' : '/tools/hidden-costs-calculator',
    },
    {
      id: 'simulador-meta-mensal',
      name: locale === 'pt-BR' ? 'Simulador de Meta Mensal' : 'Monthly Goal Simulator',
      description: locale === 'pt-BR'
        ? 'Planeje como alcançar sua meta. Quantas horas e corridas você precisa?'
        : 'Plan how to reach your goal. How many hours and trips do you need?',
      icon: '🎯',
      color: 'purple',
      stats: locale === 'pt-BR' ? '100% gratuito' : '100% free',
      link: locale === 'pt-BR' ? '/ferramentas/simulador-meta-mensal' : '/tools/monthly-goal-simulator',
    },
    {
      id: 'calculadora-custo-corrida',
      name: locale === 'pt-BR' ? 'Calculadora de Custo por Corrida' : 'Cost per Trip Calculator',
      description: locale === 'pt-BR'
        ? 'Vale a pena aceitar essa corrida? Descubra antes de aceitar.'
        : 'Is this trip worth it? Find out before accepting.',
      icon: '🚗',
      color: 'cyan',
      stats: locale === 'pt-BR' ? 'Sem pegadinhas' : 'No tricks',
      link: locale === 'pt-BR' ? '/ferramentas/calculadora-custo-corrida' : '/tools/cost-per-trip-calculator',
    },
    {
      id: 'calculadora-combustivel',
      name: locale === 'pt-BR' ? 'Calculadora de Combustível' : 'Fuel Calculator',
      description: locale === 'pt-BR'
        ? 'Gasolina ou etanol? Compare e economize no abastecimento.'
        : 'Gas or ethanol? Compare and save on fuel.',
      icon: '⛽',
      color: 'amber',
      stats: locale === 'pt-BR' ? 'Rápido e simples' : 'Fast and simple',
      link: locale === 'pt-BR' ? '/ferramentas/calculadora-combustivel' : '/tools/fuel-calculator',
    },
    {
      id: 'calculadora-ponto-equilibrio',
      name: locale === 'pt-BR' ? 'Calculadora de Ponto de Equilíbrio' : 'Break-Even Calculator',
      description: locale === 'pt-BR'
        ? 'Quanto precisa faturar para cobrir todos os custos?'
        : 'How much do you need to earn to cover all costs?',
      icon: '⚖️',
      color: 'blue',
      stats: locale === 'pt-BR' ? 'Dados claros' : 'Clear data',
      link: locale === 'pt-BR' ? '/ferramentas/calculadora-ponto-equilibrio' : '/tools/break-even-calculator',
    },
    {
      id: 'simulador-orcamento',
      name: locale === 'pt-BR' ? 'Simulador de Orçamento' : 'Budget Simulator',
      description: locale === 'pt-BR'
        ? 'Monte seu orçamento completo: custos fixos, variáveis e pessoais.'
        : 'Build your complete budget: fixed, variable and personal costs.',
      icon: '📊',
      color: 'violet',
      stats: locale === 'pt-BR' ? 'Foco no lucro' : 'Profit focused',
      link: locale === 'pt-BR' ? '/ferramentas/simulador-orcamento' : '/tools/driver-budget-simulator',
    },
  ];

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
    {
      question: 'How much does rideshare insurance cost?',
      answer: 'Cost varies based on vehicle type, usage, location, and chosen coverage. Generally, specialized rideshare insurance can cost between $50 to $200 per month, depending on the mentioned factors.',
    },
  ];

  const getBadgeStyles = (badge: string) => {
    switch (badge) {
      case 'popular':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'trending':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'recommended':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getBadgeText = (badge: string) => {
    switch (badge) {
      case 'popular':
        return locale === 'pt-BR' ? 'Popular' : 'Popular';
      case 'trending':
        return locale === 'pt-BR' ? 'Em Alta' : 'Trending';
      case 'recommended':
        return locale === 'pt-BR' ? 'Recomendado' : 'Recommended';
      default:
        return '';
    }
  };

  return (
    <>
      <StructuredData data={generateFAQStructuredData(faqs)} />
      <div className="min-h-screen">
        {/* Hero Section - Simplified and Tool-Focused */}
        <section className="relative bg-gradient-to-br from-slate-900 via-brand-900 to-slate-900 overflow-hidden">
          {/* Animated background elements - only on fast connections */}
          {shouldAnimate && (
            <>
              <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </>
          )}

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 relative z-10">
            <div className="text-center">
              {/* Trust Badges */}
              <div className={`flex flex-wrap items-center justify-center gap-3 mb-6 ${shouldAnimate ? 'animate-fade-in' : ''}`}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/20 backdrop-blur-sm border border-brand-400/30">
                  <span className={`w-2 h-2 bg-brand-400 rounded-full ${shouldAnimate ? 'animate-pulse' : ''}`}></span>
                  <span className="text-sm font-medium text-brand-200">
                    {locale === 'pt-BR' ? '100% Gratuito' : '100% Free'}
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/20 backdrop-blur-sm border border-teal-400/30">
                  <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium text-teal-200">
                    {locale === 'pt-BR' ? '8 Ferramentas' : '8 Tools'}
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 backdrop-blur-sm border border-green-400/30">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-green-200">
                    {locale === 'pt-BR' ? 'Sem Cadastro' : 'No Signup'}
                  </span>
                </div>
              </div>

              <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 ${shouldAnimate ? 'animate-fade-in-up' : ''}`}>
                {locale === 'pt-BR' ? (
                  <>
                    Descubra Quanto Você{' '}
                    <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-green-400 bg-clip-text text-transparent">
                      Realmente Ganha
                    </span>
                  </>
                ) : (
                  <>
                    Discover How Much You{' '}
                    <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-green-400 bg-clip-text text-transparent">
                      Actually Earn
                    </span>
                  </>
                )}
              </h1>

              <p className={`mt-4 max-w-2xl mx-auto text-lg sm:text-xl md:text-2xl text-slate-200 leading-relaxed ${shouldAnimate ? 'animate-fade-in-up delay-100' : ''}`}>
                {locale === 'pt-BR'
                  ? 'Você sabe quanto do seu faturamento realmente vira lucro no final do dia?'
                  : 'Do you know how much of your earnings actually becomes profit at the end of the day?'}
              </p>

              {/* Quick Stats */}
              <div className={`mt-8 flex items-center justify-center gap-6 text-sm text-slate-300 ${shouldAnimate ? 'animate-fade-in-up delay-150' : ''}`}>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span>{locale === 'pt-BR' ? '8 ferramentas gratuitas' : '8 free tools'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>{locale === 'pt-BR' ? 'Sem cadastro' : 'No signup'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{locale === 'pt-BR' ? '100% gratuito' : '100% free'}</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className={`mt-10 flex flex-col sm:flex-row justify-center gap-4 ${shouldAnimate ? 'animate-fade-in-up delay-200' : ''}`}>
                <Link
                  href={getLink(locale === 'pt-BR' ? '/ferramentas' : '/tools')}
                  className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-lg hover:from-teal-400 hover:to-emerald-400 transition-all shadow-2xl shadow-teal-500/50 transform hover:-translate-y-1 hover:scale-105"
                  onClick={() => trackToolsCTAClick('hero_primary')}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {locale === 'pt-BR' ? '🚀 Experimentar Ferramentas' : '🚀 Try Tools Now'}
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>

                <Link
                  href={getLink(locale === 'pt-BR' ? '/vagas' : '/jobs')}
                  className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold text-lg hover:from-blue-400 hover:to-indigo-400 transition-all shadow-2xl shadow-blue-500/50 transform hover:-translate-y-1 hover:scale-105"
                >
                  {locale === 'pt-BR' ? '💼 Ver Vagas' : '💼 View Jobs'}
                </Link>

                <Link
                  href={getLink('/articles')}
                  className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-lg hover:bg-white/20 transition-all shadow-xl transform hover:-translate-y-1 hover:scale-105"
                  onClick={() => trackToolsCTAClick('hero_secondary')}
                >
                  {locale === 'pt-BR' ? '📚 Ler Guias' : '📚 Read Guides'}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Tools Section - Main Focus */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-500/5 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-500/20 text-teal-400 text-sm font-medium mb-4">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                {locale === 'pt-BR' ? 'Ferramentas Gratuitas' : 'Free Tools'}
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {locale === 'pt-BR'
                  ? 'Tome Decisões Mais Inteligentes'
                  : 'Make Smarter Decisions'}
              </h2>
              <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
                {locale === 'pt-BR'
                  ? 'Descubra quanto você realmente ganha, quais custos você ignora e como proteger sua renda com nossas calculadoras.'
                  : 'Discover how much you really earn, which costs you overlook and how to protect your income with our calculators.'}
              </p>
            </div>

            {/* Tools Grid - 2 columns on large screens, 1 on mobile */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {tools.map((tool) => {
                const colorClasses: Record<string, { gradient: string; hover: string; text: string; border: string }> = {
                  orange: {
                    gradient: 'from-orange-500 to-red-500',
                    hover: 'hover:border-orange-500/50 hover:shadow-orange-500/10',
                    text: 'text-orange-400',
                    border: 'border-orange-500/30',
                  },
                  emerald: {
                    gradient: 'from-emerald-500 to-teal-500',
                    hover: 'hover:border-emerald-500/50 hover:shadow-emerald-500/10',
                    text: 'text-emerald-400',
                    border: 'border-emerald-500/30',
                  },
                  rose: {
                    gradient: 'from-rose-500 to-pink-500',
                    hover: 'hover:border-rose-500/50 hover:shadow-rose-500/10',
                    text: 'text-rose-400',
                    border: 'border-rose-500/30',
                  },
                  purple: {
                    gradient: 'from-purple-500 to-violet-500',
                    hover: 'hover:border-purple-500/50 hover:shadow-purple-500/10',
                    text: 'text-purple-400',
                    border: 'border-purple-500/30',
                  },
                  cyan: {
                    gradient: 'from-cyan-500 to-teal-500',
                    hover: 'hover:border-cyan-500/50 hover:shadow-cyan-500/10',
                    text: 'text-cyan-400',
                    border: 'border-cyan-500/30',
                  },
                  amber: {
                    gradient: 'from-amber-500 to-orange-500',
                    hover: 'hover:border-amber-500/50 hover:shadow-amber-500/10',
                    text: 'text-amber-400',
                    border: 'border-amber-500/30',
                  },
                  blue: {
                    gradient: 'from-blue-500 to-indigo-500',
                    hover: 'hover:border-blue-500/50 hover:shadow-blue-500/10',
                    text: 'text-blue-400',
                    border: 'border-blue-500/30',
                  },
                  violet: {
                    gradient: 'from-violet-500 to-purple-500',
                    hover: 'hover:border-violet-500/50 hover:shadow-violet-500/10',
                    text: 'text-violet-400',
                    border: 'border-violet-500/30',
                  },
                };

                const colors = colorClasses[tool.color] || colorClasses.emerald;

                return (
                  <Link
                    key={tool.id}
                    href={getLink(tool.link)}
                    className={`group relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${colors.hover}`}
                    onClick={() => trackSimulatorCTAClick(`homepage_tool_${tool.id}`)}
                  >
                    {/* Badge */}
                    {tool.badge && (
                      <div className={`absolute -top-2 -right-2 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${getBadgeStyles(tool.badge)}`}>
                        {getBadgeText(tool.badge)}
                      </div>
                    )}

                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient}/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>

                    <div className="relative">
                      {/* Icon */}
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg mb-4 text-2xl`}>
                        {tool.icon}
                      </div>

                      {/* Title */}
                      <h3 className={`text-lg font-bold text-white mb-2 group-hover:${colors.text} transition-colors line-clamp-1`}>
                        {tool.name}
                      </h3>

                      {/* Description */}
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {tool.description}
                      </p>

                      {/* Stats */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-medium">
                          {tool.stats}
                        </span>
                        <div className={`flex items-center ${colors.text} text-sm font-semibold`}>
                          {locale === 'pt-BR' ? 'Usar' : 'Use'}
                          <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* View All Tools Link */}
            <div className="text-center">
              <Link
                href={getLink(locale === 'pt-BR' ? '/ferramentas' : '/tools')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur border border-white/20 rounded-full text-white font-semibold text-lg hover:bg-white/20 transition-all group"
                onClick={() => trackToolsCTAClick('homepage_view_all')}
              >
                {locale === 'pt-BR' ? 'Ver Todas as Ferramentas' : 'View All Tools'}
                <span className="text-teal-400 text-sm">(8)</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Why Use Tools Section */}
        <section className="py-16 bg-white relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                {locale === 'pt-BR' ? 'Por Que Usar Nossas Ferramentas?' : 'Why Use Our Tools?'}
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                {locale === 'pt-BR'
                  ? 'Tome decisões mais inteligentes com dados reais sobre seus ganhos e custos'
                  : 'Make smarter decisions with real data about your earnings and costs'}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                  ⚡
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {locale === 'pt-BR' ? 'Resultados Instantâneos' : 'Instant Results'}
                </h3>
                <p className="text-slate-600">
                  {locale === 'pt-BR'
                    ? 'Calcule em segundos. Sem cadastro, sem espera, sem complicação.'
                    : 'Calculate in seconds. No signup, no wait, no hassle.'}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                  🎯
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {locale === 'pt-BR' ? 'Precisão Real' : 'Real Accuracy'}
                </h3>
                <p className="text-slate-600">
                  {locale === 'pt-BR'
                    ? 'Baseado em dados reais de motoristas. Descubra o que realmente importa.'
                    : 'Based on real driver data. Discover what really matters.'}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                  💰
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {locale === 'pt-BR' ? 'Economize Dinheiro' : 'Save Money'}
                </h3>
                <p className="text-slate-600">
                  {locale === 'pt-BR'
                    ? 'Identifique custos ocultos e oportunidades de economia.'
                    : 'Identify hidden costs and savings opportunities.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Articles Carousel - If available */}
        {carouselArticles && carouselArticles.length > 0 && (
          <section className="py-16 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                  {locale === 'pt-BR' ? 'Guias Mais Recentes' : 'Latest Guides'}
                </h2>
                <p className="text-lg text-slate-600">
                  {locale === 'pt-BR'
                    ? 'Aprenda como proteger sua renda e tomar decisões financeiras melhores'
                    : 'Learn how to protect your income and make better financial decisions'}
                </p>
              </div>
              <ArticleCarousel articles={carouselArticles} locale={locale} />
            </div>
          </section>
        )}

        {/* Featured Articles Section */}
        {blogArticles && blogArticles.length > 0 && (
          <section className="py-16 bg-white" aria-labelledby="featured-articles-heading">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <h2 id="featured-articles-heading" className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                  {locale === 'pt-BR'
                    ? 'Descubra o Que Você Precisa Saber'
                    : 'Discover What You Need to Know'}
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  {locale === 'pt-BR'
                    ? 'Guias práticos criados por especialistas para proteger sua renda'
                    : 'Practical guides created by experts to protect your income'}
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

        {/* Jobs Section - Promotional */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left side - Content */}
              <div className="text-white">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-4">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {locale === 'pt-BR' ? 'Oportunidades de Emprego' : 'Job Opportunities'}
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  {locale === 'pt-BR'
                    ? 'Encontre as Melhores Vagas para Trabalhadores da Gig Economy'
                    : 'Find the Best Jobs for Gig Economy Workers'}
                </h2>
                <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                  {locale === 'pt-BR'
                    ? 'Descubra oportunidades de trabalho remotas e presenciais perfeitas para motoristas de app, entregadores e freelancers. Vagas verificadas e atualizadas diariamente.'
                    : 'Discover remote and on-site job opportunities perfect for rideshare drivers, delivery workers, and freelancers. Verified jobs updated daily.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href={getLink(locale === 'pt-BR' ? '/vagas' : '/jobs')}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-blue-600 font-bold text-lg hover:bg-slate-100 transition-all shadow-2xl transform hover:-translate-y-1 hover:scale-105"
                  >
                    {locale === 'pt-BR' ? '💼 Ver Todas as Vagas' : '💼 View All Jobs'}
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                  <Link
                    href={getLink(locale === 'pt-BR' ? '/vagas?tipo=remoto' : '/jobs?type=remote')}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-lg hover:bg-white/20 transition-all shadow-xl transform hover:-translate-y-1 hover:scale-105"
                  >
                    {locale === 'pt-BR' ? '🏠 Vagas Remotas' : '🏠 Remote Jobs'}
                  </Link>
                </div>
                <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-white/80">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{locale === 'pt-BR' ? 'Vagas Verificadas' : 'Verified Jobs'}</span>
                  </div>
                  {/* <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span>{locale === 'pt-BR' ? 'Atualizado Diariamente' : 'Updated Daily'}</span>
                  </div> */}
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                    </svg>
                    <span>{locale === 'pt-BR' ? 'Para Todos os Perfis' : 'For All Profiles'}</span>
                  </div>
                </div>
              </div>

              {/* Right side - Visual element */}
              <div className="relative hidden md:block">
                <div className="relative">
                  <div className="absolute inset-0 bg-white/20 rounded-2xl blur-2xl"></div>
                  <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8">
                    <div className="space-y-4">
                      {[1, 2, 3].map((item) => (
                        <div key={item} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="h-4 bg-white/20 rounded mb-2 w-3/4"></div>
                              <div className="h-3 bg-white/10 rounded mb-2 w-full"></div>
                              <div className="h-3 bg-white/10 rounded w-2/3"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Types of Insurance Section */}
        <section className="py-16 bg-slate-50" aria-labelledby="insurance-types-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 id="insurance-types-heading" className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                {locale === 'pt-BR'
                  ? 'Tipos de Seguro Disponíveis'
                  : 'Available Insurance Types'}
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
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
            ) : null}

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

        {/* Final CTA Section */}
        <section className="py-16 bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {locale === 'pt-BR'
                ? 'Pronto Para Descobrir Seu Lucro Real?'
                : 'Ready to Discover Your Real Profit?'}
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {locale === 'pt-BR'
                ? 'Use nossas ferramentas gratuitas agora e descubra quanto você realmente ganha. Sem cadastro, sem complicação.'
                : 'Use our free tools now and discover how much you really earn. No signup, no hassle.'}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href={getLink(locale === 'pt-BR' ? '/ferramentas' : '/tools')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-teal-600 font-bold text-lg hover:bg-slate-100 transition-all shadow-2xl transform hover:-translate-y-1 hover:scale-105"
                onClick={() => trackToolsCTAClick('final_cta')}
              >
                {locale === 'pt-BR' ? '🚀 Experimentar Ferramentas' : '🚀 Try Tools Now'}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href={getLink(locale === 'pt-BR' ? '/vagas' : '/jobs')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-blue-600 font-bold text-lg hover:bg-slate-100 transition-all shadow-2xl transform hover:-translate-y-1 hover:scale-105"
              >
                {locale === 'pt-BR' ? '💼 Ver Vagas' : '💼 View Jobs'}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href={getLink('/articles')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-lg hover:bg-white/20 transition-all shadow-xl transform hover:-translate-y-1 hover:scale-105"
              >
                {locale === 'pt-BR' ? '📚 Ler Guias' : '📚 Read Guides'}
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white" aria-labelledby="faq-heading">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                {locale === 'pt-BR' ? 'Perguntas Frequentes' : 'Frequently Asked Questions'}
              </h2>
              <p className="text-lg text-slate-600">
                {locale === 'pt-BR'
                  ? 'Tire suas dúvidas sobre seguros para trabalhadores da gig economy'
                  : 'Get answers to your questions about insurance for gig economy workers'}
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <details
                  key={index}
                  className="bg-slate-50 rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
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
      </div>
    </>
  );
}
