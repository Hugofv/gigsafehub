'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/contexts/I18nContext';
import { trackToolStart, trackEvent } from '@/lib/analytics';

interface CalculatorResult {
  costPerTrip: number;
  costPerKm: number;
  breakEvenFare: number;
  profitMargin: number;
  fuelCostPerTrip: number;
  wearCostPerTrip: number;
  platformFeePerTrip: number;
  status: 'profitable' | 'marginal' | 'loss';
}

interface CostPerTripCalculatorProps {
  locale: string;
}

export default function CostPerTripCalculator({ locale }: CostPerTripCalculatorProps) {
  const { t } = useTranslation();
  const [averageDistance, setAverageDistance] = useState('');
  const [fuelConsumption, setFuelConsumption] = useState('');
  const [fuelPrice, setFuelPrice] = useState('');
  const [averageFare, setAverageFare] = useState('');
  const [platformFee, setPlatformFee] = useState('25');
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const currencySymbol = locale === 'pt-BR' ? 'R$' : '$';
  const distanceUnit = locale === 'pt-BR' ? 'km' : 'mi';
  const consumptionUnit = locale === 'pt-BR' ? 'km/l' : 'mpg';

  useEffect(() => {
    trackEvent('calculator_view', { tool_name: 'cost_per_trip_calculator' });
  }, []);

  const parseNumber = (value: string) => {
    const cleaned = value.replace(/[^0-9.,]/g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setCalculating(true);
    trackToolStart('cost_per_trip_calculator');

    setTimeout(() => {
      const distance = parseNumber(averageDistance);
      const consumption = parseNumber(fuelConsumption);
      const fuel = parseNumber(fuelPrice);
      const fare = parseNumber(averageFare);
      const fee = parseNumber(platformFee) / 100;

      // Calculate fuel cost per trip
      const fuelPerTrip = consumption > 0 ? (distance / consumption) * fuel : 0;

      // Calculate wear cost (approximately R$0.15-0.20 per km for maintenance, tires, etc.)
      const wearPerKm = locale === 'pt-BR' ? 0.18 : 0.12;
      const wearPerTrip = distance * wearPerKm;

      // Platform fee
      const platformFeeAmount = fare * fee;

      // Total cost per trip
      const totalCost = fuelPerTrip + wearPerTrip + platformFeeAmount;

      // Cost per km
      const costPerKm = distance > 0 ? totalCost / distance : 0;

      // Break-even fare (minimum fare to not lose money)
      const breakEven = (fuelPerTrip + wearPerTrip) / (1 - fee);

      // Profit margin
      const netEarnings = fare - totalCost;
      const profitMargin = fare > 0 ? (netEarnings / fare) * 100 : 0;

      // Status
      let status: 'profitable' | 'marginal' | 'loss' = 'profitable';
      if (profitMargin < 0) status = 'loss';
      else if (profitMargin < 20) status = 'marginal';

      setResult({
        costPerTrip: totalCost,
        costPerKm,
        breakEvenFare: breakEven,
        profitMargin,
        fuelCostPerTrip: fuelPerTrip,
        wearCostPerTrip: wearPerTrip,
        platformFeePerTrip: platformFeeAmount,
        status,
      });

      setCalculating(false);

      trackEvent('calculator_complete', {
        tool_name: 'cost_per_trip_calculator',
        status,
        profit_margin_range: profitMargin < 0 ? 'negative' : profitMargin < 20 ? '0-20' : profitMargin < 40 ? '20-40' : '40+',
      });

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 800);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'profitable': return 'text-emerald-400';
      case 'marginal': return 'text-amber-400';
      case 'loss': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'profitable': return 'bg-emerald-500/20 border-emerald-500/30';
      case 'marginal': return 'bg-amber-500/20 border-amber-500/30';
      case 'loss': return 'bg-red-500/20 border-red-500/30';
      default: return 'bg-slate-500/20 border-slate-500/30';
    }
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

  const tt = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      'pt-BR': {
        title: 'Calculadora de Custo por Corrida',
        subtitle: 'Descubra quanto custa cada corrida e se vale a pena aceitar',
        averageDistance: 'Distância Média por Corrida',
        averageDistanceHelp: 'Quantos km você roda em média por corrida',
        fuelConsumption: 'Consumo do Veículo',
        fuelConsumptionHelp: 'Quantos km seu veículo faz por litro',
        fuelPrice: 'Preço do Combustível',
        fuelPriceHelp: 'Preço atual por litro',
        averageFare: 'Valor Médio da Corrida',
        averageFareHelp: 'Quanto você recebe em média por corrida',
        platformFee: 'Taxa da Plataforma (%)',
        platformFeeHelp: 'Porcentagem que a plataforma cobra',
        calculate: 'Calcular Custo',
        calculating: 'Calculando...',
        results: 'Resultado da Análise',
        costPerTrip: 'Custo por Corrida',
        costPerKm: 'Custo por KM',
        breakEvenFare: 'Valor Mínimo para Lucrar',
        profitMargin: 'Margem de Lucro',
        breakdown: 'Detalhamento dos Custos',
        fuelCost: 'Combustível',
        wearCost: 'Desgaste (pneus, óleo, etc)',
        platformFeeCost: 'Taxa da Plataforma',
        status: {
          profitable: '✓ Corrida Lucrativa',
          marginal: '⚠ Margem Baixa - Avalie se compensa',
          loss: '✗ Prejuízo - Não aceite corridas assim',
        },
        insights: {
          title: 'Análise',
          profitable: 'Esta corrida tem uma boa margem de lucro. Continue aceitando corridas com esse perfil!',
          marginal: 'A margem está apertada. Considere aceitar apenas em horários de pico ou quando estiver próximo.',
          loss: 'Você está perdendo dinheiro! O valor da corrida não cobre seus custos. Recuse corridas com esse perfil.',
        },
        tip: 'Dica: Corridas curtas geralmente têm custo fixo alto proporcionalmente. Prefira corridas mais longas quando possível.',
        disclaimer: 'Os cálculos são estimativas baseadas nos valores informados. Custos reais podem variar.',
      },
      'en-US': {
        title: 'Cost per Trip Calculator',
        subtitle: 'Find out how much each trip costs and if it\'s worth accepting',
        averageDistance: 'Average Trip Distance',
        averageDistanceHelp: 'How many miles you drive per trip on average',
        fuelConsumption: 'Vehicle Fuel Economy',
        fuelConsumptionHelp: 'Miles per gallon your vehicle gets',
        fuelPrice: 'Fuel Price',
        fuelPriceHelp: 'Current price per gallon',
        averageFare: 'Average Trip Fare',
        averageFareHelp: 'How much you receive per trip on average',
        platformFee: 'Platform Fee (%)',
        platformFeeHelp: 'Percentage the platform charges',
        calculate: 'Calculate Cost',
        calculating: 'Calculating...',
        results: 'Analysis Results',
        costPerTrip: 'Cost per Trip',
        costPerKm: 'Cost per Mile',
        breakEvenFare: 'Minimum Fare to Profit',
        profitMargin: 'Profit Margin',
        breakdown: 'Cost Breakdown',
        fuelCost: 'Fuel',
        wearCost: 'Wear (tires, oil, etc)',
        platformFeeCost: 'Platform Fee',
        status: {
          profitable: '✓ Profitable Trip',
          marginal: '⚠ Low Margin - Evaluate if worth it',
          loss: '✗ Loss - Don\'t accept trips like this',
        },
        insights: {
          title: 'Analysis',
          profitable: 'This trip has a good profit margin. Keep accepting trips with this profile!',
          marginal: 'The margin is tight. Consider accepting only during peak hours or when nearby.',
          loss: 'You\'re losing money! The fare doesn\'t cover your costs. Decline trips with this profile.',
        },
        tip: 'Tip: Short trips usually have high fixed costs proportionally. Prefer longer trips when possible.',
        disclaimer: 'Calculations are estimates based on the values provided. Actual costs may vary.',
      },
    };
    return translations[locale]?.[key] || translations['en-US'][key] || key;
  };

  const getStatusText = (status: string) => {
    const statusTexts = tt('status') as unknown as Record<string, string>;
    return statusTexts[status] || '';
  };

  const getInsightText = (status: string) => {
    const insights = tt('insights') as unknown as Record<string, string>;
    return insights[status] || '';
  };

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl"></div>
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
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/30 mb-6">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse mr-2"></span>
            <span className="text-cyan-300 text-sm font-medium">
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
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Average Distance */}
              <div>
                <label className="block text-white font-medium mb-2">
                  {tt('averageDistance')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={averageDistance}
                    onChange={(e) => setAverageDistance(e.target.value)}
                    className="w-full px-4 py-4 pr-12 bg-slate-900 border border-slate-600 rounded-xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all placeholder:text-slate-500"
                    placeholder={locale === 'pt-BR' ? '8' : '5'}
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                    {distanceUnit}
                  </span>
                </div>
                <p className="text-slate-400 text-xs mt-1">{tt('averageDistanceHelp')}</p>
              </div>

              {/* Fuel Consumption */}
              <div>
                <label className="block text-white font-medium mb-2">
                  {tt('fuelConsumption')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={fuelConsumption}
                    onChange={(e) => setFuelConsumption(e.target.value)}
                    className="w-full px-4 py-4 pr-16 bg-slate-900 border border-slate-600 rounded-xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all placeholder:text-slate-500"
                    placeholder={locale === 'pt-BR' ? '10' : '25'}
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                    {consumptionUnit}
                  </span>
                </div>
                <p className="text-slate-400 text-xs mt-1">{tt('fuelConsumptionHelp')}</p>
              </div>

              {/* Fuel Price */}
              <div>
                <label className="block text-white font-medium mb-2">
                  {tt('fuelPrice')}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 font-medium">
                    {currencySymbol}
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={fuelPrice}
                    onChange={(e) => setFuelPrice(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-600 rounded-xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all placeholder:text-slate-500"
                    placeholder={locale === 'pt-BR' ? '5,50' : '3.50'}
                    required
                  />
                </div>
                <p className="text-slate-400 text-xs mt-1">{tt('fuelPriceHelp')}</p>
              </div>

              {/* Average Fare */}
              <div>
                <label className="block text-white font-medium mb-2">
                  {tt('averageFare')}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 font-medium">
                    {currencySymbol}
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={averageFare}
                    onChange={(e) => setAverageFare(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-600 rounded-xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all placeholder:text-slate-500"
                    placeholder={locale === 'pt-BR' ? '15' : '12'}
                    required
                  />
                </div>
                <p className="text-slate-400 text-xs mt-1">{tt('averageFareHelp')}</p>
              </div>
            </div>

            {/* Platform Fee */}
            <div>
              <label className="block text-white font-medium mb-2">
                {tt('platformFee')}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={platformFee}
                  onChange={(e) => setPlatformFee(e.target.value)}
                  className="w-full px-4 py-4 pr-12 bg-slate-900 border border-slate-600 rounded-xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
                  min="0"
                  max="50"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">%</span>
              </div>
              <p className="text-slate-400 text-xs mt-1">{tt('platformFeeHelp')}</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={calculating}
              className="w-full py-4 px-6 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold text-lg rounded-xl hover:from-cyan-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-cyan-500/25"
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
            {/* Status Card */}
            <div className={`${getStatusBg(result.status)} backdrop-blur-xl rounded-3xl border p-6 text-center`}>
              <p className={`text-2xl font-bold ${getStatusColor(result.status)}`}>
                {getStatusText(result.status)}
              </p>
            </div>

            {/* Main Results */}
            <div className="bg-slate-800/90 backdrop-blur-xl rounded-3xl border border-slate-700 p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                {tt('results')}
              </h2>

              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-900/60 rounded-xl p-4 text-center border border-slate-700/50">
                  <p className="text-slate-400 text-sm mb-1">{tt('costPerTrip')}</p>
                  <p className="text-3xl font-bold text-white">{formatCurrency(result.costPerTrip)}</p>
                </div>
                <div className="bg-slate-900/60 rounded-xl p-4 text-center border border-slate-700/50">
                  <p className="text-slate-400 text-sm mb-1">{tt('breakEvenFare')}</p>
                  <p className="text-3xl font-bold text-cyan-400">{formatCurrency(result.breakEvenFare)}</p>
                </div>
                <div className="bg-slate-900/60 rounded-xl p-4 text-center border border-slate-700/50">
                  <p className="text-slate-400 text-sm mb-1">{tt('costPerKm')}</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(result.costPerKm)}/{distanceUnit}</p>
                </div>
                <div className="bg-slate-900/60 rounded-xl p-4 text-center border border-slate-700/50">
                  <p className="text-slate-400 text-sm mb-1">{tt('profitMargin')}</p>
                  <p className={`text-2xl font-bold ${getStatusColor(result.status)}`}>
                    {result.profitMargin.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-3">
                <h3 className="text-white font-semibold">{tt('breakdown')}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center bg-slate-900/60 rounded-lg p-3 border border-slate-700/50">
                    <span className="text-slate-300">{tt('fuelCost')}</span>
                    <span className="text-white font-semibold">{formatCurrency(result.fuelCostPerTrip)}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900/60 rounded-lg p-3 border border-slate-700/50">
                    <span className="text-slate-300">{tt('wearCost')}</span>
                    <span className="text-white font-semibold">{formatCurrency(result.wearCostPerTrip)}</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-900/60 rounded-lg p-3 border border-slate-700/50">
                    <span className="text-slate-300">{tt('platformFeeCost')}</span>
                    <span className="text-white font-semibold">{formatCurrency(result.platformFeePerTrip)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Insights */}
            <div className="bg-slate-800/80 backdrop-blur-xl rounded-3xl border border-slate-700 p-6 shadow-xl">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </span>
                {(tt('insights') as unknown as Record<string, string>).title}
              </h3>
              <p className={`${getStatusColor(result.status)} text-lg`}>
                {getInsightText(result.status)}
              </p>
            </div>

            {/* Tip */}
            <div className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
              <p className="text-slate-300 text-sm">
                💡 {tt('tip')}
              </p>
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
                {locale === 'pt-BR' ? 'Descubra quanto você realmente ganha por hora' : 'Discover your real hourly earnings'}
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
                {locale === 'pt-BR' ? 'Compare gasolina vs etanol' : 'Compare gas vs ethanol'}
              </p>
            </Link>

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
                {locale === 'pt-BR' ? 'Descubra gastos que você ignora' : 'Find costs you overlook'}
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
      </div>
    </div>
  );
}

