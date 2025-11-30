'use client';

import React from 'react';
import type { FinancialProduct } from '@gigsafehub/types';
import ProductCard from '@/components/ProductCard';

interface ReviewsClientProps {
  products: FinancialProduct[];
  locale: string;
  initialCategory?: string;
  initialType?: string;
  initialSubcategory?: string;
}

export default function ReviewsClient({
  products,
  locale,
  initialCategory,
  initialType,
  initialSubcategory,
}: ReviewsClientProps) {
  const getLink = (path: string) => `/${locale}${path}`;

  // Filter products based on query params
  let filteredProducts = products;

  // Note: Filtering logic can be extended when product structure is finalized
  // For now, just return all products

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4">
            Insurance Reviews
          </h1>
          <p className="text-xl text-slate-600">
            Compare and review the best insurance products for gig economy workers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No products found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

