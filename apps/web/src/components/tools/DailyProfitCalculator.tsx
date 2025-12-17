'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/contexts/I18nContext';
import { trackToolStart, trackEvent } from '@/lib/analytics';

interface CalculatorResult {
  realDailyProfit: number;
  realHourlyRate: number;
  profitMargin: number;
  totalExpenses: number;
  performanceLevel: 'good' | 'average' | 'low' | 'critical';
  expenses: {
    fuel: number;
    maintenance: number;
    platform: number;
    other: number;
  };
}

interface DailyProfitCalculatorProps {
  locale: string;
}

export default function DailyProfitCalculator({ locale }: DailyProfitCalculatorProps) {
  const { t } = useTranslation();
  const [grossRevenue, setGrossRevenue] = useState('');
  const [hoursWorked, setHoursWorked] = useState('8');
  const [fuelCost, setFuelCost] = useState('');
  const [maintenanceCost, setMaintenanceCost] = useState('');
  const [platformFee, setPlatformFee] = useState('');
  const [otherCosts, setOtherCosts] = useState('');
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [animatedProfit, setAnimatedProfit] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  const currencySymbol = locale === 'pt-BR' ? 'R$' : '$';
  const minimumWageHourly = locale === 'pt-BR' ? 6.36 : 7.25; // BR minimum ~R$1412/month, US $7.25/hr
  const targetHourlyRate = locale === 'pt-BR' ? 30 : 25;

  // Track page view on mount
  useEffect(() => {
    trackEvent('calculator_view', { tool_name: 'daily_profit_calculator' });
  }, []);

  // Animate the profit counter
  useEffect(() => {
    if (result) {
      const target = result.realDailyProfit;
      const duration = 1500;
      const steps = 60;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setAnimatedProfit(target);
          clearInterval(timer);
        } else {
          setAnimatedProfit(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [result]);

  const parseNumber = (value: string) => {
    const parsed = parseFloat(value.replace(/[^0-9.]/g, ''));
    return isNaN(parsed) ? 0 : parsed;
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setCalculating(true);

    trackToolStart('daily_profit_calculator');

    setTimeout(() => {
      const revenue = parseNumber(grossRevenue);
      const hours = parseFloat(hoursWorked) || 8;
      const fuel = parseNumber(fuelCost);
      const maintenance = parseNumber(maintenanceCost);
      const platform = parseNumber(platformFee);
      const other = parseNumber(otherCosts);

      const totalExpenses = fuel + maintenance + platform + other;
      const realDailyProfit = revenue - totalExpenses;
      const realHourlyRate = hours > 0 ? realDailyProfit / hours : 0;
      const profitMargin = revenue > 0 ? (realDailyProfit / revenue) * 100 : 0;

      // Determine performance level based on hourly rate
      let performanceLevel: 'good' | 'average' | 'low' | 'critical';
      if (realHourlyRate >= targetHourlyRate) {
        performanceLevel = 'good';
      } else if (realHourlyRate >= minimumWageHourly * 2) {
        performanceLevel = 'average';
      } else if (realHourlyRate >= minimumWageHourly) {
        performanceLevel = 'low';
      } else {
        performanceLevel = 'critical';
      }

      const resultData: CalculatorResult = {
        realDailyProfit: Math.round(realDailyProfit * 100) / 100,
        realHourlyRate: Math.round(realHourlyRate * 100) / 100,
        profitMargin: Math.round(profitMargin * 10) / 10,
        totalExpenses: Math.round(totalExpenses * 100) / 100,
        performanceLevel,
        expenses: {
          fuel,
          maintenance,
          platform,
          other,
        },
      };

      setResult(resultData);
      setCalculating(false);

      // Track calculation
      trackEvent('calculator_submit', {
        tool_name: 'daily_profit_calculator',
        gross_revenue_range: revenue < 100 ? '0-100' : revenue < 200 ? '100-200' : revenue < 300 ? '200-300' : '300+',
        hours_worked: hours,
        profit_margin: resultData.profitMargin,
        performance_level: performanceLevel,
      });

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 1000);
  };

  const getPerformanceColor = (level: string) => {
    switch (level) {
      case 'good': return 'text-emerald-400';
      case 'average': return 'text-teal-400';
      case 'low': return 'text-amber-400';
      case 'critical': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getPerformanceBg = (level: string) => {
    switch (level) {
      case 'good': return 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30';
      case 'average': return 'from-teal-500/20 to-teal-600/20 border-teal-500/30';
      case 'low': return 'from-amber-500/20 to-amber-600/20 border-amber-500/30';
      case 'critical': return 'from-red-500/20 to-red-600/20 border-red-500/30';
      default: return 'from-slate-500/20 to-slate-600/20 border-slate-500/30';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale === 'pt-BR' ? 'pt-BR' : 'en-US', {
      style: 'currency',
      currency: locale === 'pt-BR' ? 'BRL' : 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const tt = (key: string) => t(`tools.dailyProfitCalculator.${key}`);

  const toolsPath = locale === 'pt-BR' ? '/ferramentas' : '/tools';
  const toolsLabel = locale === 'pt-BR' ? 'Ferramentas' : 'Tools';
  const homeLabel = locale === 'pt-BR' ? 'Início' : 'Home';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
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
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-2"></span>
            <span className="text-emerald-400 text-sm font-medium">
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
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 sm:p-8 mb-8">
          <form onSubmit={handleCalculate} className="space-y-6">
            {/* Gross Revenue */}
            <div>
              <label className="block text-white font-medium mb-2">
                {tt('grossRevenue')}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                  {currencySymbol}
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={grossRevenue}
                  onChange={(e) => setGrossRevenue(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-500"
                  placeholder={locale === 'pt-BR' ? '250,00' : '200.00'}
                  required
                />
              </div>
              <p className="text-slate-400 text-sm mt-1">{tt('grossRevenueHelp')}</p>
            </div>

            {/* Hours Worked */}
            <div>
              <label className="block text-white font-medium mb-2">
                {tt('hoursWorked')}
              </label>
              <input
                type="number"
                value={hoursWorked}
                onChange={(e) => setHoursWorked(e.target.value)}
                className="w-full px-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                min="1"
                max="24"
                required
              />
              <p className="text-slate-400 text-sm mt-1">{tt('hoursWorkedHelp')}</p>
            </div>

            {/* Expenses Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Fuel Cost */}
              <div>
                <label className="block text-white font-medium mb-2">
                  {tt('fuelCost')}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                    {currencySymbol}
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={fuelCost}
                    onChange={(e) => setFuelCost(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-500"
                    placeholder="0"
                  />
                </div>
                <p className="text-slate-400 text-xs mt-1">{tt('fuelCostHelp')}</p>
              </div>

              {/* Maintenance */}
              <div>
                <label className="block text-white font-medium mb-2">
                  {tt('maintenanceCost')}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                    {currencySymbol}
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={maintenanceCost}
                    onChange={(e) => setMaintenanceCost(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-500"
                    placeholder="0"
                  />
                </div>
                <p className="text-slate-400 text-xs mt-1">{tt('maintenanceCostHelp')}</p>
              </div>

              {/* Platform Fees */}
              <div>
                <label className="block text-white font-medium mb-2">
                  {tt('platformFee')}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                    {currencySymbol}
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={platformFee}
                    onChange={(e) => setPlatformFee(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-500"
                    placeholder="0"
                  />
                </div>
                <p className="text-slate-400 text-xs mt-1">{tt('platformFeeHelp')}</p>
              </div>

              {/* Other Costs */}
              <div>
                <label className="block text-white font-medium mb-2">
                  {tt('otherCosts')}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                    {currencySymbol}
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={otherCosts}
                    onChange={(e) => setOtherCosts(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-500"
                    placeholder="0"
                  />
                </div>
                <p className="text-slate-400 text-xs mt-1">{tt('otherCostsHelp')}</p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={calculating || !grossRevenue}
              className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg rounded-xl hover:from-emerald-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-emerald-500/25"
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

        {/* Results Section */}
        {result && (
          <div ref={resultRef} className="space-y-6 animate-fade-in">
            {/* Main Result Card */}
            <div className={`bg-gradient-to-br ${getPerformanceBg(result.performanceLevel)} backdrop-blur-xl rounded-3xl border p-8`}>
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                {tt('results')}
              </h2>

              {/* Big Number Display */}
              <div className="text-center mb-8">
                <p className="text-slate-300 mb-2">{tt('realDailyProfit')}</p>
                <div className="text-5xl sm:text-6xl font-bold text-white mb-2">
                  {formatCurrency(animatedProfit)}
                </div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full bg-white/10 ${getPerformanceColor(result.performanceLevel)}`}>
                  <span className="text-sm font-medium">
                    {result.profitMargin >= 0 ? '+' : ''}{result.profitMargin}% {tt('profitMargin')}
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-slate-400 text-sm mb-1">{tt('realHourlyRate')}</p>
                  <p className={`text-2xl font-bold ${getPerformanceColor(result.performanceLevel)}`}>
                    {formatCurrency(result.realHourlyRate)}/h
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-slate-400 text-sm mb-1">{tt('minimumWage')}</p>
                  <p className={`text-2xl font-bold ${result.realHourlyRate >= minimumWageHourly ? 'text-emerald-400' : 'text-red-400'}`}>
                    {result.realHourlyRate >= minimumWageHourly ? (
                      <span>+{Math.round((result.realHourlyRate / minimumWageHourly - 1) * 100)}%</span>
                    ) : (
                      <span>{Math.round((result.realHourlyRate / minimumWageHourly - 1) * 100)}%</span>
                    )}
                  </p>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                  <p className="text-slate-400 text-sm mb-1">{tt('targetHourly')}</p>
                  <p className={`text-2xl font-bold ${result.realHourlyRate >= targetHourlyRate ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {result.realHourlyRate >= targetHourlyRate ? (
                      <span>+{Math.round((result.realHourlyRate / targetHourlyRate - 1) * 100)}%</span>
                    ) : (
                      <span>{Math.round((result.realHourlyRate / targetHourlyRate - 1) * 100)}%</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Expense Breakdown */}
              <div className="bg-white/5 rounded-xl p-6">
                <h3 className="text-white font-semibold mb-4">{tt('expenseBreakdown')}</h3>
                <div className="space-y-3">
                  {result.expenses.fuel > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300 flex items-center gap-2">
                        <span className="text-lg">⛽</span> {tt('fuelCost')}
                      </span>
                      <span className="text-red-400 font-medium">-{formatCurrency(result.expenses.fuel)}</span>
                    </div>
                  )}
                  {result.expenses.maintenance > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300 flex items-center gap-2">
                        <span className="text-lg">🔧</span> {tt('maintenanceCost')}
                      </span>
                      <span className="text-red-400 font-medium">-{formatCurrency(result.expenses.maintenance)}</span>
                    </div>
                  )}
                  {result.expenses.platform > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300 flex items-center gap-2">
                        <span className="text-lg">📱</span> {tt('platformFee')}
                      </span>
                      <span className="text-red-400 font-medium">-{formatCurrency(result.expenses.platform)}</span>
                    </div>
                  )}
                  {result.expenses.other > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300 flex items-center gap-2">
                        <span className="text-lg">📦</span> {tt('otherCosts')}
                      </span>
                      <span className="text-red-400 font-medium">-{formatCurrency(result.expenses.other)}</span>
                    </div>
                  )}
                  <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-red-400 font-bold">-{formatCurrency(result.totalExpenses)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Insights Card */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="text-xl">💡</span> {tt('insights.title')}
              </h3>
              <p className={`${getPerformanceColor(result.performanceLevel)} text-lg`}>
                {tt(`insights.${result.performanceLevel}`)}
              </p>
            </div>

            {/* Tips Card */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="text-xl">🎯</span> {tt('tips.title')}
              </h3>
              <ul className="space-y-3">
                {['tip1', 'tip2', 'tip3', 'tip4'].map((tip, index) => (
                  <li key={tip} className="flex items-start gap-3 text-slate-300">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    {tt(`tips.${tip}`)}
                  </li>
                ))}
              </ul>
            </div>

            {/* Calculate Again Button */}
            <div className="text-center">
              <button
                onClick={() => {
                  setResult(null);
                  setAnimatedProfit(0);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all"
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
        <p className="text-center text-slate-500 text-sm mt-8 px-4">
          {tt('disclaimer')}
        </p>

        {/* Related Tools Section */}
        <div className="mt-16 pt-12 border-t border-slate-700/50">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            {locale === 'pt-BR' ? 'Outras Ferramentas' : 'Other Tools'}
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {/* Loss Income Simulator */}
            <Link
              href={`/${locale}${locale === 'pt-BR' ? '/ferramentas/simulador-perda-renda' : '/tools/loss-income-simulator'}`}
              className="group bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700 p-5 hover:border-orange-500/50 transition-all hover:shadow-lg hover:shadow-orange-500/10"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-1 group-hover:text-orange-400 transition-colors">
                {locale === 'pt-BR' ? 'Simulador de Perda de Renda' : 'Loss Income Simulator'}
              </h3>
              <p className="text-slate-400 text-sm">
                {locale === 'pt-BR'
                  ? 'Quanto você perderia sem trabalhar?'
                  : 'How much would you lose without working?'}
              </p>
            </Link>

            {/* Monthly Goal Simulator */}
            <Link
              href={`/${locale}${locale === 'pt-BR' ? '/ferramentas/simulador-meta-mensal' : '/tools/monthly-goal-simulator'}`}
              className="group bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700 p-5 hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/10"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-1 group-hover:text-purple-400 transition-colors">
                {locale === 'pt-BR' ? 'Simulador de Meta Mensal' : 'Monthly Goal Simulator'}
              </h3>
              <p className="text-slate-400 text-sm">
                {locale === 'pt-BR'
                  ? 'Planeje como alcançar suas metas de renda'
                  : 'Plan how to reach your income goals'}
              </p>
            </Link>

            {/* Hidden Costs Calculator */}
            <Link
              href={`/${locale}${locale === 'pt-BR' ? '/ferramentas/calculadora-custos-ocultos' : '/tools/hidden-costs-calculator'}`}
              className="group bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700 p-5 hover:border-rose-500/50 transition-all hover:shadow-lg hover:shadow-rose-500/10"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold mb-1 group-hover:text-rose-400 transition-colors">
                {locale === 'pt-BR' ? 'Calculadora de Custos Ocultos' : 'Hidden Costs Calculator'}
              </h3>
              <p className="text-slate-400 text-sm">
                {locale === 'pt-BR'
                  ? 'Descubra gastos que você pode estar ignorando'
                  : 'Find costs you might be overlooking'}
              </p>
            </Link>
          </div>

          {/* All Tools Link */}
          <div className="text-center mt-8">
            <Link
              href={`/${locale}${locale === 'pt-BR' ? '/ferramentas' : '/tools'}`}
              className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              {locale === 'pt-BR' ? 'Ver todas as ferramentas' : 'View all tools'}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

