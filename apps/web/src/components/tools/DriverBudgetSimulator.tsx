'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/contexts/I18nContext';
import { trackToolStart, trackEvent } from '@/lib/analytics';
import SEOSections, { driverBudgetSEO } from './SEOSections';

interface BudgetResult {
  fixedCosts: {
    vehicle: number;
    personal: number;
    work: number;
    total: number;
  };
  variableCosts: {
    fuel: number;
    maintenance: number;
    total: number;
  };
  totalMonthlyCosts: number;
  minimumRevenue: number;
  recommendedRevenue: number;
  daysNeeded: number;
  breakdownByCategory: Array<{ label: string; value: number; color: string }>;
}

interface DriverBudgetSimulatorProps {
  locale: string;
}

export default function DriverBudgetSimulator({ locale }: DriverBudgetSimulatorProps) {
  const { t } = useTranslation();

  // Vehicle Fixed Costs
  const [ipva, setIpva] = useState('');
  const [licensing, setLicensing] = useState('');
  const [carInsurance, setCarInsurance] = useState('');

  // Personal Fixed Costs
  const [healthInsurance, setHealthInsurance] = useState('');
  const [rent, setRent] = useState('');
  const [utilities, setUtilities] = useState('');
  const [food, setFood] = useState('');

  // Work Fixed Costs
  const [phoneData, setPhoneData] = useState('');
  const [appSubscriptions, setAppSubscriptions] = useState('');

  // Variable Costs
  const [monthlyKm, setMonthlyKm] = useState('');
  const [fuelConsumption, setFuelConsumption] = useState('');
  const [fuelPrice, setFuelPrice] = useState('');

  // Income Parameters
  const [averageDailyRevenue, setAverageDailyRevenue] = useState('');
  const [platformFee, setPlatformFee] = useState('25');

  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<BudgetResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const currencySymbol = locale === 'pt-BR' ? 'R$' : '$';

  useEffect(() => {
    trackEvent('calculator_view', { tool_name: 'driver_budget_simulator' });
  }, []);

  const parseNumber = (value: string) => {
    const cleaned = value.replace(/[^0-9.,]/g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setCalculating(true);
    trackToolStart('driver_budget_simulator');

    setTimeout(() => {
      // Vehicle Fixed Costs (convert yearly to monthly)
      const monthlyIpva = parseNumber(ipva) / 12;
      const monthlyLicensing = parseNumber(licensing) / 12;
      const monthlyCarInsurance = parseNumber(carInsurance);
      const vehicleFixed = monthlyIpva + monthlyLicensing + monthlyCarInsurance;

      // Personal Fixed Costs
      const monthlyHealth = parseNumber(healthInsurance);
      const monthlyRent = parseNumber(rent);
      const monthlyUtilities = parseNumber(utilities);
      const monthlyFood = parseNumber(food);
      const personalFixed = monthlyHealth + monthlyRent + monthlyUtilities + monthlyFood;

      // Work Fixed Costs
      const monthlyPhone = parseNumber(phoneData);
      const monthlyApps = parseNumber(appSubscriptions);
      const workFixed = monthlyPhone + monthlyApps;

      const totalFixed = vehicleFixed + personalFixed + workFixed;

      // Variable Costs
      const km = parseNumber(monthlyKm);
      const consumption = parseNumber(fuelConsumption);
      const fuel = parseNumber(fuelPrice);

      const fuelCost = consumption > 0 ? (km / consumption) * fuel : 0;

      // Maintenance estimate (R$0.15/km for maintenance, tires, etc.)
      const maintenancePerKm = locale === 'pt-BR' ? 0.15 : 0.10;
      const maintenanceCost = km * maintenancePerKm;

      const totalVariable = fuelCost + maintenanceCost;

      // Total monthly costs
      const totalMonthlyCosts = totalFixed + totalVariable;

      // Income parameters
      const dailyRevenue = parseNumber(averageDailyRevenue);
      const fee = parseNumber(platformFee) / 100;
      const netDailyRevenue = dailyRevenue * (1 - fee);

      // Minimum revenue to cover costs
      const minimumRevenue = totalMonthlyCosts / (1 - fee);

      // Recommended revenue (20% above minimum for savings)
      const recommendedRevenue = minimumRevenue * 1.2;

      // Days needed to cover costs
      const daysNeeded = netDailyRevenue > 0 ? Math.ceil(totalMonthlyCosts / netDailyRevenue) : 30;

      // Breakdown by category
      const breakdownByCategory = [
        { label: locale === 'pt-BR' ? 'Combustível' : 'Fuel', value: fuelCost, color: '#f59e0b' },
        { label: locale === 'pt-BR' ? 'Moradia' : 'Housing', value: monthlyRent, color: '#3b82f6' },
        { label: locale === 'pt-BR' ? 'Alimentação' : 'Food', value: monthlyFood, color: '#10b981' },
        { label: locale === 'pt-BR' ? 'Saúde' : 'Health', value: monthlyHealth, color: '#ef4444' },
        { label: locale === 'pt-BR' ? 'Veículo (fixos)' : 'Vehicle (fixed)', value: vehicleFixed, color: '#8b5cf6' },
        { label: locale === 'pt-BR' ? 'Manutenção' : 'Maintenance', value: maintenanceCost, color: '#6366f1' },
        { label: locale === 'pt-BR' ? 'Celular/Apps' : 'Phone/Apps', value: workFixed, color: '#ec4899' },
        { label: locale === 'pt-BR' ? 'Contas' : 'Utilities', value: monthlyUtilities, color: '#14b8a6' },
      ].filter(item => item.value > 0).sort((a, b) => b.value - a.value);

      setResult({
        fixedCosts: {
          vehicle: vehicleFixed,
          personal: personalFixed,
          work: workFixed,
          total: totalFixed,
        },
        variableCosts: {
          fuel: fuelCost,
          maintenance: maintenanceCost,
          total: totalVariable,
        },
        totalMonthlyCosts,
        minimumRevenue,
        recommendedRevenue,
        daysNeeded,
        breakdownByCategory,
      });

      setCalculating(false);

      trackEvent('calculator_complete', {
        tool_name: 'driver_budget_simulator',
        total_costs_range: totalMonthlyCosts < 2000 ? '0-2000' : totalMonthlyCosts < 4000 ? '2000-4000' : totalMonthlyCosts < 6000 ? '4000-6000' : '6000+',
        days_needed_range: daysNeeded < 15 ? '0-15' : daysNeeded < 22 ? '15-22' : '22+',
      });

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 800);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale === 'pt-BR' ? 'pt-BR' : 'en-US', {
      style: 'currency',
      currency: locale === 'pt-BR' ? 'BRL' : 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const toolsPath = locale === 'pt-BR' ? '/ferramentas' : '/tools';
  const toolsLabel = locale === 'pt-BR' ? 'Ferramentas' : 'Tools';
  const homeLabel = locale === 'pt-BR' ? 'Início' : 'Home';

  const translations: Record<string, Record<string, string>> = {
    'pt-BR': {
      title: 'Simulador de Orçamento do Motorista',
      subtitle: 'Monte seu orçamento completo e descubra quanto precisa faturar para sobreviver',
      vehicleCosts: 'Custos do Veículo',
      ipva: 'IPVA (valor anual)',
      licensing: 'Licenciamento + DPVAT (anual)',
      carInsurance: 'Seguro do Veículo (mensal)',
      personalCosts: 'Custos Pessoais',
      healthInsurance: 'Plano de Saúde',
      rent: 'Aluguel / Moradia',
      utilities: 'Contas (água, luz, gás)',
      food: 'Alimentação',
      workCosts: 'Custos do Trabalho',
      phoneData: 'Celular + Internet',
      appSubscriptions: 'Assinaturas (Spotify, etc)',
      variableCosts: 'Custos Variáveis',
      monthlyKm: 'KM rodados por mês',
      fuelConsumption: 'Consumo do veículo (km/l)',
      fuelPrice: 'Preço do combustível',
      incomeParams: 'Parâmetros de Renda',
      averageDailyRevenue: 'Faturamento médio por dia',
      platformFee: 'Taxa da plataforma (%)',
      calculate: 'Simular Orçamento',
      calculating: 'Calculando...',
      results: 'Seu Orçamento Mensal',
      totalCosts: 'Total de Gastos',
      minimumRevenue: 'Faturamento Mínimo Necessário',
      recommendedRevenue: 'Faturamento Recomendado',
      recommendedNote: '(para ter margem e poupar)',
      daysNeeded: 'Dias de Trabalho Necessários',
      costBreakdown: 'Distribuição dos Gastos',
      fixedCostsLabel: 'Custos Fixos',
      vehicle: 'Veículo',
      personal: 'Pessoal',
      work: 'Trabalho',
      variableCostsLabel: 'Custos Variáveis',
      fuel: 'Combustível',
      maintenance: 'Manutenção',
      insight: 'Análise do seu Orçamento',
      insightGood: 'Com seu faturamento atual, você consegue cobrir os custos em {days} dias. Os outros dias são lucro!',
      insightTight: 'Atenção: você precisa de {days} dias para cobrir os custos. Margem apertada!',
      insightBad: 'Alerta: você precisa trabalhar mais de 25 dias para cobrir os custos. Revise suas despesas.',
      tipTitle: 'Dicas para Economizar',
      tip1: 'Renegocie planos de celular e internet - há opções mais baratas',
      tip2: 'Compare preços de combustível em postos diferentes',
      tip3: 'Faça manutenção preventiva para evitar gastos maiores',
      tip4: 'Considere cozinhar mais em casa para reduzir gastos com alimentação',
      disclaimer: 'Os cálculos são estimativas baseadas nos valores informados. Custos reais podem variar.',
    },
    'en-US': {
      title: 'Driver Budget Simulator',
      subtitle: 'Build your complete budget and find out how much you need to earn to survive',
      vehicleCosts: 'Vehicle Costs',
      ipva: 'Vehicle Tax (yearly)',
      licensing: 'Registration + Fees (yearly)',
      carInsurance: 'Car Insurance (monthly)',
      personalCosts: 'Personal Costs',
      healthInsurance: 'Health Insurance',
      rent: 'Rent / Housing',
      utilities: 'Utilities (water, electric, gas)',
      food: 'Food',
      workCosts: 'Work Costs',
      phoneData: 'Phone + Internet',
      appSubscriptions: 'Subscriptions (Spotify, etc)',
      variableCosts: 'Variable Costs',
      monthlyKm: 'Miles driven per month',
      fuelConsumption: 'Fuel economy (mpg)',
      fuelPrice: 'Fuel price',
      incomeParams: 'Income Parameters',
      averageDailyRevenue: 'Average daily revenue',
      platformFee: 'Platform fee (%)',
      calculate: 'Simulate Budget',
      calculating: 'Calculating...',
      results: 'Your Monthly Budget',
      totalCosts: 'Total Expenses',
      minimumRevenue: 'Minimum Revenue Needed',
      recommendedRevenue: 'Recommended Revenue',
      recommendedNote: '(to have margin and save)',
      daysNeeded: 'Working Days Needed',
      costBreakdown: 'Expense Distribution',
      fixedCostsLabel: 'Fixed Costs',
      vehicle: 'Vehicle',
      personal: 'Personal',
      work: 'Work',
      variableCostsLabel: 'Variable Costs',
      fuel: 'Fuel',
      maintenance: 'Maintenance',
      insight: 'Budget Analysis',
      insightGood: 'With your current revenue, you can cover costs in {days} days. The rest is profit!',
      insightTight: 'Warning: you need {days} days to cover costs. Tight margin!',
      insightBad: 'Alert: you need more than 25 days to cover costs. Review your expenses.',
      tipTitle: 'Tips to Save',
      tip1: 'Renegotiate phone and internet plans - cheaper options exist',
      tip2: 'Compare fuel prices at different stations',
      tip3: 'Do preventive maintenance to avoid bigger expenses',
      tip4: 'Consider cooking more at home to reduce food expenses',
      disclaimer: 'Calculations are estimates based on the values provided. Actual costs may vary.',
    },
  };

  const tt = (key: string) => translations[locale]?.[key] || translations['en-US'][key] || key;

  const getInsightText = (days: number) => {
    if (days <= 15) {
      return tt('insightGood').replace('{days}', days.toString());
    } else if (days <= 22) {
      return tt('insightTight').replace('{days}', days.toString());
    } else {
      return tt('insightBad');
    }
  };

  const getInsightColor = (days: number) => {
    if (days <= 15) return 'text-emerald-400';
    if (days <= 22) return 'text-amber-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="relative bg-slate-800/50 border-b border-slate-700/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center flex-wrap gap-1 text-sm">
            <li className="flex items-center">
              <Link href={`/${locale}`} className="text-slate-400 hover:text-white transition-colors">
                {homeLabel}
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-slate-500 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <Link href={`/${locale}${toolsPath}`} className="text-slate-400 hover:text-white transition-colors">
                {toolsLabel}
              </Link>
            </li>
            <li className="flex items-center">
              <svg className="w-4 h-4 text-slate-500 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-slate-300 font-medium" aria-current="page">
                {tt('title')}
              </span>
            </li>
          </ol>
        </div>
      </nav>

      <div className="relative max-w-4xl mx-auto px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-violet-500/20 border border-violet-500/30 mb-6">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse mr-2"></span>
            <span className="text-violet-300 text-sm font-medium">
              {locale === 'pt-BR' ? 'Ferramenta Completa' : 'Complete Tool'}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {tt('title')}
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            {tt('subtitle')}
          </p>
        </div>

        {/* Calculator Form */}
        <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-slate-700 p-6 sm:p-8 mb-8 shadow-2xl">
          <form onSubmit={handleCalculate} className="space-y-8">
            {/* Vehicle Costs */}
            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </span>
                {tt('vehicleCosts')}
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">{tt('ipva')}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400 font-medium text-sm">{currencySymbol}</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={ipva}
                      onChange={(e) => setIpva(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all placeholder:text-slate-500"
                      placeholder="2.000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">{tt('licensing')}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400 font-medium text-sm">{currencySymbol}</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={licensing}
                      onChange={(e) => setLicensing(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all placeholder:text-slate-500"
                      placeholder="300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">{tt('carInsurance')}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-violet-400 font-medium text-sm">{currencySymbol}</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={carInsurance}
                      onChange={(e) => setCarInsurance(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all placeholder:text-slate-500"
                      placeholder="200"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Personal Costs */}
            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </span>
                {tt('personalCosts')}
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">{tt('healthInsurance')}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 font-medium text-sm">{currencySymbol}</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={healthInsurance}
                      onChange={(e) => setHealthInsurance(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-500"
                      placeholder="300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">{tt('rent')}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 font-medium text-sm">{currencySymbol}</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={rent}
                      onChange={(e) => setRent(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-500"
                      placeholder="1.200"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">{tt('utilities')}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 font-medium text-sm">{currencySymbol}</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={utilities}
                      onChange={(e) => setUtilities(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-500"
                      placeholder="300"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">{tt('food')}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 font-medium text-sm">{currencySymbol}</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={food}
                      onChange={(e) => setFood(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-500"
                      placeholder="800"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Work Costs */}
            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </span>
                {tt('workCosts')}
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">{tt('phoneData')}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400 font-medium text-sm">{currencySymbol}</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={phoneData}
                      onChange={(e) => setPhoneData(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all placeholder:text-slate-500"
                      placeholder="100"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">{tt('appSubscriptions')}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400 font-medium text-sm">{currencySymbol}</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={appSubscriptions}
                      onChange={(e) => setAppSubscriptions(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all placeholder:text-slate-500"
                      placeholder="50"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Variable Costs */}
            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </span>
                {tt('variableCosts')}
              </h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">{tt('monthlyKm')}</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={monthlyKm}
                    onChange={(e) => setMonthlyKm(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder:text-slate-500"
                    placeholder="3000"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">{tt('fuelConsumption')}</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={fuelConsumption}
                    onChange={(e) => setFuelConsumption(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder:text-slate-500"
                    placeholder="10"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">{tt('fuelPrice')}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400 font-medium text-sm">{currencySymbol}</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={fuelPrice}
                      onChange={(e) => setFuelPrice(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder:text-slate-500"
                      placeholder="5,50"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Income Parameters */}
            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                {tt('incomeParams')}
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">{tt('averageDailyRevenue')}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 font-medium text-sm">{currencySymbol}</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={averageDailyRevenue}
                      onChange={(e) => setAverageDailyRevenue(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all placeholder:text-slate-500"
                      placeholder="250"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">{tt('platformFee')}</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={platformFee}
                      onChange={(e) => setPlatformFee(e.target.value)}
                      className="w-full px-4 py-3 pr-8 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                      min="0"
                      max="50"
                      required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={calculating}
              className="w-full py-4 px-6 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold text-lg rounded-xl hover:from-violet-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-violet-500/25"
            >
              {calculating ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {tt('calculating')}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {tt('calculate')}
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Results */}
        {result && (
          <div ref={resultRef} className="space-y-6 animate-fade-in">
            {/* Main Results */}
            <div className="bg-slate-800/90 backdrop-blur-xl rounded-3xl border border-slate-700 p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                {tt('results')}
              </h2>

              {/* Total Costs */}
              <div className="text-center mb-8">
                <p className="text-slate-300 mb-2">{tt('totalCosts')}</p>
                <p className="text-5xl font-bold text-white">{formatCurrency(result.totalMonthlyCosts)}</p>
                <p className="text-slate-400 text-sm">{locale === 'pt-BR' ? '/mês' : '/month'}</p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-900/60 rounded-xl p-4 text-center border border-slate-700/50">
                  <p className="text-slate-400 text-sm mb-1">{tt('minimumRevenue')}</p>
                  <p className="text-2xl font-bold text-amber-400">{formatCurrency(result.minimumRevenue)}</p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 text-center">
                  <p className="text-slate-300 text-sm mb-1">{tt('recommendedRevenue')}</p>
                  <p className="text-2xl font-bold text-emerald-400">{formatCurrency(result.recommendedRevenue)}</p>
                  <p className="text-slate-400 text-xs">{tt('recommendedNote')}</p>
                </div>
                <div className="bg-slate-900/60 rounded-xl p-4 text-center border border-slate-700/50">
                  <p className="text-slate-400 text-sm mb-1">{tt('daysNeeded')}</p>
                  <p className={`text-2xl font-bold ${getInsightColor(result.daysNeeded)}`}>{result.daysNeeded}</p>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-4">
                <h3 className="text-white font-semibold">{tt('costBreakdown')}</h3>
                <div className="space-y-2">
                  {result.breakdownByCategory.map((item, index) => {
                    const percentage = (item.value / result.totalMonthlyCosts) * 100;
                    return (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-300">{item.label}</span>
                          <span className="text-white font-medium">{formatCurrency(item.value)} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%`, backgroundColor: item.color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Insight */}
            <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-slate-700 p-6 shadow-xl">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </span>
                {tt('insight')}
              </h3>
              <p className={`text-lg ${getInsightColor(result.daysNeeded)}`}>
                {getInsightText(result.daysNeeded)}
              </p>
            </div>

            {/* Tips */}
            <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-slate-700 p-6 shadow-xl">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </span>
                {tt('tipTitle')}
              </h3>
              <ul className="space-y-3">
                {['tip1', 'tip2', 'tip3', 'tip4'].map((tip, index) => (
                  <li key={tip} className="flex items-start gap-3 text-slate-300">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/30 text-blue-300 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    {tt(tip)}
                  </li>
                ))}
              </ul>
            </div>

            {/* Calculate Again */}
            <div className="text-center">
              <button
                onClick={() => {
                  setResult(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-700 border border-slate-600 text-white rounded-xl hover:bg-slate-600 transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {locale === 'pt-BR' ? 'Calcular Novamente' : 'Calculate Again'}
              </button>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <p className="text-center text-slate-400 text-sm mt-8 px-4">
          {tt('disclaimer')}
        </p>

        {/* Related Tools */}
        <div className="mt-16 pt-12 border-t border-slate-700/50">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            {locale === 'pt-BR' ? 'Outras Ferramentas' : 'Other Tools'}
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link
              href={`/${locale}${locale === 'pt-BR' ? '/ferramentas/calculadora-ponto-equilibrio' : '/tools/break-even-calculator'}`}
              className="group bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700 p-5 hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-1 group-hover:text-blue-400 transition-colors">
                {locale === 'pt-BR' ? 'Ponto de Equilíbrio' : 'Break-Even'}
              </h3>
              <p className="text-slate-400 text-sm">
                {locale === 'pt-BR' ? 'Quando você começa a lucrar' : 'When you start profiting'}
              </p>
            </Link>

            <Link
              href={`/${locale}${locale === 'pt-BR' ? '/ferramentas/calculadora-combustivel' : '/tools/fuel-calculator'}`}
              className="group bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700 p-5 hover:border-amber-500/50 transition-all hover:shadow-lg hover:shadow-amber-500/10"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-1 group-hover:text-amber-400 transition-colors">
                {locale === 'pt-BR' ? 'Calculadora de Combustível' : 'Fuel Calculator'}
              </h3>
              <p className="text-slate-400 text-sm">
                {locale === 'pt-BR' ? 'Gasolina vs Etanol' : 'Gas vs Ethanol'}
              </p>
            </Link>

            <Link
              href={`/${locale}${locale === 'pt-BR' ? '/ferramentas/calculadora-custo-corrida' : '/tools/cost-per-trip-calculator'}`}
              className="group bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700 p-5 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-1 group-hover:text-cyan-400 transition-colors">
                {locale === 'pt-BR' ? 'Custo por Corrida' : 'Cost per Trip'}
              </h3>
              <p className="text-slate-400 text-sm">
                {locale === 'pt-BR' ? 'Vale aceitar a corrida?' : 'Is the trip worth it?'}
              </p>
            </Link>
          </div>

          <div className="text-center mt-8">
            <Link
              href={`/${locale}${toolsPath}`}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              {locale === 'pt-BR' ? 'Ver todas as ferramentas' : 'View all tools'}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* SEO Content Sections */}
        <div className="mt-20">
          <SEOSections
            locale={locale}
            {...driverBudgetSEO[locale as keyof typeof driverBudgetSEO] || driverBudgetSEO['en-US']}
          />
        </div>
      </div>
    </div>
  );
}

