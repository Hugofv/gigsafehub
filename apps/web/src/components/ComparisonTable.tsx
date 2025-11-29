import React from 'react';
import type { FinancialProduct } from '@gigsafehub/types';

interface ComparisonTableProps {
  products: FinancialProduct[];
}

const ComparisonTable: React.FC<ComparisonTableProps> = ({ products }) => {
  if (products.length < 2) return null;
  // Limit to 2 for the article view style
  const [p1, p2] = products;

  return (
    <div className="my-8 overflow-hidden border border-slate-200 rounded-xl shadow-sm bg-white">
      <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200">
        <div className="p-4 font-bold text-slate-500 text-sm uppercase tracking-wide flex items-center">Feature</div>
        <div className="p-4 text-center border-l border-slate-200">
          <img src={p1.logoUrl} alt={p1.name} className="w-10 h-10 mx-auto mb-2 rounded bg-white" />
          <h4 className="font-bold text-slate-900">{p1.name}</h4>
        </div>
        <div className="p-4 text-center border-l border-slate-200">
          <img src={p2.logoUrl} alt={p2.name} className="w-10 h-10 mx-auto mb-2 rounded bg-white" />
          <h4 className="font-bold text-slate-900">{p2.name}</h4>
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-slate-100">
        <div className="grid grid-cols-3 hover:bg-slate-50 transition-colors">
          <div className="p-4 text-sm font-semibold text-slate-700 flex items-center">Safety Score</div>
          <div className="p-4 text-center border-l border-slate-100 font-bold text-green-600 text-lg">{p1.safetyScore}</div>
          <div className="p-4 text-center border-l border-slate-100 font-bold text-green-600 text-lg">{p2.safetyScore}</div>
        </div>

        <div className="grid grid-cols-3 hover:bg-slate-50 transition-colors">
          <div className="p-4 text-sm font-semibold text-slate-700 flex items-center">Rating</div>
          <div className="p-4 text-center border-l border-slate-100 text-brand-600 font-bold">{p1.rating}/5</div>
          <div className="p-4 text-center border-l border-slate-100 text-brand-600 font-bold">{p2.rating}/5</div>
        </div>

        <div className="grid grid-cols-3 hover:bg-slate-50 transition-colors">
          <div className="p-4 text-sm font-semibold text-slate-700 flex items-center">Starting Price</div>
          <div className="p-4 text-center border-l border-slate-100 text-sm">{p1.fees}</div>
          <div className="p-4 text-center border-l border-slate-100 text-sm">{p2.fees}</div>
        </div>

        <div className="grid grid-cols-3 hover:bg-slate-50 transition-colors">
          <div className="p-4 text-sm font-semibold text-slate-700">Best For</div>
          <div className="p-4 text-sm text-slate-600 border-l border-slate-100">{p1.pros[0]}</div>
          <div className="p-4 text-sm text-slate-600 border-l border-slate-100">{p2.pros[0]}</div>
        </div>

        <div className="grid grid-cols-3">
          <div className="p-4 bg-slate-50"></div>
          <div className="p-4 border-l border-slate-100 bg-slate-50">
            <a href={p1.affiliateLink} target="_blank" rel="noreferrer" className="block w-full py-2 bg-slate-900 text-white text-center rounded text-sm font-bold hover:bg-slate-800 transition">
                Check {p1.name}
            </a>
          </div>
          <div className="p-4 border-l border-slate-100 bg-slate-50">
            <a href={p2.affiliateLink} target="_blank" rel="noreferrer" className="block w-full py-2 bg-brand-600 text-white text-center rounded text-sm font-bold hover:bg-brand-700 transition">
                Check {p2.name}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonTable;

