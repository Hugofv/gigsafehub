'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/contexts/I18nContext';
import { trackToolStart, trackEvent } from '@/lib/analytics';
import SEOSections, { monthlyGoalSEO } from './SEOSections';

interface SimulatorResult {
  tripsNeeded: number;
  hoursNeeded: number;
  daysNeeded: number;
  dailyTarget: number;
  weeklyTarget: number;
  remaining: number;
  progress: number;
  status: 'achievable' | 'challenging' | 'aggressive' | 'easy';
}

interface MonthlyGoalSimulatorProps {
  locale: string;
}

export default function MonthlyGoalSimulator({ locale }: MonthlyGoalSimulatorProps) {
  const { t } = useTranslation();
  const [monthlyGoal, setMonthlyGoal] = useState('');
  const [averagePerTrip, setAveragePerTrip] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState('8');
  const [daysPerWeek, setDaysPerWeek] = useState('5');
  const [currentEarnings, setCurrentEarnings] = useState('0');
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<SimulatorResult | null>(null);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  const currencySymbol = locale === 'pt-BR' ? 'R$' : '$';

  // Track page view on mount
  useEffect(() => {
    trackEvent('calculator_view', { tool_name: 'monthly_goal_simulator' });
  }, []);

  // Animate progress
  useEffect(() => {
    if (result) {
      const target = result.progress;
      const duration = 1500;
      const steps = 60;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setAnimatedProgress(target);
          clearInterval(timer);
        } else {
          setAnimatedProgress(Math.floor(current));
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

    trackToolStart('monthly_goal_simulator');

    setTimeout(() => {
      const goal = parseNumber(monthlyGoal);
      const avgTrip = parseNumber(averagePerTrip);
      const hoursDay = parseFloat(hoursPerDay) || 8;
      const daysWeek = parseInt(daysPerWeek) || 5;
      const current = parseNumber(currentEarnings);

      const remaining = Math.max(0, goal - current);
      const progress = goal > 0 ? Math.min(100, (current / goal) * 100) : 0;

      // Calculate days left in month (approximate)
      const today = new Date();
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      const daysLeft = daysInMonth - today.getDate();
      const workingDaysLeft = Math.ceil((daysLeft / 7) * daysWeek);

      // Calculate requirements
      const tripsNeeded = avgTrip > 0 ? Math.ceil(remaining / avgTrip) : 0;
      const tripsPerHour = 2; // Average assumption
      const hoursNeeded = tripsNeeded / tripsPerHour;
      const daysNeeded = hoursDay > 0 ? Math.ceil(hoursNeeded / hoursDay) : 0;
      const dailyTarget = workingDaysLeft > 0 ? remaining / workingDaysLeft : remaining;
      const weeklyTarget = dailyTarget * daysWeek;

      // Determine status
      let status: 'achievable' | 'challenging' | 'aggressive' | 'easy';
      const hoursPerWeekNeeded = daysNeeded > 0 ? (hoursNeeded / Math.ceil(daysNeeded / daysWeek)) * daysWeek : 0;
      const maxHoursPerWeek = hoursDay * daysWeek;

      if (progress >= 100) {
        status = 'easy';
      } else if (hoursPerWeekNeeded <= maxHoursPerWeek * 0.7) {
        status = 'achievable';
      } else if (hoursPerWeekNeeded <= maxHoursPerWeek) {
        status = 'challenging';
      } else {
        status = 'aggressive';
      }

      const resultData: SimulatorResult = {
        tripsNeeded,
        hoursNeeded: Math.round(hoursNeeded),
        daysNeeded,
        dailyTarget: Math.round(dailyTarget),
        weeklyTarget: Math.round(weeklyTarget),
        remaining: Math.round(remaining),
        progress: Math.round(progress * 10) / 10,
        status,
      };

      setResult(resultData);
      setCalculating(false);

      trackEvent('calculator_submit', {
        tool_name: 'monthly_goal_simulator',
        goal_range: goal < 3000 ? '0-3000' : goal < 5000 ? '3000-5000' : goal < 8000 ? '5000-8000' : '8000+',
        progress_percent: resultData.progress,
        status: status,
      });

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'easy': return 'text-emerald-400';
      case 'achievable': return 'text-teal-400';
      case 'challenging': return 'text-amber-400';
      case 'aggressive': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'easy': return 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30';
      case 'achievable': return 'from-teal-500/20 to-teal-600/20 border-teal-500/30';
      case 'challenging': return 'from-amber-500/20 to-amber-600/20 border-amber-500/30';
      case 'aggressive': return 'from-red-500/20 to-red-600/20 border-red-500/30';
      default: return 'from-slate-500/20 to-slate-600/20 border-slate-500/30';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'from-emerald-500 to-green-500';
    if (progress >= 75) return 'from-teal-500 to-emerald-500';
    if (progress >= 50) return 'from-amber-500 to-yellow-500';
    if (progress >= 25) return 'from-orange-500 to-amber-500';
    return 'from-red-500 to-orange-500';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale === 'pt-BR' ? 'pt-BR' : 'en-US', {
      style: 'currency',
      currency: locale === 'pt-BR' ? 'BRL' : 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const tt = (key: string) => t(`tools.monthlyGoalSimulator.${key}`);

  const toolsPath = locale === 'pt-BR' ? '/ferramentas' : '/tools';
  const toolsLabel = locale === 'pt-BR' ? 'Ferramentas' : 'Tools';
  const homeLabel = locale === 'pt-BR' ? 'Início' : 'Home';

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl"></div>
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
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-6">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse mr-2"></span>
            <span className="text-purple-300 text-sm font-medium">
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
          <form onSubmit={handleCalculate} className="space-y-6">
            {/* Monthly Goal */}
            <div>
              <label className="block text-white font-medium mb-2">
                {tt('monthlyGoal')}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 font-medium">
                  {currencySymbol}
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={monthlyGoal}
                  onChange={(e) => setMonthlyGoal(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-600 rounded-xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder:text-slate-500"
                  placeholder={locale === 'pt-BR' ? '5.000' : '4,000'}
                  required
                />
              </div>
              <p className="text-slate-400 text-sm mt-1">{tt('monthlyGoalHelp')}</p>
            </div>

            {/* Average per Trip */}
            <div>
              <label className="block text-white font-medium mb-2">
                {tt('averagePerTrip')}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 font-medium">
                  {currencySymbol}
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={averagePerTrip}
                  onChange={(e) => setAveragePerTrip(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-600 rounded-xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder:text-slate-500"
                  placeholder={locale === 'pt-BR' ? '15' : '12'}
                  required
                />
              </div>
              <p className="text-slate-400 text-sm mt-1">{tt('averagePerTripHelp')}</p>
            </div>

            {/* Grid for hours and days */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  {tt('hoursPerDay')}
                </label>
                <input
                  type="number"
                  value={hoursPerDay}
                  onChange={(e) => setHoursPerDay(e.target.value)}
                  className="w-full px-4 py-4 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  min="1"
                  max="16"
                  required
                />
                <p className="text-slate-400 text-xs mt-1">{tt('hoursPerDayHelp')}</p>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  {tt('daysPerWeek')}
                </label>
                <input
                  type="number"
                  value={daysPerWeek}
                  onChange={(e) => setDaysPerWeek(e.target.value)}
                  className="w-full px-4 py-4 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  min="1"
                  max="7"
                  required
                />
                <p className="text-slate-400 text-xs mt-1">{tt('daysPerWeekHelp')}</p>
              </div>
            </div>

            {/* Current Earnings */}
            <div>
              <label className="block text-white font-medium mb-2">
                {tt('currentEarnings')}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 font-medium">
                  {currencySymbol}
                </span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={currentEarnings}
                  onChange={(e) => setCurrentEarnings(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all placeholder:text-slate-500"
                  placeholder="0"
                />
              </div>
              <p className="text-slate-400 text-sm mt-1">{tt('currentEarningsHelp')}</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={calculating || !monthlyGoal || !averagePerTrip}
              className="w-full py-4 px-6 bg-gradient-to-r from-purple-500 to-violet-500 text-white font-bold text-lg rounded-xl hover:from-purple-600 hover:to-violet-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-purple-500/25"
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
            {/* Progress Card */}
            <div className={`bg-slate-800/90 backdrop-blur-xl rounded-3xl border border-slate-700 p-8 shadow-2xl`}>
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                {tt('results')}
              </h2>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-300">{tt('progress')}</span>
                  <span className={`font-bold ${getStatusColor(result.status)}`}>{animatedProgress}%</span>
                </div>
                <div className="h-4 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${getProgressColor(result.progress)} rounded-full transition-all duration-1000`}
                    style={{ width: `${Math.min(100, animatedProgress)}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>{formatCurrency(parseNumber(currentEarnings))}</span>
                  <span>{formatCurrency(parseNumber(monthlyGoal))}</span>
                </div>
              </div>

              {/* Remaining */}
              <div className="text-center mb-8">
                <p className="text-slate-300 mb-2">{tt('remaining')}</p>
                <div className="text-5xl font-bold text-white">
                  {formatCurrency(result.remaining)}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-900/60 rounded-xl p-4 text-center border border-slate-700/50">
                  <p className="text-slate-400 text-xs mb-1">{tt('dailyTarget')}</p>
                  <p className="text-xl font-bold text-white">{formatCurrency(result.dailyTarget)}</p>
                </div>
                <div className="bg-slate-900/60 rounded-xl p-4 text-center border border-slate-700/50">
                  <p className="text-slate-400 text-xs mb-1">{tt('weeklyTarget')}</p>
                  <p className="text-xl font-bold text-white">{formatCurrency(result.weeklyTarget)}</p>
                </div>
                <div className="bg-slate-900/60 rounded-xl p-4 text-center border border-slate-700/50">
                  <p className="text-slate-400 text-xs mb-1">{tt('tripsNeeded')}</p>
                  <p className="text-xl font-bold text-white">{result.tripsNeeded}</p>
                </div>
                <div className="bg-slate-900/60 rounded-xl p-4 text-center border border-slate-700/50">
                  <p className="text-slate-400 text-xs mb-1">{tt('daysNeeded')}</p>
                  <p className="text-xl font-bold text-white">{result.daysNeeded}</p>
                </div>
              </div>
            </div>

            {/* Insights Card */}
            <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-slate-700 p-6 shadow-xl">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="text-xl">💡</span> {tt('insights.title')}
              </h3>
              <p className={`${getStatusColor(result.status)} text-lg`}>
                {tt(`insights.${result.status}`)}
              </p>
            </div>

            {/* Tips Card */}
            <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-slate-700 p-6 shadow-xl">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="text-xl">🎯</span> {tt('tips.title')}
              </h3>
              <ul className="space-y-3">
                {['tip1', 'tip2', 'tip3', 'tip4'].map((tip, index) => (
                  <li key={tip} className="flex items-start gap-3 text-slate-300">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-500/30 text-purple-300 flex items-center justify-center text-sm font-medium">
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
                  setAnimatedProgress(0);
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

            {/* Daily Profit Calculator */}
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
                {locale === 'pt-BR' ? 'Calculadora de Lucro Real' : 'Daily Profit Calculator'}
              </h3>
              <p className="text-slate-400 text-sm">
                {locale === 'pt-BR'
                  ? 'Descubra quanto você realmente ganha por hora'
                  : 'Discover your real hourly earnings'}
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

        {/* SEO Content Sections */}
        <div className="mt-20">
          <SEOSections
            locale={locale}
            {...monthlyGoalSEO[locale as keyof typeof monthlyGoalSEO] || monthlyGoalSEO['en-US']}
          />
        </div>
      </div>
    </div>
  );
}

