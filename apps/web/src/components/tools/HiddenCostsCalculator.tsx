'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/contexts/I18nContext';
import { trackToolStart, trackEvent } from '@/lib/analytics';

interface CalculatorResult {
  totalMonthlyCosts: number;
  dailyCosts: number;
  costPerKm: number;
  depreciation: number;
  tireWear: number;
  oilChanges: number;
  brakes: number;
  level: 'high' | 'medium' | 'low';
  breakdown: {
    vehicle: number;
    insurance: number;
    technology: number;
    savings: number;
  };
}

interface HiddenCostsCalculatorProps {
  locale: string;
}

export default function HiddenCostsCalculator({ locale }: HiddenCostsCalculatorProps) {
  const { t } = useTranslation();
  const [vehicleValue, setVehicleValue] = useState('');
  const [vehicleAge, setVehicleAge] = useState('3');
  const [monthlyKm, setMonthlyKm] = useState('');
  const [phoneAndData, setPhoneAndData] = useState('');
  const [carInsurance, setCarInsurance] = useState('');
  const [healthInsurance, setHealthInsurance] = useState('');
  const [emergencyFund, setEmergencyFund] = useState('');
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [animatedTotal, setAnimatedTotal] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  const currencySymbol = locale === 'pt-BR' ? 'R$' : '$';

  // Track page view on mount
  useEffect(() => {
    trackEvent('calculator_view', { tool_name: 'hidden_costs_calculator' });
  }, []);

  // Animate total
  useEffect(() => {
    if (result) {
      const target = result.totalMonthlyCosts;
      const duration = 1500;
      const steps = 60;
      const increment = target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setAnimatedTotal(target);
          clearInterval(timer);
        } else {
          setAnimatedTotal(Math.floor(current));
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

    trackToolStart('hidden_costs_calculator');

    setTimeout(() => {
      const vValue = parseNumber(vehicleValue);
      const vAge = parseInt(vehicleAge) || 3;
      const km = parseNumber(monthlyKm);
      const phone = parseNumber(phoneAndData);
      const carIns = parseNumber(carInsurance);
      const healthIns = parseNumber(healthInsurance);
      const emergency = parseNumber(emergencyFund);

      // Calculate depreciation (more aggressive for older/high-mileage vehicles)
      const baseDepreciationRate = 0.015; // 1.5% per month base
      const ageMultiplier = 1 + (vAge * 0.05); // Higher depreciation for older cars
      const kmMultiplier = 1 + (km / 5000) * 0.1; // Higher depreciation for more km
      const depreciation = vValue * baseDepreciationRate * ageMultiplier * kmMultiplier;

      // Calculate wear costs based on km
      const costPerKmTire = locale === 'pt-BR' ? 0.08 : 0.05; // R$/km or $/km
      const costPerKmOil = locale === 'pt-BR' ? 0.03 : 0.02;
      const costPerKmBrakes = locale === 'pt-BR' ? 0.04 : 0.03;

      const tireWear = km * costPerKmTire;
      const oilChanges = km * costPerKmOil;
      const brakes = km * costPerKmBrakes;

      // Calculate totals
      const vehicleCosts = depreciation + tireWear + oilChanges + brakes;
      const insuranceCosts = carIns + healthIns;
      const technologyCosts = phone;
      const savingsCosts = emergency;

      const totalMonthlyCosts = vehicleCosts + insuranceCosts + technologyCosts + savingsCosts;
      const workingDays = 22;
      const dailyCosts = totalMonthlyCosts / workingDays;
      const costPerKm = km > 0 ? totalMonthlyCosts / km : 0;

      // Determine level
      let level: 'high' | 'medium' | 'low';
      const threshold = locale === 'pt-BR' ? 2000 : 800;
      if (totalMonthlyCosts > threshold * 1.5) {
        level = 'high';
      } else if (totalMonthlyCosts > threshold * 0.8) {
        level = 'medium';
      } else {
        level = 'low';
      }

      const resultData: CalculatorResult = {
        totalMonthlyCosts: Math.round(totalMonthlyCosts),
        dailyCosts: Math.round(dailyCosts * 100) / 100,
        costPerKm: Math.round(costPerKm * 100) / 100,
        depreciation: Math.round(depreciation),
        tireWear: Math.round(tireWear),
        oilChanges: Math.round(oilChanges),
        brakes: Math.round(brakes),
        level,
        breakdown: {
          vehicle: Math.round(vehicleCosts),
          insurance: Math.round(insuranceCosts),
          technology: Math.round(technologyCosts),
          savings: Math.round(savingsCosts),
        },
      };

      setResult(resultData);
      setCalculating(false);

      trackEvent('calculator_submit', {
        tool_name: 'hidden_costs_calculator',
        total_costs_range: totalMonthlyCosts < 500 ? '0-500' : totalMonthlyCosts < 1000 ? '500-1000' : totalMonthlyCosts < 2000 ? '1000-2000' : '2000+',
        level: level,
      });

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 1000);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-emerald-400';
      case 'medium': return 'text-amber-400';
      case 'high': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getLevelBg = (level: string) => {
    switch (level) {
      case 'low': return 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30';
      case 'medium': return 'from-amber-500/20 to-amber-600/20 border-amber-500/30';
      case 'high': return 'from-red-500/20 to-red-600/20 border-red-500/30';
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

  const tt = (key: string) => t(`tools.hiddenCostsCalculator.${key}`);

  const CategoryIcon = ({ category, className = "w-5 h-5" }: { category: string; className?: string }) => {
    switch (category) {
      case 'vehicle':
        return (
          <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h8m-8 5h8m-4-9a9 9 0 110 18 9 9 0 010-18z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v1a2 2 0 002 2h2a2 2 0 002-2v-1M5 11V7a2 2 0 012-2h10a2 2 0 012 2v4M5 11h14M5 11l-2 6h18l-2-6" />
          </svg>
        );
      case 'insurance':
        return (
          <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case 'technology':
        return (
          <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      case 'savings':
        return (
          <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        );
      default:
        return (
          <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
    }
  };

  const toolsPath = locale === 'pt-BR' ? '/ferramentas' : '/tools';
  const toolsLabel = locale === 'pt-BR' ? 'Ferramentas' : 'Tools';
  const homeLabel = locale === 'pt-BR' ? 'Início' : 'Home';

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-rose-600/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
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
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-rose-500/20 border border-rose-500/30 mb-6">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse mr-2"></span>
            <span className="text-rose-300 text-sm font-medium">
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
            {/* Vehicle Section */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center">
                  <CategoryIcon category="vehicle" className="w-4 h-4 text-rose-400" />
                </span>
                {tt('category.vehicle')}
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    {tt('vehicleValue')}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400 font-medium text-sm">
                      {currencySymbol}
                    </span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={vehicleValue}
                      onChange={(e) => setVehicleValue(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all placeholder:text-slate-500"
                      placeholder={locale === 'pt-BR' ? '50.000' : '25,000'}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    {tt('vehicleAge')}
                  </label>
                  <input
                    type="number"
                    value={vehicleAge}
                    onChange={(e) => setVehicleAge(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
                    min="0"
                    max="20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  {tt('monthlyMiles')}
                </label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={monthlyKm}
                  onChange={(e) => setMonthlyKm(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all placeholder:text-slate-500"
                  placeholder={locale === 'pt-BR' ? '3000' : '2000'}
                  required
                />
                <p className="text-slate-400 text-xs mt-1">{tt('monthlyMilesHelp')}</p>
              </div>
            </div>

            {/* Insurance Section */}
            <div className="space-y-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center">
                  <CategoryIcon category="insurance" className="w-4 h-4 text-rose-400" />
                </span>
                {tt('category.insurance')}
              </h3>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    {tt('carInsurance')}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400 font-medium text-sm">
                      {currencySymbol}
                    </span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={carInsurance}
                      onChange={(e) => setCarInsurance(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all placeholder:text-slate-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    {tt('healthInsurance')}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400 font-medium text-sm">
                      {currencySymbol}
                    </span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={healthInsurance}
                      onChange={(e) => setHealthInsurance(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all placeholder:text-slate-500"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Technology & Savings */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                  <span className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center">
                    <CategoryIcon category="technology" className="w-4 h-4 text-rose-400" />
                  </span>
                  {tt('category.technology')}
                </h3>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400 font-medium text-sm">
                    {currencySymbol}
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={phoneAndData}
                    onChange={(e) => setPhoneAndData(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all placeholder:text-slate-500"
                    placeholder="0"
                  />
                </div>
                <p className="text-slate-400 text-xs mt-1">{tt('phoneAndDataHelp')}</p>
              </div>

              <div>
                <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                  <span className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center">
                    <CategoryIcon category="savings" className="w-4 h-4 text-rose-400" />
                  </span>
                  {tt('category.savings')}
                </h3>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-400 font-medium text-sm">
                    {currencySymbol}
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={emergencyFund}
                    onChange={(e) => setEmergencyFund(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all placeholder:text-slate-500"
                    placeholder="0"
                  />
                </div>
                <p className="text-slate-400 text-xs mt-1">{tt('emergencyFundHelp')}</p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={calculating || !vehicleValue || !monthlyKm}
              className="w-full py-4 px-6 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-lg rounded-xl hover:from-rose-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-rose-500/25"
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
            <div className="bg-slate-800/90 backdrop-blur-xl rounded-3xl border border-slate-700 p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                {tt('results')}
              </h2>

              {/* Big Number */}
              <div className="text-center mb-8">
                <p className="text-slate-300 mb-2">{tt('totalMonthlyCosts')}</p>
                <div className="text-5xl sm:text-6xl font-bold text-white mb-2">
                  {formatCurrency(animatedTotal)}
                </div>
                <p className="text-slate-400">
                  {tt('dailyCosts')}: <span className="text-white font-semibold">{formatCurrency(result.dailyCosts)}</span>/dia
                </p>
              </div>

              {/* Cost per KM */}
              <div className="bg-slate-900/60 rounded-xl p-4 text-center mb-6 border border-slate-700/50">
                <p className="text-slate-400 text-sm">{tt('costPerMile')}</p>
                <p className="text-2xl font-bold text-white">
                  {formatCurrency(result.costPerKm)}/{locale === 'pt-BR' ? 'km' : 'mi'}
                </p>
              </div>

              {/* Category Breakdown */}
              <div className="space-y-3">
                <h3 className="text-white font-semibold">{tt('breakdown')}</h3>
                {Object.entries(result.breakdown).map(([category, value]) => (
                  value > 0 && (
                    <div key={category} className="flex justify-between items-center bg-slate-900/60 rounded-lg p-3 border border-slate-700/50">
                      <span className="text-slate-300 flex items-center gap-2">
                        <CategoryIcon category={category} className="w-4 h-4 text-rose-400" />
                        {tt(`category.${category}`)}
                      </span>
                      <span className="text-white font-semibold">{formatCurrency(value)}</span>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Vehicle Wear Breakdown */}
            <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-slate-700 p-6 shadow-xl">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                {locale === 'pt-BR' ? 'Desgaste do Veículo' : 'Vehicle Wear'}
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">{tt('depreciation')}</span>
                  <span className="text-rose-400 font-medium">{formatCurrency(result.depreciation)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">{tt('tireWear')}</span>
                  <span className="text-rose-400 font-medium">{formatCurrency(result.tireWear)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">{tt('oilChanges')}</span>
                  <span className="text-rose-400 font-medium">{formatCurrency(result.oilChanges)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">{tt('brakes')}</span>
                  <span className="text-rose-400 font-medium">{formatCurrency(result.brakes)}</span>
                </div>
              </div>
            </div>

            {/* Insights Card */}
            <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-slate-700 p-6 shadow-xl">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </span>
                {tt('insights.title')}
              </h3>
              <p className={`${getLevelColor(result.level)} text-lg`}>
                {tt(`insights.${result.level}`)}
              </p>
            </div>

            {/* Tips Card */}
            <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-slate-700 p-6 shadow-xl">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </span>
                {tt('tips.title')}
              </h3>
              <ul className="space-y-3">
                {['tip1', 'tip2', 'tip3', 'tip4'].map((tip, index) => (
                  <li key={tip} className="flex items-start gap-3 text-slate-300">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-rose-500/30 text-rose-300 flex items-center justify-center text-sm font-medium">
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
                  setAnimatedTotal(0);
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
      </div>
    </div>
  );
}

