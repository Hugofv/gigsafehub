'use client';

import React, { useState, useMemo } from 'react';
import { LayoutGrid, Table2, RefreshCw, Share2, Bell } from 'lucide-react';
import { useQuotePolling } from './hooks/useQuotePolling';
import QuoteCard from './QuoteCard';
import QuoteCardSkeleton from './QuoteCardSkeleton';
import ComparisonTable from './ComparisonTable';
import { DispatchStatus, SortOption } from './types';
import { getTranslations } from './translations';

interface ComparisonResultsProps {
  leadId: string;
  initialDispatches: DispatchStatus[];
  locale: string;
  onRecompare: () => void;
}

function assignBadges(dispatches: DispatchStatus[], locale: string) {
  const t = getTranslations(locale);
  const success = dispatches.filter((d) => d.status === 'success' && d.quote);
  if (success.length === 0) return new Map<string, string>();

  const badges = new Map<string, string>();

  const cheapest = success.reduce((a, b) =>
    (a.quote!.monthlyPremium < b.quote!.monthlyPremium ? a : b)
  );
  badges.set(cheapest.id, t.results.bestPrice);

  const mostCoverage = success.reduce((a, b) => {
    const scoreA = [a.quote!.coverageSummary.collision, a.quote!.coverageSummary.comprehensive,
      a.quote!.coverageSummary.gap, a.quote!.coverageSummary.roadside].filter(Boolean).length;
    const scoreB = [b.quote!.coverageSummary.collision, b.quote!.coverageSummary.comprehensive,
      b.quote!.coverageSummary.gap, b.quote!.coverageSummary.roadside].filter(Boolean).length;
    return scoreA >= scoreB ? a : b;
  });
  if (mostCoverage.id !== cheapest.id) {
    badges.set(mostCoverage.id, t.results.bestCoverage);
  }

  return badges;
}

export default function ComparisonResults({
  leadId,
  initialDispatches,
  locale,
  onRecompare,
}: ComparisonResultsProps) {
  const t = getTranslations(locale);
  const { data: pollData, isPolling } = useQuotePolling(leadId);
  const [sortBy, setSortBy] = useState<SortOption>('price-asc');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const dispatches = pollData?.dispatches || initialDispatches;
  const currency = locale === 'pt-BR' ? 'R$ ' : '$';

  const pendingCount = dispatches.filter(
    (d) => d.status === 'queued' || d.status === 'pending'
  ).length;

  const sorted = useMemo(() => {
    const items = [...dispatches];
    items.sort((a, b) => {
      if (a.status === 'success' && b.status !== 'success') return -1;
      if (a.status !== 'success' && b.status === 'success') return 1;
      if (a.status !== 'success' || b.status !== 'success') return 0;

      const aq = a.quote!;
      const bq = b.quote!;

      switch (sortBy) {
        case 'price-asc': return aq.monthlyPremium - bq.monthlyPremium;
        case 'price-desc': return bq.monthlyPremium - aq.monthlyPremium;
        case 'coverage': {
          const sa = [aq.coverageSummary.collision, aq.coverageSummary.comprehensive,
            aq.coverageSummary.gap, aq.coverageSummary.roadside].filter(Boolean).length;
          const sb = [bq.coverageSummary.collision, bq.coverageSummary.comprehensive,
            bq.coverageSummary.gap, bq.coverageSummary.roadside].filter(Boolean).length;
          return sb - sa;
        }
        default: return 0;
      }
    });
    return items;
  }, [dispatches, sortBy]);

  const badges = useMemo(() => assignBadges(dispatches, locale), [dispatches, locale]);

  const successCount = dispatches.filter((d) => d.status === 'success').length;
  const noQuotes = !isPolling && successCount === 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-navy-500">{t.results.title}</h1>
          {isPolling && pendingCount > 0 && (
            <p className="text-slate-600 mt-2 animate-pulse">
              {t.results.searching.replace('{count}', String(dispatches.length))}
            </p>
          )}
        </div>

        {!noQuotes && (
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm text-slate-600">{t.results.sortBy}:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="text-sm border border-slate-300 rounded-lg px-3 py-1.5"
              >
                <option value="price-asc">{t.results.priceAsc}</option>
                <option value="price-desc">{t.results.priceDesc}</option>
                <option value="coverage">{t.results.byCoverage}</option>
              </select>
            </div>

            <div className="flex items-center gap-1 bg-slate-200 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors
                  ${viewMode === 'cards' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600'}`}
              >
                <LayoutGrid className="w-4 h-4 inline mr-1" />
                {t.results.viewCards}
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 text-sm rounded-md transition-colors
                  ${viewMode === 'table' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600'}`}
              >
                <Table2 className="w-4 h-4 inline mr-1" />
                {t.results.viewTable}
              </button>
            </div>
          </div>
        )}

        {viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sorted.map((d) =>
              d.status === 'queued' || d.status === 'pending' ? (
                <QuoteCardSkeleton key={d.id} />
              ) : (
                <QuoteCard
                  key={d.id}
                  dispatch={d}
                  locale={locale}
                  badge={badges.get(d.id) || null}
                  currency={currency}
                />
              )
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <ComparisonTable dispatches={sorted} locale={locale} currency={currency} />
          </div>
        )}

        {noQuotes && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <p className="text-lg text-slate-700 mb-2">{t.results.noQuotes}</p>
            <p className="text-sm text-slate-500 mb-6">{t.results.noQuotesSuggestion}</p>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-500 text-white rounded-lg font-medium
                hover:bg-navy-600 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {t.results.notifyMe}
            </button>
          </div>
        )}

        <div className="flex items-center justify-center gap-4 mt-8 flex-wrap">
          <button
            type="button"
            onClick={onRecompare}
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 rounded-lg
              text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            {t.results.adjustRecompare}
          </button>
          <button
            type="button"
            onClick={() => navigator.clipboard?.writeText(window.location.href)}
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-slate-300 rounded-lg
              text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Share2 className="w-4 h-4" />
            {t.results.shareResults}
          </button>
        </div>
      </div>
    </div>
  );
}
