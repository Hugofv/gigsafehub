import React from 'react';
import Link from 'next/link';
import LazyImage from './LazyImage';
import { getLocalizedSlug } from '@/lib/slug';
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
    <div className="group bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-2">
      <div className="p-6 flex-1">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3 flex-1">
            <div className="relative">
              <LazyImage
                src={product.logoUrl}
                alt={(product as any).logoAlt || product.name}
                width={56}
                height={56}
                className="rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 p-1 group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                {product.name}
              </h3>
              <span className="inline-block mt-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-gradient-to-r from-brand-50 to-blue-50 text-brand-700 border border-brand-200">
                {product.category}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end ml-2">
            <div className="flex items-center gap-1">
              <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-2xl font-bold text-slate-900">{product.rating}</span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {product.reviewsCount.toLocaleString()} reviews
            </div>
          </div>
        </div>

        <p className="text-slate-600 text-sm mb-5 line-clamp-3 leading-relaxed">
          {product.description}
        </p>

        <div className="space-y-3 mb-5">
          <div className="flex justify-between items-center text-sm p-2 rounded-lg bg-slate-50">
            <span className="text-slate-600 font-medium">Monthly Fees</span>
            <span className="font-bold text-slate-900">{product.fees}</span>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 font-medium">Safety Score</span>
              <span className="font-bold text-green-600">{product.safetyScore}/100</span>
            </div>
            <div className="relative w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${product.safetyScore}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-gradient-to-br from-slate-50 to-white border-t border-slate-100 flex gap-3">
        {onCompareToggle && (
          <button
            onClick={() => onCompareToggle(product.id)}
            className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl border-2 transition-all duration-200 ${
              isSelectedForCompare
                ? 'bg-brand-600 text-white border-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-500/30'
                : 'bg-white text-slate-700 border-slate-300 hover:border-brand-400 hover:text-brand-600 hover:bg-brand-50'
            }`}
          >
            {isSelectedForCompare ? (
              <span className="flex items-center justify-center gap-1.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Selected
              </span>
            ) : (
              'Compare'
            )}
          </button>
        )}
        <Link
          href={`/${locale}/reviews/${getLocalizedSlug(
            (product as any).slug,
            (product as any).slugEn,
            (product as any).slugPt,
            locale
          ) || (product as any).slug || product.id}`}
          className="flex-1 px-4 py-2.5 text-center text-sm font-semibold rounded-xl bg-gradient-to-r from-brand-600 to-blue-600 text-white hover:from-brand-700 hover:to-blue-700 transition-all shadow-lg shadow-brand-500/30 hover:shadow-xl hover:shadow-brand-500/40 transform hover:scale-105"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
