'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { analyzeComparison } from '@/services/geminiService';
import type { FinancialProduct } from '@gigsafehub/types';

export default function ComparisonClient({ 
  products: initialProducts, 
  allProducts, 
  locale 
}: { 
  products: FinancialProduct[];
  allProducts: FinancialProduct[];
  locale: string;
}) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [loadingAi, setLoadingAi] = useState(false);

  const handleAiAnalyze = async () => {
    setLoadingAi(true);
    const result = await analyzeComparison(products);
    setAiAnalysis(result);
    setLoadingAi(false);
  };

  const addProduct = (id: string) => {
    const prod = allProducts.find(p => p.id === id);
    if (prod && !products.find(p => p.id === id)) {
      const newProducts = [...products, prod];
      setProducts(newProducts);
      // Update URL
      router.push(`/${locale}/compare?ids=${newProducts.map(p => p.id).join(',')}`);
    }
  };

  const removeProduct = (id: string) => {
    const newProducts = products.filter(p => p.id !== id);
    setProducts(newProducts);
    setAiAnalysis(''); // Clear analysis if selection changes
    // Update URL
    if (newProducts.length > 0) {
      router.push(`/${locale}/compare?ids=${newProducts.map(p => p.id).join(',')}`);
    } else {
      router.push(`/${locale}/compare`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Compare Products</h1>
            <div className="relative inline-block text-left">
                <select 
                    className="block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm rounded-md"
                    onChange={(e) => addProduct(e.target.value)}
                    value=""
                    disabled={products.length >= 3}
                >
                    <option value="" disabled>Add Product to Compare</option>
                    {allProducts.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
            </div>
        </div>
        
        {products.length === 0 ? (
            <div className="text-center py-20">
                <p>Select products to compare.</p>
                <Link href={`/${locale}/reviews`} className="text-brand-600 hover:underline">Go to Reviews</Link>
            </div>
        ) : (
            <div className="overflow-x-auto pb-6">
                <table className="min-w-full divide-y divide-slate-200 shadow-sm rounded-lg overflow-hidden">
                    <thead className="bg-slate-800 text-white">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider w-32">Metric</th>
                            {products.map(p => (
                                <th key={p.id} className="px-6 py-4 text-left text-sm font-semibold relative">
                                    {p.name}
                                    <button 
                                        onClick={() => removeProduct(p.id)}
                                        className="absolute top-2 right-2 text-slate-400 hover:text-white"
                                    >
                                        &times;
                                    </button>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {/* Rating Row */}
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 bg-slate-50">Rating</td>
                            {products.map(p => (
                                <td key={p.id} className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                                    <span className="text-brand-600 font-bold">{p.rating}</span>/5
                                </td>
                            ))}
                        </tr>
                        {/* Fees Row */}
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 bg-slate-50">Fees</td>
                            {products.map(p => (
                                <td key={p.id} className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{p.fees}</td>
                            ))}
                        </tr>
                        {/* Safety Score Row */}
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 bg-slate-50">Safety Score</td>
                            {products.map(p => (
                                <td key={p.id} className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                                    <div className="flex items-center gap-2">
                                        <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500" style={{ width: `${p.safetyScore}%` }}></div>
                                        </div>
                                        {p.safetyScore}
                                    </div>
                                </td>
                            ))}
                        </tr>
                        {/* Pros Row */}
                        <tr>
                            <td className="px-6 py-4 text-sm font-bold text-slate-900 bg-slate-50 align-top">Pros</td>
                            {products.map(p => (
                                <td key={p.id} className="px-6 py-4 text-sm text-slate-600 align-top">
                                    <ul className="list-disc pl-4 space-y-1">
                                        {p.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                                    </ul>
                                </td>
                            ))}
                        </tr>
                         {/* Action Row */}
                         <tr>
                            <td className="px-6 py-4 bg-slate-50"></td>
                            {products.map(p => (
                                <td key={p.id} className="px-6 py-4 align-top">
                                    <a href={p.affiliateLink} target="_blank" rel="noreferrer" className="block text-center w-full py-2 bg-brand-600 text-white rounded hover:bg-brand-700 transition">
                                        Visit Site
                                    </a>
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        )}

        {/* AI Analysis Section */}
        {products.length > 1 && (
             <div className="mt-8 bg-white p-6 rounded-xl border border-indigo-100 shadow-md">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        AI Smart Comparison
                    </h3>
                    {!aiAnalysis && (
                        <button 
                            onClick={handleAiAnalyze}
                            disabled={loadingAi}
                            className="text-sm px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 font-medium disabled:opacity-50"
                        >
                            {loadingAi ? 'Analyzing...' : 'Generate Analysis'}
                        </button>
                    )}
                </div>
                
                {aiAnalysis && (
                    <div className="prose prose-sm prose-slate max-w-none bg-indigo-50/50 p-4 rounded-lg border border-indigo-100">
                        <p className="whitespace-pre-line leading-relaxed">{aiAnalysis}</p>
                    </div>
                )}
             </div>
        )}

      </div>
    </div>
  );
}

