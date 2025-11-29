'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import type { FinancialProduct, ProductCategory } from '@gigsafehub/types';

export default function ReviewsClient({
  products,
  locale
}: {
  products: FinancialProduct[];
  locale: string;
}) {
  const [filter, setFilter] = useState<string>('All');
  const [compareList, setCompareList] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleCompareToggle = (id: string) => {
    setCompareList(prev => {
      if (prev.includes(id)) return prev.filter(pid => pid !== id);
      if (prev.length >= 3) {
        alert("You can only compare up to 3 products.");
        return prev;
      }
      return [...prev, id];
    });
  };

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = filter === 'All' || p.category === filter;
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, filter, searchTerm]);

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Software Reviews</h1>
            <p className="text-slate-500 mt-1">Unbiased analysis of {products.length} financial products.</p>
          </div>

          {compareList.length > 0 && (
             <Link href={`/${locale}/compare?ids=${compareList.join(',')}`} className="inline-flex items-center px-4 py-2 bg-brand-600 text-white rounded-lg shadow hover:bg-brand-700 transition-colors animate-bounce">
                Compare Selected ({compareList.length})
             </Link>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-8 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
                <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg className="w-5 h-5 text-slate-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                {['All', ...Object.values(ProductCategory)].map(cat => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                            filter === cat
                            ? 'bg-slate-900 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>

        {/* Grid */}
        {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
                <ProductCard
                    key={product.id}
                    product={product}
                    locale={locale}
                    onCompareToggle={handleCompareToggle}
                    isSelectedForCompare={compareList.includes(product.id)}
                />
            ))}
            </div>
        ) : (
            <div className="text-center py-20">
                <p className="text-slate-500 text-lg">No products found matching your criteria.</p>
                <button onClick={() => {setFilter('All'); setSearchTerm('');}} className="mt-4 text-brand-600 hover:underline">Clear Filters</button>
            </div>
        )}
      </div>
    </div>
  );
}

