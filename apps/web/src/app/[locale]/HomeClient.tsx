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
  const isPt = locale === 'pt-BR';

  const shouldAnimate = !isSlowConnection && !saveData;

  const comparatorLink = isPt ? '/ferramentas/comparador-seguro' : '/tools/insurance-comparator';

  useEffect(() => {
    if (isSlowConnection || saveData || toastShown) return;
    const toastShownInSession = sessionStorage.getItem('home-toast-shown');
    if (toastShownInSession) return;

    const timer = setTimeout(() => {
      const message = isPt
        ? '🛡️ Compare cotações de seguro em minutos!'
        : '🛡️ Compare insurance quotes in minutes!';
      toast.warning(message, 8000, getLink(comparatorLink), isPt ? 'Comparar agora' : 'Compare now');
      setToastShown(true);
      sessionStorage.setItem('home-toast-shown', 'true');
    }, 5000);

    return () => clearTimeout(timer);
  }, [locale, toast, isSlowConnection, saveData, toastShown]); // eslint-disable-line react-hooks/exhaustive-deps

  const insuranceRoot = findBySlug(isPt ? 'seguros' : 'insurance', locale);
  const insuranceCategories = insuranceRoot ? getByParent(insuranceRoot.id).sort((a, b) => (a.order || 0) - (b.order || 0)).slice(0, 4) : [];

  const tools = [
    {
      id: 'simulador-perda-renda',
      name: isPt ? 'Simulador de Perda de Renda' : 'Loss Income Simulator',
      description: isPt
        ? 'Quanto você perderia sem trabalhar? Descubra o impacto real na sua renda.'
        : 'How much would you lose without working? Discover the real impact on your income.',
      icon: '⚠️', color: 'orange', badge: 'popular',
      stats: isPt ? 'Ferramenta gratuita' : 'Free tool',
      link: isPt ? '/ferramentas/simulador-perda-renda' : '/tools/loss-income-simulator',
    },
    {
      id: 'calculadora-lucro-diario',
      name: isPt ? 'Calculadora de Lucro Real' : 'Real Profit Calculator',
      description: isPt
        ? 'Quanto você ganha por hora de verdade? Descubra seu lucro real após todos os custos.'
        : 'What\'s your real hourly rate? Discover your actual profit after all costs.',
      icon: '💰', color: 'emerald', badge: 'trending',
      stats: isPt ? 'Sem cadastro' : 'No signup',
      link: isPt ? '/ferramentas/calculadora-lucro-diario' : '/tools/daily-profit-calculator',
    },
    {
      id: 'calculadora-custos-ocultos',
      name: isPt ? 'Calculadora de Custos Ocultos' : 'Hidden Costs Calculator',
      description: isPt
        ? 'Descubra gastos que você ignora: depreciação, desgaste e manutenção.'
        : 'Discover costs you overlook: depreciation, wear and maintenance.',
      icon: '🔍', color: 'rose', badge: 'recommended',
      stats: isPt ? 'Resultado imediato' : 'Instant results',
      link: isPt ? '/ferramentas/calculadora-custos-ocultos' : '/tools/hidden-costs-calculator',
    },
    {
      id: 'simulador-meta-mensal',
      name: isPt ? 'Simulador de Meta Mensal' : 'Monthly Goal Simulator',
      description: isPt
        ? 'Planeje como alcançar sua meta. Quantas horas e corridas você precisa?'
        : 'Plan how to reach your goal. How many hours and trips do you need?',
      icon: '🎯', color: 'purple',
      stats: isPt ? '100% gratuito' : '100% free',
      link: isPt ? '/ferramentas/simulador-meta-mensal' : '/tools/monthly-goal-simulator',
    },
    {
      id: 'calculadora-custo-corrida',
      name: isPt ? 'Calculadora de Custo por Corrida' : 'Cost per Trip Calculator',
      description: isPt
        ? 'Vale a pena aceitar essa corrida? Descubra antes de aceitar.'
        : 'Is this trip worth it? Find out before accepting.',
      icon: '🚗', color: 'cyan',
      stats: isPt ? 'Sem pegadinhas' : 'No tricks',
      link: isPt ? '/ferramentas/calculadora-custo-corrida' : '/tools/cost-per-trip-calculator',
    },
    {
      id: 'calculadora-combustivel',
      name: isPt ? 'Calculadora de Combustível' : 'Fuel Calculator',
      description: isPt
        ? 'Gasolina ou etanol? Compare e economize no abastecimento.'
        : 'Gas or ethanol? Compare and save on fuel.',
      icon: '⛽', color: 'amber',
      stats: isPt ? 'Rápido e simples' : 'Fast and simple',
      link: isPt ? '/ferramentas/calculadora-combustivel' : '/tools/fuel-calculator',
    },
    {
      id: 'calculadora-ponto-equilibrio',
      name: isPt ? 'Calculadora de Ponto de Equilíbrio' : 'Break-Even Calculator',
      description: isPt
        ? 'Quanto precisa faturar para cobrir todos os custos?'
        : 'How much do you need to earn to cover all costs?',
      icon: '⚖️', color: 'blue',
      stats: isPt ? 'Dados claros' : 'Clear data',
      link: isPt ? '/ferramentas/calculadora-ponto-equilibrio' : '/tools/break-even-calculator',
    },
    {
      id: 'simulador-orcamento',
      name: isPt ? 'Simulador de Orçamento' : 'Budget Simulator',
      description: isPt
        ? 'Monte seu orçamento completo: custos fixos, variáveis e pessoais.'
        : 'Build your complete budget: fixed, variable and personal costs.',
      icon: '📊', color: 'violet',
      stats: isPt ? 'Foco no lucro' : 'Profit focused',
      link: isPt ? '/ferramentas/simulador-orcamento' : '/tools/driver-budget-simulator',
    },
  ];

  const faqs = isPt ? [
    {
      question: 'O que é seguro para motoristas de aplicativo?',
      answer: 'Seguro para motoristas de aplicativo é uma apólice de seguro veicular especializada que cobre motoristas que trabalham com plataformas como Uber, 99, iFood e outras. Este tipo de seguro oferece cobertura adicional além do seguro básico, protegendo o motorista durante o período em que está trabalhando.',
    },
    {
      question: 'Como funciona o comparador de seguros?',
      answer: 'Nosso comparador coleta suas informações em 6 passos simples, envia para seguradoras reais parceiras e retorna cotações lado a lado para você comparar preço, cobertura e benefícios. Todo o processo leva menos de 5 minutos.',
    },
    {
      question: 'Qual a diferença entre seguro pessoal e seguro para aplicativo?',
      answer: 'O seguro pessoal cobre apenas o uso particular do veículo. O seguro para aplicativo oferece cobertura específica para quando o motorista está trabalhando, incluindo período online na plataforma, transporte de passageiros ou entregas.',
    },
    {
      question: 'Quanto custa seguro para motoristas de aplicativo?',
      answer: 'O custo varia conforme o tipo de veículo, uso, localização e cobertura escolhida. Use nosso comparador para receber cotações reais de várias seguradoras e encontrar o melhor preço para o seu perfil.',
    },
  ] : [
    {
      question: 'What is rideshare insurance?',
      answer: 'Rideshare insurance is specialized vehicle insurance coverage for drivers who work with platforms like Uber, Lyft, DoorDash, and others. This type of insurance provides additional coverage beyond basic auto insurance, protecting the driver while they are working.',
    },
    {
      question: 'How does the insurance comparator work?',
      answer: 'Our comparator collects your info in 6 simple steps, sends it to real partner insurance providers, and returns side-by-side quotes so you can compare price, coverage, and benefits. The entire process takes less than 5 minutes.',
    },
    {
      question: 'What is the difference between personal insurance and rideshare insurance?',
      answer: 'Personal insurance covers only private vehicle use. Rideshare insurance provides specific coverage for when the driver is working, including the period when online on the platform, transporting passengers, or making deliveries.',
    },
    {
      question: 'How much does rideshare insurance cost?',
      answer: 'Cost varies based on vehicle type, usage, location, and chosen coverage. Use our comparator to receive real quotes from multiple providers and find the best price for your profile.',
    },
  ];

  const getBadgeStyles = (badge: string) => {
    switch (badge) {
      case 'popular': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'trending': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'recommended': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const getBadgeText = (badge: string) => {
    switch (badge) {
      case 'popular': return 'Popular';
      case 'trending': return isPt ? 'Em Alta' : 'Trending';
      case 'recommended': return isPt ? 'Recomendado' : 'Recommended';
      default: return '';
    }
  };

  const colorClasses: Record<string, { gradient: string; hover: string; text: string }> = {
    orange: { gradient: 'from-orange-500 to-red-500', hover: 'hover:border-orange-500/50 hover:shadow-orange-500/10', text: 'text-orange-400' },
    emerald: { gradient: 'from-emerald-500 to-teal-500', hover: 'hover:border-emerald-500/50 hover:shadow-emerald-500/10', text: 'text-emerald-400' },
    rose: { gradient: 'from-rose-500 to-pink-500', hover: 'hover:border-rose-500/50 hover:shadow-rose-500/10', text: 'text-rose-400' },
    purple: { gradient: 'from-purple-500 to-violet-500', hover: 'hover:border-purple-500/50 hover:shadow-purple-500/10', text: 'text-purple-400' },
    cyan: { gradient: 'from-cyan-500 to-teal-500', hover: 'hover:border-cyan-500/50 hover:shadow-cyan-500/10', text: 'text-cyan-400' },
    amber: { gradient: 'from-amber-500 to-orange-500', hover: 'hover:border-amber-500/50 hover:shadow-amber-500/10', text: 'text-amber-400' },
    blue: { gradient: 'from-blue-500 to-indigo-500', hover: 'hover:border-blue-500/50 hover:shadow-blue-500/10', text: 'text-blue-400' },
    violet: { gradient: 'from-violet-500 to-purple-500', hover: 'hover:border-violet-500/50 hover:shadow-violet-500/10', text: 'text-violet-400' },
  };

  return (
    <>
      <StructuredData data={generateFAQStructuredData(faqs)} />
      <div className="min-h-screen">
        {/* ============================================================ */}
        {/* HERO — Insurance Comparator as the main value proposition    */}
        {/* ============================================================ */}
        <section className="relative bg-gradient-to-br from-slate-900 via-brand-900 to-slate-900 overflow-hidden">
          {shouldAnimate && (
            <>
              <div className="absolute inset-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/15 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            </>
          )}

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
            <div className="text-center">
              <div className={`flex flex-wrap items-center justify-center gap-3 mb-6 ${shouldAnimate ? 'animate-fade-in' : ''}`}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/20 backdrop-blur-sm border border-orange-400/30">
                  <span className={`w-2 h-2 bg-orange-400 rounded-full ${shouldAnimate ? 'animate-pulse' : ''}`}></span>
                  <span className="text-sm font-medium text-orange-200">
                    {isPt ? 'Cotações Reais' : 'Real Quotes'}
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/20 backdrop-blur-sm border border-teal-400/30">
                  <svg className="w-4 h-4 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-sm font-medium text-teal-200">
                    {isPt ? 'Múltiplas Seguradoras' : 'Multiple Providers'}
                  </span>
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 backdrop-blur-sm border border-green-400/30">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-green-200">
                    {isPt ? '100% Gratuito' : '100% Free'}
                  </span>
                </div>
              </div>

              <h1 className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight mb-6 ${shouldAnimate ? 'animate-fade-in-up' : ''}`}>
                {isPt ? (
                  <>
                    Compare Seguros e{' '}
                    <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
                      Economize
                    </span>
                  </>
                ) : (
                  <>
                    Compare Insurance &{' '}
                    <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
                      Save Big
                    </span>
                  </>
                )}
              </h1>

              <p className={`mt-4 max-w-2xl mx-auto text-lg sm:text-xl md:text-2xl text-slate-200 leading-relaxed ${shouldAnimate ? 'animate-fade-in-up delay-100' : ''}`}>
                {isPt
                  ? 'Receba cotações reais de várias seguradoras em minutos. Feito para motoristas de app e entregadores.'
                  : 'Get real quotes from multiple insurance providers in minutes. Built for rideshare drivers and delivery workers.'}
              </p>

              <div className={`mt-10 flex flex-col sm:flex-row justify-center gap-4 ${shouldAnimate ? 'animate-fade-in-up delay-200' : ''}`}>
                <Link
                  href={getLink(comparatorLink)}
                  className="group relative px-10 py-5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-lg hover:from-orange-400 hover:to-amber-400 transition-all shadow-2xl shadow-orange-500/40 transform hover:-translate-y-1 hover:scale-105"
                  onClick={() => trackSimulatorCTAClick('hero_comparator')}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isPt ? '🛡️ Comparar Cotações Agora' : '🛡️ Compare Quotes Now'}
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>

                <Link
                  href={getLink(isPt ? '/ferramentas' : '/tools')}
                  className="px-8 py-5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-lg hover:bg-white/20 transition-all shadow-xl transform hover:-translate-y-1 hover:scale-105"
                  onClick={() => trackToolsCTAClick('hero_secondary')}
                >
                  {isPt ? '🧮 Outras Ferramentas' : '🧮 More Tools'}
                </Link>
              </div>

              <div className={`mt-8 flex items-center justify-center gap-6 text-sm text-slate-300 ${shouldAnimate ? 'animate-fade-in-up delay-150' : ''}`}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">⏱️</span>
                  <span>{isPt ? 'Menos de 5 minutos' : 'Less than 5 minutes'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🔒</span>
                  <span>{isPt ? 'Dados protegidos' : 'Data protected'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">📊</span>
                  <span>{isPt ? 'Comparação real' : 'Real comparison'}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* HOW IT WORKS — 3-step visual for the comparator              */}
        {/* ============================================================ */}
        <section className="py-16 md:py-20 bg-white relative z-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold mb-4">
                {isPt ? 'Como Funciona' : 'How It Works'}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                {isPt
                  ? 'Cotações Reais em 3 Passos'
                  : 'Real Quotes in 3 Steps'}
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                {isPt
                  ? 'Nosso comparador envia seus dados para seguradoras parceiras e traz cotações reais para você comparar.'
                  : 'Our comparator sends your data to partner insurance providers and brings back real quotes for you to compare.'}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center relative">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-5 text-white text-2xl font-bold shadow-lg shadow-orange-500/30">
                  1
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {isPt ? 'Preencha o Formulário' : 'Fill the Form'}
                </h3>
                <p className="text-slate-600">
                  {isPt
                    ? '6 passos simples sobre você, seu veículo e a cobertura desejada.'
                    : '6 simple steps about you, your vehicle, and desired coverage.'}
                </p>
                <div className="hidden md:block absolute top-8 right-0 w-16 h-0.5 bg-orange-200 translate-x-full -translate-x-2"></div>
              </div>

              <div className="text-center relative">
                <div className="w-16 h-16 bg-gradient-to-br from-navy-500 to-navy-600 rounded-2xl flex items-center justify-center mx-auto mb-5 text-white text-2xl font-bold shadow-lg shadow-navy-500/30">
                  2
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {isPt ? 'Buscamos nas Seguradoras' : 'We Search Providers'}
                </h3>
                <p className="text-slate-600">
                  {isPt
                    ? 'Consultamos múltiplas seguradoras em tempo real para encontrar as melhores taxas.'
                    : 'We query multiple insurance providers in real-time to find the best rates.'}
                </p>
                <div className="hidden md:block absolute top-8 right-0 w-16 h-0.5 bg-navy-200 translate-x-full -translate-x-2"></div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-5 text-white text-2xl font-bold shadow-lg shadow-emerald-500/30">
                  3
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {isPt ? 'Compare e Escolha' : 'Compare & Choose'}
                </h3>
                <p className="text-slate-600">
                  {isPt
                    ? 'Veja cotações lado a lado, compare preço, cobertura e benefícios, e escolha a melhor.'
                    : 'See quotes side-by-side, compare price, coverage, and benefits, and pick the best one.'}
                </p>
              </div>
            </div>

            <div className="text-center">
              <Link
                href={getLink(comparatorLink)}
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full font-bold text-lg hover:from-orange-400 hover:to-amber-400 transition-all shadow-lg shadow-orange-500/30 transform hover:-translate-y-0.5"
                onClick={() => trackSimulatorCTAClick('how_it_works_cta')}
              >
                {isPt ? 'Começar Comparação' : 'Start Comparing'}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="mt-3 text-sm text-slate-500">
                {isPt ? 'Sem cadastro • Sem compromisso • Resultado em minutos' : 'No signup • No commitment • Results in minutes'}
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* INSURANCE TYPES — Moved up for topical relevance             */}
        {/* ============================================================ */}
        <section className="py-16 bg-slate-50" aria-labelledby="insurance-types-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 id="insurance-types-heading" className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                {isPt ? 'Tipos de Seguro Disponíveis' : 'Available Insurance Types'}
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                {isPt
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
                          {isPt ? 'Ver opções' : 'View options'}
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
                href={getLink(isPt ? '/seguros' : '/insurance')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700 transition-colors"
              >
                {isPt ? 'Ver todos os tipos de seguro' : 'View all insurance types'}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* TOOLS SECTION — Calculators and Simulators                   */}
        {/* ============================================================ */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-teal-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-500/20 text-teal-400 text-sm font-medium mb-4">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                {isPt ? 'Ferramentas Gratuitas' : 'Free Tools'}
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {isPt ? 'Tome Decisões Mais Inteligentes' : 'Make Smarter Decisions'}
              </h2>
              <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
                {isPt
                  ? 'Descubra quanto você realmente ganha, quais custos você ignora e como proteger sua renda.'
                  : 'Discover how much you really earn, which costs you overlook and how to protect your income.'}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {tools.map((tool) => {
                const colors = colorClasses[tool.color] || colorClasses.emerald;
                return (
                  <Link
                    key={tool.id}
                    href={getLink(tool.link)}
                    className={`group relative bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${colors.hover}`}
                    onClick={() => trackSimulatorCTAClick(`homepage_tool_${tool.id}`)}
                  >
                    {tool.badge && (
                      <div className={`absolute -top-2 -right-2 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${getBadgeStyles(tool.badge)}`}>
                        {getBadgeText(tool.badge)}
                      </div>
                    )}
                    <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient}/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                    <div className="relative">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg mb-4 text-2xl`}>
                        {tool.icon}
                      </div>
                      <h3 className={`text-lg font-bold text-white mb-2 group-hover:${colors.text} transition-colors line-clamp-1`}>
                        {tool.name}
                      </h3>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {tool.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500 font-medium">{tool.stats}</span>
                        <div className={`flex items-center ${colors.text} text-sm font-semibold`}>
                          {isPt ? 'Usar' : 'Use'}
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

            <div className="text-center">
              <Link
                href={getLink(isPt ? '/ferramentas' : '/tools')}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur border border-white/20 rounded-full text-white font-semibold text-lg hover:bg-white/20 transition-all group"
                onClick={() => trackToolsCTAClick('homepage_view_all')}
              >
                {isPt ? 'Ver Todas as Ferramentas' : 'View All Tools'}
                <span className="text-teal-400 text-sm">(8)</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* WHY USE — Value propositions                                  */}
        {/* ============================================================ */}
        <section className="py-16 bg-white relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                {isPt ? 'Por Que Usar o GigSafeHub?' : 'Why Use GigSafeHub?'}
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                  🛡️
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {isPt ? 'Cotações de Seguradoras Reais' : 'Real Provider Quotes'}
                </h3>
                <p className="text-slate-600">
                  {isPt
                    ? 'Não estimativas — cotações reais de seguradoras parceiras, comparadas lado a lado.'
                    : 'Not estimates — real quotes from partner insurance providers, compared side-by-side.'}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                  ⚡
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {isPt ? 'Resultados em Minutos' : 'Results in Minutes'}
                </h3>
                <p className="text-slate-600">
                  {isPt
                    ? 'Preencha uma vez, receba cotações de várias seguradoras. Sem telefonar para cada uma.'
                    : 'Fill in once, get quotes from multiple providers. No calling each one separately.'}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-navy-500 to-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                  🎯
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {isPt ? 'Feito para Gig Workers' : 'Built for Gig Workers'}
                </h3>
                <p className="text-slate-600">
                  {isPt
                    ? 'Motoristas de app e entregadores têm necessidades específicas. Nossas ferramentas entendem isso.'
                    : 'Rideshare and delivery drivers have unique needs. Our tools understand that.'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* ARTICLES CAROUSEL                                            */}
        {/* ============================================================ */}
        {carouselArticles && carouselArticles.length > 0 && (
          <section className="py-16 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                  {isPt ? 'Guias Mais Recentes' : 'Latest Guides'}
                </h2>
                <p className="text-lg text-slate-600">
                  {isPt
                    ? 'Aprenda como proteger sua renda e tomar decisões financeiras melhores'
                    : 'Learn how to protect your income and make better financial decisions'}
                </p>
              </div>
              <ArticleCarousel articles={carouselArticles} locale={locale} />
            </div>
          </section>
        )}

        {/* ============================================================ */}
        {/* FEATURED ARTICLES                                            */}
        {/* ============================================================ */}
        {blogArticles && blogArticles.length > 0 && (
          <section className="py-16 bg-white" aria-labelledby="featured-articles-heading">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <h2 id="featured-articles-heading" className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                  {isPt ? 'Descubra o Que Você Precisa Saber' : 'Discover What You Need to Know'}
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  {isPt
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

        {/* ============================================================ */}
        {/* JOBS SECTION                                                 */}
        {/* ============================================================ */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-4">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {isPt ? 'Oportunidades de Emprego' : 'Job Opportunities'}
                </div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
                  {isPt
                    ? 'Encontre as Melhores Vagas'
                    : 'Find the Best Jobs'}
                </h2>
                <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                  {isPt
                    ? 'Oportunidades de trabalho remotas e presenciais para motoristas de app, entregadores e freelancers.'
                    : 'Remote and on-site job opportunities for rideshare drivers, delivery workers, and freelancers.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href={getLink(isPt ? '/vagas' : '/jobs')}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-blue-600 font-bold text-lg hover:bg-slate-100 transition-all shadow-2xl transform hover:-translate-y-1 hover:scale-105"
                  >
                    {isPt ? '💼 Ver Vagas' : '💼 View Jobs'}
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>
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

        {/* ============================================================ */}
        {/* FINAL CTA — Insurance Comparator                             */}
        {/* ============================================================ */}
        <section className="py-16 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {isPt
                ? 'Pronto Para Encontrar o Melhor Seguro?'
                : 'Ready to Find the Best Insurance?'}
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              {isPt
                ? 'Compare cotações de seguradoras reais em minutos. Sem cadastro, sem compromisso, sem telefonemas.'
                : 'Compare quotes from real insurance providers in minutes. No signup, no commitment, no phone calls.'}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href={getLink(comparatorLink)}
                className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full bg-white text-orange-600 font-bold text-lg hover:bg-slate-100 transition-all shadow-2xl transform hover:-translate-y-1 hover:scale-105"
                onClick={() => trackSimulatorCTAClick('final_cta_comparator')}
              >
                {isPt ? '🛡️ Comparar Cotações Agora' : '🛡️ Compare Quotes Now'}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href={getLink(isPt ? '/ferramentas' : '/tools')}
                className="inline-flex items-center justify-center gap-2 px-8 py-5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold text-lg hover:bg-white/20 transition-all shadow-xl transform hover:-translate-y-1 hover:scale-105"
                onClick={() => trackToolsCTAClick('final_cta')}
              >
                {isPt ? '🧮 Outras Ferramentas' : '🧮 More Tools'}
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* FAQ                                                          */}
        {/* ============================================================ */}
        <section className="py-16 bg-white" aria-labelledby="faq-heading">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 id="faq-heading" className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
                {isPt ? 'Perguntas Frequentes' : 'Frequently Asked Questions'}
              </h2>
              <p className="text-lg text-slate-600">
                {isPt
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
                {isPt ? 'Ver todas as perguntas' : 'View all questions'}
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
