'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/contexts/I18nContext';
import { trackToolStart, trackSimulatorCalculation, trackSimulatorView } from '@/lib/analytics';

interface SimulatorResult {
  potentialLoss: number;
  dailyRate: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  monthsOfSavingsNeeded: number;
}

interface LossIncomeSimulatorProps {
  locale: string;
}

export default function LossIncomeSimulator({ locale }: LossIncomeSimulatorProps) {
  const { t } = useTranslation();
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [workingDays, setWorkingDays] = useState('22');
  const [profession, setProfession] = useState('');
  const [recoveryTime, setRecoveryTime] = useState('30');
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<SimulatorResult | null>(null);
  const [animatedLoss, setAnimatedLoss] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  const currencySymbol = locale === 'pt-BR' ? 'R$' : '$';

  // Track page view on mount
  useEffect(() => {
    trackSimulatorView();
  }, []);

  // Animate the loss counter
  useEffect(() => {
    if (result) {
      const target = result.potentialLoss;
      const duration = 1500;
      const steps = 60;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setAnimatedLoss(target);
          clearInterval(timer);
        } else {
          setAnimatedLoss(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [result]);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setCalculating(true);

    // Track tool start
    trackToolStart('loss_income_simulator');

    setTimeout(() => {
      const income = parseFloat(monthlyIncome.replace(/[^0-9.]/g, ''));
      const days = parseInt(workingDays);
      const recovery = parseInt(recoveryTime);

      const dailyRate = income / days;
      const potentialLoss = dailyRate * recovery;

      // Calculate risk level based on loss vs income ratio
      const monthsOfLoss = potentialLoss / income;
      let riskLevel: 'low' | 'medium' | 'high' | 'critical';

      if (monthsOfLoss < 1) {
        riskLevel = 'low';
      } else if (monthsOfLoss < 2) {
        riskLevel = 'medium';
      } else if (monthsOfLoss < 3) {
        riskLevel = 'high';
      } else {
        riskLevel = 'critical';
      }

      const resultData = {
        potentialLoss: Math.round(potentialLoss),
        dailyRate: Math.round(dailyRate),
        riskLevel,
        monthsOfSavingsNeeded: Math.ceil(monthsOfLoss),
      };

      setResult(resultData);
      setCalculating(false);

      // Track simulation complete
      trackSimulatorCalculation({
        monthlyIncome: income,
        daysOff: recovery,
        hasInsurance: false,
        estimatedLoss: resultData.potentialLoss,
      });

      // Scroll to results
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 1200);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-emerald-500';
      case 'medium': return 'text-amber-500';
      case 'high': return 'text-orange-500';
      case 'critical': return 'text-red-500';
      default: return 'text-slate-500';
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-emerald-500/10 border-emerald-500/30';
      case 'medium': return 'bg-amber-500/10 border-amber-500/30';
      case 'high': return 'bg-orange-500/10 border-orange-500/30';
      case 'critical': return 'bg-red-500/10 border-red-500/30';
      default: return 'bg-slate-500/10 border-slate-500/30';
    }
  };

  const getRiskLabel = (level: string) => {
    switch (level) {
      case 'low': return t('tools.lossIncomeSimulator.riskLow');
      case 'medium': return t('tools.lossIncomeSimulator.riskMedium');
      case 'high': return t('tools.lossIncomeSimulator.riskHigh');
      case 'critical': return t('tools.lossIncomeSimulator.riskCritical');
      default: return '';
    }
  };

  const formatCurrency = (value: number) => {
    if (locale === 'pt-BR') {
      return value.toLocaleString('pt-BR');
    }
    return value.toLocaleString('en-US');
  };

  const handleInputChange = (value: string, setter: (val: string) => void) => {
    // Remove non-numeric characters except for decimals
    const numericValue = value.replace(/[^0-9]/g, '');
    setter(numericValue);
  };

  const professions = [
    { value: 'rideshare', label: t('tools.lossIncomeSimulator.professions.rideshare') },
    { value: 'delivery', label: t('tools.lossIncomeSimulator.professions.delivery') },
    { value: 'freelancer', label: t('tools.lossIncomeSimulator.professions.freelancer') },
    { value: 'handyman', label: t('tools.lossIncomeSimulator.professions.handyman') },
    { value: 'photographer', label: t('tools.lossIncomeSimulator.professions.photographer') },
    { value: 'other', label: t('tools.lossIncomeSimulator.professions.other') },
  ];

  const scenarios = [
    {
      icon: '🚗',
      title: t('tools.lossIncomeSimulator.scenarios.accident'),
      days: t('tools.lossIncomeSimulator.scenarios.accidentDays'),
      recoveryDays: 60
    },
    {
      icon: '🏥',
      title: t('tools.lossIncomeSimulator.scenarios.illness'),
      days: t('tools.lossIncomeSimulator.scenarios.illnessDays'),
      recoveryDays: 30
    },
    {
      icon: '🩹',
      title: t('tools.lossIncomeSimulator.scenarios.injury'),
      days: t('tools.lossIncomeSimulator.scenarios.injuryDays'),
      recoveryDays: 14
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-navy-900">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-sm mb-8">
            <Link href={`/${locale}`} className="text-slate-400 hover:text-white transition-colors">
              {t('common.home')}
            </Link>
            <span className="text-slate-600">/</span>
            <Link
              href={locale === 'pt-BR' ? `/${locale}/ferramentas` : `/${locale}/tools`}
              className="text-slate-400 hover:text-white transition-colors"
            >
              {t('tools.title')}
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-white font-medium">{t('tools.lossIncomeSimulator.title')}</span>
          </nav>

          {/* Title Section */}
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-500/20 text-orange-400 text-sm font-medium mb-6">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              {t('tools.title')}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
              {t('tools.lossIncomeSimulator.title')}
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              {t('tools.lossIncomeSimulator.description')}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Calculator Form */}
          <div className="lg:col-span-3">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
              {!result ? (
                <form onSubmit={handleCalculate} className="space-y-6">
                  {/* Monthly Income */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      {t('tools.lossIncomeSimulator.monthlyIncome')}
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                        {currencySymbol}
                      </span>
                      <input
                        type="text"
                        required
                        value={monthlyIncome}
                        onChange={(e) => handleInputChange(e.target.value, setMonthlyIncome)}
                        placeholder={locale === 'pt-BR' ? '5000' : '3000'}
                        className="w-full bg-white/5 border border-white/20 rounded-xl pl-12 pr-4 py-4 text-white text-lg font-semibold placeholder:text-slate-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <p className="mt-2 text-xs text-slate-400">{t('tools.lossIncomeSimulator.monthlyIncomeHelp')}</p>
                  </div>

                  {/* Working Days */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      {t('tools.lossIncomeSimulator.workingDays')}
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="31"
                      value={workingDays}
                      onChange={(e) => setWorkingDays(e.target.value)}
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-4 text-white text-lg font-semibold focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    />
                    <p className="mt-2 text-xs text-slate-400">{t('tools.lossIncomeSimulator.workingDaysHelp')}</p>
                  </div>

                  {/* Profession */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      {t('tools.lossIncomeSimulator.profession')}
                    </label>
                    <select
                      required
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                      className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-4 text-white text-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`, backgroundPosition: 'right 1rem center', backgroundSize: '1.5rem', backgroundRepeat: 'no-repeat' }}
                    >
                      <option value="" className="bg-slate-800">{t('tools.lossIncomeSimulator.professionHelp')}</option>
                      {professions.map((p) => (
                        <option key={p.value} value={p.value} className="bg-slate-800">
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Recovery Time */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      {t('tools.lossIncomeSimulator.recoveryTime')}
                    </label>
                    <div className="relative">
                      <input
                        type="range"
                        min="7"
                        max="180"
                        value={recoveryTime}
                        onChange={(e) => setRecoveryTime(e.target.value)}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500"
                      />
                      <div className="flex justify-between mt-3">
                        <span className="text-xs text-slate-400">7 {locale === 'pt-BR' ? 'dias' : 'days'}</span>
                        <span className="text-2xl font-bold text-orange-400">{recoveryTime} {locale === 'pt-BR' ? 'dias' : 'days'}</span>
                        <span className="text-xs text-slate-400">180 {locale === 'pt-BR' ? 'dias' : 'days'}</span>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">{t('tools.lossIncomeSimulator.recoveryTimeHelp')}</p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={calculating || !monthlyIncome || !profession}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-5 px-8 rounded-xl text-lg transition-all duration-300 shadow-lg shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center space-x-3"
                  >
                    {calculating ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>{t('tools.lossIncomeSimulator.calculating')}</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span>{t('tools.lossIncomeSimulator.calculate')}</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div ref={resultRef} className="animate-fade-in">
                  <h2 className="text-2xl font-bold text-white mb-8 text-center">
                    {t('tools.lossIncomeSimulator.results')}
                  </h2>

                  {/* Main Loss Display */}
                  <div className="text-center mb-8 p-8 rounded-2xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30">
                    <p className="text-slate-300 text-sm uppercase tracking-wider mb-2">
                      {t('tools.lossIncomeSimulator.potentialLoss')}
                    </p>
                    <div className="text-5xl md:text-6xl font-black text-white mb-2">
                      {currencySymbol} {formatCurrency(animatedLoss)}
                    </div>
                    <p className="text-slate-400">
                      {t('tools.lossIncomeSimulator.dailyRate')}: {currencySymbol} {formatCurrency(result.dailyRate)}/{locale === 'pt-BR' ? 'dia' : 'day'}
                    </p>
                  </div>

                  {/* Risk Level */}
                  <div className={`p-6 rounded-xl border ${getRiskBgColor(result.riskLevel)} mb-8`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-400 mb-1">{t('tools.lossIncomeSimulator.riskLevel')}</p>
                        <p className={`text-2xl font-bold ${getRiskColor(result.riskLevel)}`}>
                          {getRiskLabel(result.riskLevel)}
                        </p>
                      </div>
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${getRiskBgColor(result.riskLevel)}`}>
                        {result.riskLevel === 'critical' && (
                          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                        )}
                        {result.riskLevel === 'high' && (
                          <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        {result.riskLevel === 'medium' && (
                          <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        {result.riskLevel === 'low' && (
                          <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="p-6 rounded-xl bg-teal-500/10 border border-teal-500/30 mb-8">
                    <h3 className="font-bold text-teal-400 mb-2 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      {t('tools.lossIncomeSimulator.recommendation')}
                    </h3>
                    <p className="text-slate-300 text-sm">
                      {t('tools.lossIncomeSimulator.recommendationText')}
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => {
                        setResult(null);
                        setAnimatedLoss(0);
                      }}
                      className="px-8 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-semibold hover:from-teal-600 hover:to-teal-700 transition-all shadow-lg shadow-teal-500/30"
                    >
                      {t('tools.lossIncomeSimulator.startOver')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Scenarios */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 sticky top-8">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                <svg className="w-5 h-5 mr-2 text-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {t('tools.lossIncomeSimulator.scenarios.title')}
              </h3>

              <div className="space-y-4">
                {scenarios.map((scenario, idx) => (
                  <button
                    key={idx}
                    onClick={() => setRecoveryTime(scenario.recoveryDays.toString())}
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all text-left group"
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{scenario.icon}</span>
                      <div>
                        <p className="font-semibold text-white group-hover:text-orange-400 transition-colors">
                          {scenario.title}
                        </p>
                        <p className="text-xs text-slate-400">{scenario.days}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Disclaimer */}
              <div className="mt-8 p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                <p className="text-xs text-slate-400 leading-relaxed">
                  ⚠️ {t('tools.lossIncomeSimulator.disclaimer')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

