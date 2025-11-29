'use client';

import React, { useEffect, useState } from 'react';
import { getSmartSummary } from '@/services/geminiService';
import type { FinancialProduct } from '@gigsafehub/types';

export default function ProductDetailClient({ product }: { product: FinancialProduct }) {
  const [summary, setSummary] = useState('');

  useEffect(() => {
    // Auto generate summary if data exists (simulated delay)
    setTimeout(() => {
      getSmartSummary(product).then(setSummary);
    }, 500);
  }, [product]);

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-slate-900 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center gap-6">
            <img src={product.logoUrl} alt={product.name} className="w-24 h-24 rounded-2xl bg-white p-2" />
            <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <p className="text-slate-400 mt-2 text-lg">{product.description}</p>
            </div>
            <div className="text-center">
                <div className="text-4xl font-bold text-brand-400">{product.rating}</div>
                <div className="text-sm text-slate-400">out of 5</div>
            </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
            <section>
                <h2 className="text-xl font-bold mb-4 text-slate-900">Expert Review</h2>
                {summary ? (
                    <div className="p-4 bg-brand-50 border-l-4 border-brand-500 italic text-slate-700">
                        "{summary}" 
                        <span className="block text-xs font-bold text-brand-600 mt-2 not-italic">- AI Summary</span>
                    </div>
                ) : (
                    <div className="h-20 bg-slate-50 animate-pulse rounded"></div>
                )}
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-bold text-green-700 mb-2 flex items-center">
                        <span className="mr-2 text-xl">+</span> Pros
                    </h3>
                    <ul className="space-y-2">
                        {product.pros.map((p, i) => (
                            <li key={i} className="flex items-start text-sm text-slate-600">
                                <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                {p}
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className="font-bold text-red-700 mb-2 flex items-center">
                        <span className="mr-2 text-xl">-</span> Cons
                    </h3>
                    <ul className="space-y-2">
                        {product.cons.map((c, i) => (
                            <li key={i} className="flex items-start text-sm text-slate-600">
                                <svg className="w-4 h-4 text-red-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                {c}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </div>

        <div className="space-y-6">
            <div className="border border-slate-200 rounded-xl p-6 shadow-sm sticky top-24">
                <div className="text-center mb-6">
                    <span className="text-slate-500 text-sm uppercase tracking-wide">Safety Score</span>
                    <div className="text-5xl font-extrabold text-slate-900 my-2">{product.safetyScore}</div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full" style={{width: `${product.safetyScore}%`}}></div>
                    </div>
                </div>
                
                <div className="space-y-4 mb-6">
                    <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="text-slate-500">Monthly Fees</span>
                        <span className="font-medium">{product.fees}</span>
                    </div>
                     <div className="flex justify-between border-b border-slate-100 pb-2">
                        <span className="text-slate-500">Category</span>
                        <span className="font-medium">{product.category}</span>
                    </div>
                </div>

                <a href={product.affiliateLink} target="_blank" rel="noreferrer" className="block w-full py-3 bg-brand-600 text-white font-bold text-center rounded-lg hover:bg-brand-700 transition shadow-lg shadow-brand-500/20">
                    Visit Website
                </a>
                <p className="text-xs text-slate-400 text-center mt-3">We may earn a commission.</p>
            </div>
        </div>
      </div>
    </div>
  );
}

