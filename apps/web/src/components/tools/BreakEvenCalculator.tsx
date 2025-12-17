'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/contexts/I18nContext';
import { trackToolStart, trackEvent } from '@/lib/analytics';
import SEOSections, { breakEvenSEO } from './SEOSections';

interface CalculatorResult {
  totalFixedCosts: number;
  totalVariableCostsPerKm: number;
  breakEvenRevenue: number;
  breakEvenTrips: number;
  breakEvenDays: number;
  breakEvenHours: number;
  safetyMargin: number;
  recommendedRevenue: number;
}

interface BreakEvenCalculatorProps {
  locale: string;
}

export default function BreakEvenCalculator({ locale }: BreakEvenCalculatorProps) {
  const { t } = useTranslation();

  // Fixed costs
  const [ipva, setIpva] = useState('');
  const [licensing, setLicensing] = useState('');
  const [carInsurance, setCarInsurance] = useState('');
  const [healthInsurance, setHealthInsurance] = useState('');
  const [phoneAndData, setPhoneAndData] = useState('');

  // Variable parameters
  const [monthlyKm, setMonthlyKm] = useState('');
  const [fuelCostPerKm, setFuelCostPerKm] = useState('');
  const [averageFare, setAverageFare] = useState('');
  const [averageDistance, setAverageDistance] = useState('');
  const [platformFee, setPlatformFee] = useState('25');
  const [hoursPerDay, setHoursPerDay] = useState('8');

  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const currencySymbol = locale === 'pt-BR' ? 'R$' : '$';

  useEffect(() => {
    trackEvent('calculator_view', { tool_name: 'break_even_calculator' });
  }, []);

  const parseNumber = (value: string) => {
    const cleaned = value.replace(/[^0-9.,]/g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setCalculating(true);
    trackToolStart('break_even_calculator');

    setTimeout(() => {
      // Fixed costs (monthly)
      const monthlyIpva = parseNumber(ipva) / 12;
      const monthlyLicensing = parseNumber(licensing) / 12;
      const monthlyCarInsurance = parseNumber(carInsurance);
      const monthlyHealthInsurance = parseNumber(healthInsurance);
      const monthlyPhone = parseNumber(phoneAndData);

      const totalFixed = monthlyIpva + monthlyLicensing + monthlyCarInsurance + monthlyHealthInsurance + monthlyPhone;

      // Variable costs
      const km = parseNumber(monthlyKm);
      const fuelPerKm = parseNumber(fuelCostPerKm);
      const fare = parseNumber(averageFare);
      const distance = parseNumber(averageDistance);
      const fee = parseNumber(platformFee) / 100;
      const hours = parseNumber(hoursPerDay);

      // Wear cost per km (maintenance, tires, depreciation, etc.)
      const wearPerKm = locale === 'pt-BR' ? 0.18 : 0.12;
      const totalVariablePerKm = fuelPerKm + wearPerKm;

      // Variable costs per month
      const totalVariableMonthly = totalVariablePerKm * km;

      // Total costs
      const totalMonthlyCosts = totalFixed + totalVariableMonthly;

      // Net fare after platform fee
      const netFare = fare * (1 - fee);

      // Profit per trip (after all costs)
      const costPerTrip = totalVariablePerKm * distance;
      const profitPerTrip = netFare - costPerTrip;

      // Break-even calculations
      // Fixed costs need to be covered by profits from trips
      const tripsToBreakEven = profitPerTrip > 0 ? Math.ceil(totalFixed / profitPerTrip) : 0;

      // Revenue needed to cover all costs
      const breakEvenRevenue = profitPerTrip > 0 ? (totalMonthlyCosts / (1 - fee)) + (totalVariableMonthly * fee / (1 - fee)) : totalMonthlyCosts * 2;

      // Estimate trips per hour and per day
      const avgTripDuration = 0.5; // 30 minutes average
      const tripsPerHour = 1 / avgTripDuration;
      const tripsPerDay = tripsPerHour * hours;

      // Days needed to break even
      const daysToBreakEven = tripsPerDay > 0 ? Math.ceil(tripsToBreakEven / tripsPerDay) : 30;

      // Hours needed
      const hoursToBreakEven = tripsPerHour > 0 ? Math.ceil(tripsToBreakEven / tripsPerHour) : 240;

      // Safety margin (20% above break-even)
      const safetyMargin = breakEvenRevenue * 0.2;
      const recommendedRevenue = breakEvenRevenue + safetyMargin;

      setResult({
        totalFixedCosts: totalFixed,
        totalVariableCostsPerKm: totalVariablePerKm,
        breakEvenRevenue,
        breakEvenTrips: tripsToBreakEven,
        breakEvenDays: daysToBreakEven,
        breakEvenHours: hoursToBreakEven,
        safetyMargin,
        recommendedRevenue,
      });

      setCalculating(false);

      trackEvent('calculator_complete', {
        tool_name: 'break_even_calculator',
        break_even_days: daysToBreakEven < 10 ? '0-10' : daysToBreakEven < 20 ? '10-20' : '20+',
        fixed_costs_range: totalFixed < 500 ? '0-500' : totalFixed < 1000 ? '500-1000' : '1000+',
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
      title: 'Calculadora de Ponto de Equilíbrio',
      subtitle: 'Descubra quanto você precisa faturar para cobrir todos os seus custos',
      fixedCosts: 'Custos Fixos',
      ipva: 'IPVA (valor anual)',
      licensing: 'Licenciamento + DPVAT (valor anual)',
      carInsurance: 'Seguro do Veículo (mensal)',
      healthInsurance: 'Plano de Saúde (mensal)',
      phoneAndData: 'Celular + Internet (mensal)',
      variableParams: 'Parâmetros Variáveis',
      monthlyKm: 'KM rodados por mês',
      fuelCostPerKm: 'Custo de combustível por KM',
      fuelCostHelp: 'Divida o preço do litro pelo consumo (km/l)',
      averageFare: 'Valor médio da corrida',
      averageDistance: 'Distância média por corrida (km)',
      platformFee: 'Taxa da plataforma (%)',
      hoursPerDay: 'Horas trabalhadas por dia',
      calculate: 'Calcular Ponto de Equilíbrio',
      calculating: 'Calculando...',
      results: 'Seu Ponto de Equilíbrio',
      breakEvenRevenue: 'Faturamento Mínimo Mensal',
      recommendedRevenue: 'Faturamento Recomendado',
      recommendedNote: '(com margem de segurança de 20%)',
      breakEvenTrips: 'Corridas Mínimas',
      breakEvenDays: 'Dias de Trabalho',
      breakEvenHours: 'Horas de Trabalho',
      perMonth: '/mês',
      fixedCostsTotal: 'Total de Custos Fixos',
      variableCostsPerKm: 'Custo Variável por KM',
      insight: 'Análise',
      insightText: 'Após faturar {amount}, você começa a ter lucro real. Cada real acima disso é seu ganho líquido.',
      tipTitle: 'Dicas para Melhorar',
      tip1: 'Reduzir custos fixos aumenta diretamente seu lucro',
      tip2: 'Priorize corridas mais longas para diluir custos fixos',
      tip3: 'Mantenha o veículo em dia para evitar gastos extras',
      tip4: 'Reserve parte do lucro para emergências',
      disclaimer: 'Os cálculos são estimativas baseadas nos valores informados. Custos reais podem variar.',
    },
    'en-US': {
      title: 'Break-Even Calculator',
      subtitle: 'Find out how much revenue you need to cover all your costs',
      fixedCosts: 'Fixed Costs',
      ipva: 'Vehicle Tax (yearly)',
      licensing: 'Registration + Fees (yearly)',
      carInsurance: 'Car Insurance (monthly)',
      healthInsurance: 'Health Insurance (monthly)',
      phoneAndData: 'Phone + Data (monthly)',
      variableParams: 'Variable Parameters',
      monthlyKm: 'Miles driven per month',
      fuelCostPerKm: 'Fuel cost per mile',
      fuelCostHelp: 'Divide fuel price by MPG',
      averageFare: 'Average trip fare',
      averageDistance: 'Average trip distance (miles)',
      platformFee: 'Platform fee (%)',
      hoursPerDay: 'Hours worked per day',
      calculate: 'Calculate Break-Even',
      calculating: 'Calculating...',
      results: 'Your Break-Even Point',
      breakEvenRevenue: 'Minimum Monthly Revenue',
      recommendedRevenue: 'Recommended Revenue',
      recommendedNote: '(with 20% safety margin)',
      breakEvenTrips: 'Minimum Trips',
      breakEvenDays: 'Working Days',
      breakEvenHours: 'Working Hours',
      perMonth: '/month',
      fixedCostsTotal: 'Total Fixed Costs',
      variableCostsPerKm: 'Variable Cost per Mile',
      insight: 'Analysis',
      insightText: 'After earning {amount}, you start making real profit. Every dollar above that is your net gain.',
      tipTitle: 'Tips to Improve',
      tip1: 'Reducing fixed costs directly increases your profit',
      tip2: 'Prioritize longer trips to spread fixed costs',
      tip3: 'Keep your vehicle maintained to avoid extra expenses',
      tip4: 'Set aside part of your profit for emergencies',
      disclaimer: 'Calculations are estimates based on the values provided. Actual costs may vary.',
    },
  };

  const tt = (key: string) => translations[locale]?.[key] || translations['en-US'][key] || key;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl"></div>
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
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse mr-2"></span>
            <span className="text-blue-300 text-sm font-medium">
              {locale === 'pt-BR' ? 'Ferramenta Gratuita' : 'Free Tool'}
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
            {/* Fixed Costs Section */}
            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </span>
                {tt('fixedCosts')}
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">{tt('ipva')}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 font-medium text-sm">{currencySymbol}</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={ipva}
                      onChange={(e) => setIpva(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-500"
                      placeholder={locale === 'pt-BR' ? '2.000' : '500'}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">{tt('licensing')}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 font-medium text-sm">{currencySymbol}</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={licensing}
                      onChange={(e) => setLicensing(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-500"
                      placeholder={locale === 'pt-BR' ? '300' : '100'}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">{tt('carInsurance')}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 font-medium text-sm">{currencySymbol}</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={carInsurance}
                      onChange={(e) => setCarInsurance(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-500"
                      placeholder={locale === 'pt-BR' ? '200' : '150'}
                    />
                  </div>
                </div>
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
                      placeholder={locale === 'pt-BR' ? '300' : '200'}
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-white text-sm font-medium mb-2">{tt('phoneAndData')}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 font-medium text-sm">{currencySymbol}</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={phoneAndData}
                      onChange={(e) => setPhoneAndData(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-slate-500"
                      placeholder={locale === 'pt-BR' ? '100' : '80'}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Variable Parameters Section */}
            <div>
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </span>
                {tt('variableParams')}
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">{tt('monthlyKm')}</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={monthlyKm}
                    onChange={(e) => setMonthlyKm(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-500"
                    placeholder={locale === 'pt-BR' ? '3000' : '2000'}
                    required
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">{tt('fuelCostPerKm')}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 font-medium text-sm">{currencySymbol}</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={fuelCostPerKm}
                      onChange={(e) => setFuelCostPerKm(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-500"
                      placeholder={locale === 'pt-BR' ? '0,55' : '0.15'}
                      required
                    />
                  </div>
                  <p className="text-slate-400 text-xs mt-1">{tt('fuelCostHelp')}</p>
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">{tt('averageFare')}</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 font-medium text-sm">{currencySymbol}</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={averageFare}
                      onChange={(e) => setAverageFare(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-500"
                      placeholder={locale === 'pt-BR' ? '15' : '12'}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">{tt('averageDistance')}</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={averageDistance}
                    onChange={(e) => setAverageDistance(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder:text-slate-500"
                    placeholder={locale === 'pt-BR' ? '8' : '5'}
                    required
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">{tt('platformFee')}</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={platformFee}
                      onChange={(e) => setPlatformFee(e.target.value)}
                      className="w-full px-4 py-3 pr-8 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      min="0"
                      max="50"
                      required
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">{tt('hoursPerDay')}</label>
                  <input
                    type="number"
                    value={hoursPerDay}
                    onChange={(e) => setHoursPerDay(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    min="1"
                    max="16"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={calculating}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold text-lg rounded-xl hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/25"
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

              <div className="text-center mb-8">
                <p className="text-slate-300 mb-2">{tt('breakEvenRevenue')}</p>
                <p className="text-5xl font-bold text-white">{formatCurrency(result.breakEvenRevenue)}</p>
                <p className="text-slate-400 text-sm">{tt('perMonth')}</p>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mb-8">
                <p className="text-slate-300 text-sm mb-1">{tt('recommendedRevenue')}</p>
                <p className="text-3xl font-bold text-emerald-400">{formatCurrency(result.recommendedRevenue)}</p>
                <p className="text-slate-400 text-xs">{tt('recommendedNote')}</p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-900/60 rounded-xl p-4 text-center border border-slate-700/50">
                  <p className="text-slate-400 text-sm mb-1">{tt('breakEvenTrips')}</p>
                  <p className="text-2xl font-bold text-white">{result.breakEvenTrips}</p>
                  <p className="text-slate-500 text-xs">{tt('perMonth')}</p>
                </div>
                <div className="bg-slate-900/60 rounded-xl p-4 text-center border border-slate-700/50">
                  <p className="text-slate-400 text-sm mb-1">{tt('breakEvenDays')}</p>
                  <p className="text-2xl font-bold text-white">{result.breakEvenDays}</p>
                  <p className="text-slate-500 text-xs">{tt('perMonth')}</p>
                </div>
                <div className="bg-slate-900/60 rounded-xl p-4 text-center border border-slate-700/50">
                  <p className="text-slate-400 text-sm mb-1">{tt('breakEvenHours')}</p>
                  <p className="text-2xl font-bold text-white">{result.breakEvenHours}</p>
                  <p className="text-slate-500 text-xs">{tt('perMonth')}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex justify-between items-center bg-slate-900/60 rounded-lg p-3 border border-slate-700/50">
                  <span className="text-slate-300">{tt('fixedCostsTotal')}</span>
                  <span className="text-white font-semibold">{formatCurrency(result.totalFixedCosts)}{tt('perMonth')}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-900/60 rounded-lg p-3 border border-slate-700/50">
                  <span className="text-slate-300">{tt('variableCostsPerKm')}</span>
                  <span className="text-white font-semibold">{formatCurrency(result.totalVariableCostsPerKm)}/{locale === 'pt-BR' ? 'km' : 'mi'}</span>
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
              <p className="text-emerald-400 text-lg">
                {tt('insightText').replace('{amount}', formatCurrency(result.breakEvenRevenue))}
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
                {locale === 'pt-BR' ? 'Vale a pena aceitar?' : 'Is it worth accepting?'}
              </p>
            </Link>

            <Link
              href={`/${locale}${locale === 'pt-BR' ? '/ferramentas/simulador-orcamento' : '/tools/driver-budget-simulator'}`}
              className="group bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700 p-5 hover:border-violet-500/50 transition-all hover:shadow-lg hover:shadow-violet-500/10"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-1 group-hover:text-violet-400 transition-colors">
                {locale === 'pt-BR' ? 'Simulador de Orçamento' : 'Budget Simulator'}
              </h3>
              <p className="text-slate-400 text-sm">
                {locale === 'pt-BR' ? 'Todas suas despesas' : 'All your expenses'}
              </p>
            </Link>

            <Link
              href={`/${locale}${locale === 'pt-BR' ? '/ferramentas/calculadora-lucro-diario' : '/tools/daily-profit-calculator'}`}
              className="group bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700 p-5 hover:border-emerald-500/50 transition-all hover:shadow-lg hover:shadow-emerald-500/10"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-1 group-hover:text-emerald-400 transition-colors">
                {locale === 'pt-BR' ? 'Lucro Real Diário' : 'Daily Real Profit'}
              </h3>
              <p className="text-slate-400 text-sm">
                {locale === 'pt-BR' ? 'Seu ganho real por hora' : 'Your real hourly earnings'}
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
            {...breakEvenSEO[locale as keyof typeof breakEvenSEO] || breakEvenSEO['en-US']}
          />
        </div>
      </div>
    </div>
  );
}

