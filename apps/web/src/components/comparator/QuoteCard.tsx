'use client';

import React from 'react';
import { ExternalLink, Check, X, AlertTriangle } from 'lucide-react';
import { DispatchStatus } from './types';
import { getTranslations } from './translations';

interface QuoteCardProps {
  dispatch: DispatchStatus;
  locale: string;
  badge?: string | null;
  currency: string;
}

export default function QuoteCard({ dispatch, locale, badge, currency }: QuoteCardProps) {
  const t = getTranslations(locale);
  const { partnerName, partnerLogo, status, quote, errorMessage } = dispatch;

  if (status === 'failed' || status === 'timeout') {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-5 opacity-60">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-slate-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">{partnerName}</h3>
            <p className="text-xs text-slate-500">
              {status === 'timeout'
                ? (locale === 'pt-BR' ? 'Tempo esgotado' : 'Timed out')
                : (locale === 'pt-BR' ? 'Indisponível' : 'Unavailable')}
            </p>
          </div>
        </div>
        {errorMessage && <p className="text-sm text-slate-500">{errorMessage}</p>}
      </div>
    );
  }

  if (!quote) return null;

  return (
    <div className={`bg-white rounded-xl border-2 p-5 relative transition-shadow hover:shadow-md
      ${badge ? 'border-orange-400' : 'border-slate-200'}`}>
      {badge && (
        <span className="absolute -top-3 left-4 px-3 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full">
          {badge}
        </span>
      )}

      <div className="flex items-center gap-3 mb-4">
        {partnerLogo ? (
          <img src={partnerLogo} alt={partnerName} className="w-12 h-12 rounded-lg object-contain" />
        ) : (
          <div className="w-12 h-12 bg-navy-50 rounded-lg flex items-center justify-center text-navy-600 font-bold text-lg">
            {partnerName.charAt(0)}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-slate-900">{partnerName}</h3>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-navy-600">
            {currency}{quote.monthlyPremium.toFixed(2)}
          </span>
          <span className="text-sm text-slate-500">/{t.results.monthlyPremium}</span>
        </div>
        <p className="text-sm text-slate-500">
          {currency}{quote.annualPremium.toFixed(2)} /{t.results.annualPremium}
        </p>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-slate-600">{t.results.liability}</span>
          <span className="font-medium text-slate-900">{quote.coverageSummary.liability}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-600">{t.results.deductible}</span>
          <span className="font-medium text-slate-900">{currency}{quote.coverageSummary.deductible}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-600">{t.results.collision}</span>
          {quote.coverageSummary.collision
            ? <Check className="w-4 h-4 text-green-600" />
            : <X className="w-4 h-4 text-slate-300" />}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-600">{t.results.comprehensive}</span>
          {quote.coverageSummary.comprehensive
            ? <Check className="w-4 h-4 text-green-600" />
            : <X className="w-4 h-4 text-slate-300" />}
        </div>
        {quote.coverageSummary.gap && (
          <div className="flex items-center justify-between">
            <span className="text-slate-600">{t.results.gapCoverage}</span>
            <Check className="w-4 h-4 text-green-600" />
          </div>
        )}
        {quote.coverageSummary.roadside && (
          <div className="flex items-center justify-between">
            <span className="text-slate-600">{t.results.roadside}</span>
            <Check className="w-4 h-4 text-green-600" />
          </div>
        )}
      </div>

      {quote.highlights.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {quote.highlights.map((h, i) => (
            <span key={i} className="text-xs bg-navy-50 text-navy-700 px-2 py-0.5 rounded-full">
              {h}
            </span>
          ))}
        </div>
      )}

      <a
        href={quote.providerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full py-2.5 bg-orange-500 text-white text-center rounded-lg font-medium
          hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
      >
        {t.results.getQuote}
        <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  );
}
