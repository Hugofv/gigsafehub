'use client';

import React from 'react';
import { Check, X, ExternalLink } from 'lucide-react';
import { DispatchStatus } from './types';
import { getTranslations } from './translations';

interface ComparisonTableProps {
  dispatches: DispatchStatus[];
  locale: string;
  currency: string;
}

export default function ComparisonTable({ dispatches, locale, currency }: ComparisonTableProps) {
  const t = getTranslations(locale);
  const successQuotes = dispatches.filter((d) => d.status === 'success' && d.quote);

  if (successQuotes.length === 0) return null;

  const rows = [
    { key: 'monthlyPremium', label: t.results.monthlyPremium },
    { key: 'annualPremium', label: t.results.annualPremium },
    { key: 'liability', label: t.results.liability },
    { key: 'deductible', label: t.results.deductible },
    { key: 'collision', label: t.results.collision },
    { key: 'comprehensive', label: t.results.comprehensive },
    { key: 'gap', label: t.results.gapCoverage },
    { key: 'roadside', label: t.results.roadside },
  ];

  function getCellValue(dispatch: DispatchStatus, key: string) {
    const q = dispatch.quote!;
    switch (key) {
      case 'monthlyPremium': return `${currency}${q.monthlyPremium.toFixed(2)}`;
      case 'annualPremium': return `${currency}${q.annualPremium.toFixed(2)}`;
      case 'liability': return q.coverageSummary.liability;
      case 'deductible': return `${currency}${q.coverageSummary.deductible}`;
      case 'collision': return q.coverageSummary.collision;
      case 'comprehensive': return q.coverageSummary.comprehensive;
      case 'gap': return q.coverageSummary.gap;
      case 'roadside': return q.coverageSummary.roadside;
      default: return '-';
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-3 px-3 text-slate-600 font-medium sticky left-0 bg-white">
              {t.results.coverage}
            </th>
            {successQuotes.map((d) => (
              <th key={d.id} className="text-center py-3 px-3 min-w-[140px]">
                <div className="font-semibold text-slate-900">{d.partnerName}</div>
                <div className="text-lg font-bold text-navy-600">
                  {currency}{d.quote!.monthlyPremium.toFixed(2)}/mo
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-2.5 px-3 text-slate-600 font-medium sticky left-0 bg-white">
                {row.label}
              </td>
              {successQuotes.map((d) => {
                const val = getCellValue(d, row.key);
                return (
                  <td key={d.id} className="py-2.5 px-3 text-center">
                    {typeof val === 'boolean' ? (
                      val ? <Check className="w-4 h-4 text-green-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />
                    ) : (
                      <span className="text-slate-900">{val}</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
          <tr>
            <td className="py-3 px-3 sticky left-0 bg-white" />
            {successQuotes.map((d) => (
              <td key={d.id} className="py-3 px-3 text-center">
                <a
                  href={d.quote!.providerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-4 py-2 bg-orange-500 text-white rounded-lg
                    text-sm font-medium hover:bg-orange-600 transition-colors"
                >
                  {t.results.getQuote} <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
