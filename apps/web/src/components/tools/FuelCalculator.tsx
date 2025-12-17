'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/contexts/I18nContext';
import { trackToolStart, trackEvent } from '@/lib/analytics';
import SEOSections, { fuelCalculatorSEO } from './SEOSections';

interface CalculatorResult {
  monthlyFuelCost: number;
  dailyFuelCost: number;
  costPerKm: number;
  litersPerMonth: number;
  ethanolRecommended: boolean;
  ethanolCost: number;
  gasolineCost: number;
  savings: number;
  savingsPercent: number;
}

interface FuelCalculatorProps {
  locale: string;
}

export default function FuelCalculator({ locale }: FuelCalculatorProps) {
  const { t } = useTranslation();
  const [monthlyKm, setMonthlyKm] = useState('');
  const [consumption, setConsumption] = useState('');
  const [gasolinePrice, setGasolinePrice] = useState('');
  const [ethanolPrice, setEthanolPrice] = useState('');
  const [ethanolConsumption, setEthanolConsumption] = useState('');
  const [calculating, setCalculating] = useState(false);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const currencySymbol = locale === 'pt-BR' ? 'R$' : '$';

  useEffect(() => {
    trackEvent('calculator_view', { tool_name: 'fuel_calculator' });
  }, []);

  const parseNumber = (value: string) => {
    const cleaned = value.replace(/[^0-9.,]/g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setCalculating(true);
    trackToolStart('fuel_calculator');

    setTimeout(() => {
      const km = parseNumber(monthlyKm);
      const gasConsumption = parseNumber(consumption);
      const gasPrice = parseNumber(gasolinePrice);
      const ethPrice = parseNumber(ethanolPrice);
      // Ethanol consumption is typically 70% of gasoline
      const ethConsumption = parseNumber(ethanolConsumption) || gasConsumption * 0.7;

      // Calculate gasoline costs
      const litersGasoline = gasConsumption > 0 ? km / gasConsumption : 0;
      const gasCost = litersGasoline * gasPrice;

      // Calculate ethanol costs
      const litersEthanol = ethConsumption > 0 ? km / ethConsumption : 0;
      const ethCost = litersEthanol * ethPrice;

      // Determine best option (ethanol is worth it if price is <= 70% of gasoline)
      const ethanolRatio = ethPrice / gasPrice;
      const consumptionRatio = ethConsumption / gasConsumption;
      const ethanolRecommended = ethPrice > 0 && (ethanolRatio <= consumptionRatio || ethCost < gasCost);

      const bestCost = ethanolRecommended && ethPrice > 0 ? ethCost : gasCost;
      const worstCost = ethanolRecommended && ethPrice > 0 ? gasCost : ethCost;
      const savings = worstCost - bestCost;
      const savingsPercent = worstCost > 0 ? (savings / worstCost) * 100 : 0;

      setResult({
        monthlyFuelCost: bestCost,
        dailyFuelCost: bestCost / 30,
        costPerKm: km > 0 ? bestCost / km : 0,
        litersPerMonth: ethanolRecommended && ethPrice > 0 ? litersEthanol : litersGasoline,
        ethanolRecommended: ethanolRecommended && ethPrice > 0,
        ethanolCost: ethCost,
        gasolineCost: gasCost,
        savings: savings > 0 ? savings : 0,
        savingsPercent: savingsPercent > 0 ? savingsPercent : 0,
      });

      setCalculating(false);

      trackEvent('calculator_complete', {
        tool_name: 'fuel_calculator',
        fuel_recommendation: ethanolRecommended ? 'ethanol' : 'gasoline',
        monthly_cost_range: bestCost < 500 ? '0-500' : bestCost < 1000 ? '500-1000' : bestCost < 2000 ? '1000-2000' : '2000+',
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
      title: 'Calculadora de Combustível',
      subtitle: 'Calcule seus gastos com combustível e descubra se vale usar etanol ou gasolina',
      monthlyKm: 'Quilômetros por Mês',
      monthlyKmHelp: 'Quantos km você roda por mês',
      consumption: 'Consumo com Gasolina',
      consumptionHelp: 'Quantos km/l seu veículo faz com gasolina',
      gasolinePrice: 'Preço da Gasolina',
      gasolinePriceHelp: 'Preço atual por litro',
      ethanolPrice: 'Preço do Etanol (opcional)',
      ethanolPriceHelp: 'Deixe vazio se não usar etanol',
      ethanolConsumption: 'Consumo com Etanol (opcional)',
      ethanolConsumptionHelp: 'Geralmente 70% do consumo com gasolina',
      calculate: 'Calcular Gastos',
      calculating: 'Calculando...',
      results: 'Resultado',
      monthlyFuelCost: 'Gasto Mensal com Combustível',
      dailyFuelCost: 'Gasto Diário Médio',
      costPerKm: 'Custo por KM',
      litersPerMonth: 'Litros por Mês',
      recommendation: 'Recomendação',
      useEthanol: '🌿 Use ETANOL - Mais econômico para você!',
      useGasoline: '⛽ Use GASOLINA - Melhor custo-benefício',
      comparison: 'Comparativo',
      withGasoline: 'Com Gasolina',
      withEthanol: 'Com Etanol',
      savings: 'Economia Mensal',
      savingsYear: 'Economia Anual',
      tip: 'Dica: A regra geral é usar etanol quando o preço for até 70% do preço da gasolina. Mas isso varia conforme o consumo do seu veículo.',
      disclaimer: 'Os cálculos são estimativas. O consumo real pode variar conforme condições de trânsito, estilo de direção e manutenção do veículo.',
    },
    'en-US': {
      title: 'Fuel Calculator',
      subtitle: 'Calculate your fuel expenses and find the best option',
      monthlyKm: 'Miles per Month',
      monthlyKmHelp: 'How many miles you drive per month',
      consumption: 'Fuel Economy (Gasoline)',
      consumptionHelp: 'Miles per gallon with gasoline',
      gasolinePrice: 'Gasoline Price',
      gasolinePriceHelp: 'Current price per gallon',
      ethanolPrice: 'Ethanol Price (optional)',
      ethanolPriceHelp: 'Leave empty if you don\'t use ethanol',
      ethanolConsumption: 'Fuel Economy with Ethanol (optional)',
      ethanolConsumptionHelp: 'Usually 70% of gasoline economy',
      calculate: 'Calculate Expenses',
      calculating: 'Calculating...',
      results: 'Results',
      monthlyFuelCost: 'Monthly Fuel Cost',
      dailyFuelCost: 'Average Daily Cost',
      costPerKm: 'Cost per Mile',
      litersPerMonth: 'Gallons per Month',
      recommendation: 'Recommendation',
      useEthanol: '🌿 Use ETHANOL - More economical for you!',
      useGasoline: '⛽ Use GASOLINE - Better cost-benefit',
      comparison: 'Comparison',
      withGasoline: 'With Gasoline',
      withEthanol: 'With Ethanol',
      savings: 'Monthly Savings',
      savingsYear: 'Yearly Savings',
      tip: 'Tip: The general rule is to use ethanol when the price is up to 70% of gasoline price. But this varies according to your vehicle\'s consumption.',
      disclaimer: 'Calculations are estimates. Actual consumption may vary depending on traffic conditions, driving style, and vehicle maintenance.',
    },
  };

  const tt = (key: string) => translations[locale]?.[key] || translations['en-US'][key] || key;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl"></div>
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
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-amber-500/20 border border-amber-500/30 mb-6">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse mr-2"></span>
            <span className="text-amber-300 text-sm font-medium">
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
            {/* Monthly KM */}
            <div>
              <label className="block text-white font-medium mb-2">
                {tt('monthlyKm')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="decimal"
                  value={monthlyKm}
                  onChange={(e) => setMonthlyKm(e.target.value)}
                  className="w-full px-4 py-4 pr-12 bg-slate-900 border border-slate-600 rounded-xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder:text-slate-500"
                  placeholder={locale === 'pt-BR' ? '3000' : '2000'}
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                  {locale === 'pt-BR' ? 'km' : 'mi'}
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-1">{tt('monthlyKmHelp')}</p>
            </div>

            {/* Gasoline Section */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  {tt('consumption')}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="decimal"
                    value={consumption}
                    onChange={(e) => setConsumption(e.target.value)}
                    className="w-full px-4 py-4 pr-16 bg-slate-900 border border-slate-600 rounded-xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder:text-slate-500"
                    placeholder={locale === 'pt-BR' ? '10' : '25'}
                    required
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                    {locale === 'pt-BR' ? 'km/l' : 'mpg'}
                  </span>
                </div>
                <p className="text-slate-400 text-xs mt-1">{tt('consumptionHelp')}</p>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  {tt('gasolinePrice')}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-400 font-medium">
                    {currencySymbol}
                  </span>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={gasolinePrice}
                    onChange={(e) => setGasolinePrice(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-900 border border-slate-600 rounded-xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder:text-slate-500"
                    placeholder={locale === 'pt-BR' ? '5,89' : '3.50'}
                    required
                  />
                </div>
                <p className="text-slate-400 text-xs mt-1">{tt('gasolinePriceHelp')}</p>
              </div>
            </div>

            {/* Ethanol Section */}
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <h3 className="text-green-400 font-semibold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
                {locale === 'pt-BR' ? 'Comparar com Etanol' : 'Compare with Ethanol'}
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    {tt('ethanolPrice')}
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400 font-medium text-sm">
                      {currencySymbol}
                    </span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={ethanolPrice}
                      onChange={(e) => setEthanolPrice(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all placeholder:text-slate-500"
                      placeholder={locale === 'pt-BR' ? '3,99' : '2.50'}
                    />
                  </div>
                  <p className="text-slate-400 text-xs mt-1">{tt('ethanolPriceHelp')}</p>
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    {tt('ethanolConsumption')}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={ethanolConsumption}
                      onChange={(e) => setEthanolConsumption(e.target.value)}
                      className="w-full px-4 py-3 pr-16 bg-slate-900 border border-slate-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all placeholder:text-slate-500"
                      placeholder={locale === 'pt-BR' ? '7' : '18'}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                      {locale === 'pt-BR' ? 'km/l' : 'mpg'}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">{tt('ethanolConsumptionHelp')}</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={calculating}
              className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg rounded-xl hover:from-amber-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-amber-500/25"
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
            {/* Recommendation */}
            <div className={`${result.ethanolRecommended ? 'bg-green-500/20 border-green-500/30' : 'bg-amber-500/20 border-amber-500/30'} backdrop-blur-xl rounded-3xl border p-6 text-center`}>
              <p className="text-slate-300 text-sm mb-2">{tt('recommendation')}</p>
              <p className={`text-2xl font-bold ${result.ethanolRecommended ? 'text-green-400' : 'text-amber-400'}`}>
                {result.ethanolRecommended ? tt('useEthanol') : tt('useGasoline')}
              </p>
            </div>

            {/* Main Results */}
            <div className="bg-slate-800/90 backdrop-blur-xl rounded-3xl border border-slate-700 p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                {tt('results')}
              </h2>

              <div className="text-center mb-8">
                <p className="text-slate-300 mb-2">{tt('monthlyFuelCost')}</p>
                <p className="text-5xl font-bold text-white">{formatCurrency(result.monthlyFuelCost)}</p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-900/60 rounded-xl p-4 text-center border border-slate-700/50">
                  <p className="text-slate-400 text-sm mb-1">{tt('dailyFuelCost')}</p>
                  <p className="text-xl font-bold text-white">{formatCurrency(result.dailyFuelCost)}</p>
                </div>
                <div className="bg-slate-900/60 rounded-xl p-4 text-center border border-slate-700/50">
                  <p className="text-slate-400 text-sm mb-1">{tt('costPerKm')}</p>
                  <p className="text-xl font-bold text-white">{formatCurrency(result.costPerKm)}/{locale === 'pt-BR' ? 'km' : 'mi'}</p>
                </div>
                <div className="bg-slate-900/60 rounded-xl p-4 text-center border border-slate-700/50">
                  <p className="text-slate-400 text-sm mb-1">{tt('litersPerMonth')}</p>
                  <p className="text-xl font-bold text-white">{result.litersPerMonth.toFixed(0)} {locale === 'pt-BR' ? 'L' : 'gal'}</p>
                </div>
              </div>

              {/* Comparison */}
              {result.ethanolCost > 0 && (
                <div className="space-y-4">
                  <h3 className="text-white font-semibold">{tt('comparison')}</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className={`rounded-xl p-4 border ${!result.ethanolRecommended ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-900/60 border-slate-700/50'}`}>
                      <p className="text-slate-400 text-sm mb-1">{tt('withGasoline')}</p>
                      <p className={`text-xl font-bold ${!result.ethanolRecommended ? 'text-amber-400' : 'text-white'}`}>
                        {formatCurrency(result.gasolineCost)}
                      </p>
                    </div>
                    <div className={`rounded-xl p-4 border ${result.ethanolRecommended ? 'bg-green-500/10 border-green-500/30' : 'bg-slate-900/60 border-slate-700/50'}`}>
                      <p className="text-slate-400 text-sm mb-1">{tt('withEthanol')}</p>
                      <p className={`text-xl font-bold ${result.ethanolRecommended ? 'text-green-400' : 'text-white'}`}>
                        {formatCurrency(result.ethanolCost)}
                      </p>
                    </div>
                  </div>

                  {result.savings > 0 && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-slate-400 text-sm">{tt('savings')}</p>
                          <p className="text-2xl font-bold text-emerald-400">{formatCurrency(result.savings)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-400 text-sm">{tt('savingsYear')}</p>
                          <p className="text-2xl font-bold text-emerald-400">{formatCurrency(result.savings * 12)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
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
                {locale === 'pt-BR' ? 'Quanto custa cada corrida?' : 'How much does each trip cost?'}
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
                {locale === 'pt-BR' ? 'Calculadora de Lucro Real' : 'Daily Profit Calculator'}
              </h3>
              <p className="text-slate-400 text-sm">
                {locale === 'pt-BR' ? 'Seu ganho real por hora' : 'Your real hourly earnings'}
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
                {locale === 'pt-BR' ? 'Custos Ocultos' : 'Hidden Costs'}
              </h3>
              <p className="text-slate-400 text-sm">
                {locale === 'pt-BR' ? 'Gastos que você ignora' : 'Costs you overlook'}
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
            {...fuelCalculatorSEO[locale as keyof typeof fuelCalculatorSEO] || fuelCalculatorSEO['en-US']}
          />
        </div>
      </div>
    </div>
  );
}

