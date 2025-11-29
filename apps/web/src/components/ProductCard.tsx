import React from 'react';
import Link from 'next/link';
import type { FinancialProduct } from '@gigsafehub/types';

interface ProductCardProps {
  product: FinancialProduct;
  onCompareToggle?: (id: string) => void;
  isSelectedForCompare?: boolean;
  locale?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onCompareToggle,
  isSelectedForCompare,
  locale = 'en-US'
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
      <div className="p-6 flex-1">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <img src={product.logoUrl} alt={product.name} className="w-12 h-12 rounded-lg bg-slate-100 object-cover" />
            <div>
              <h3 className="text-lg font-bold text-slate-900">{product.name}</h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {product.category}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-2xl font-bold text-brand-600">{product.rating}</div>
            <div className="text-xs text-slate-400">{product.reviewsCount} reviews</div>
          </div>
        </div>

        <p className="text-slate-600 text-sm mb-4 line-clamp-3">
          {product.description}
        </p>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
             <span className="text-slate-500">Fees</span>
             <span className="font-medium text-slate-900">{product.fees}</span>
          </div>
          <div className="flex justify-between text-sm">
             <span className="text-slate-500">Safety Score</span>
             <div className="flex items-center space-x-1">
                <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: `${product.safetyScore}%` }}></div>
                </div>
                <span className="font-medium text-slate-900">{product.safetyScore}</span>
             </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
        {onCompareToggle && (
            <button
                onClick={() => onCompareToggle(product.id)}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                    isSelectedForCompare
                    ? 'bg-brand-600 text-white border-brand-600 hover:bg-brand-700'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                }`}
            >
                {isSelectedForCompare ? 'Selected' : 'Compare'}
            </button>
        )}
        <Link
          href={`/${locale}/reviews/${product.id}`}
          className="flex-1 px-3 py-2 text-center text-sm font-medium rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
        >
          Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;

