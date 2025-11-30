'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/contexts/I18nContext';
import { getLocalizedSlug } from '@/lib/slug';
import { normalizeImageUrl } from '@/lib/imageUtils';
import type { FinancialProduct } from '@gigsafehub/types';

interface ProductDetailClientProps {
  product: FinancialProduct & { slugEn?: string; slugPt?: string };
  locale: string;
}

export default function ProductDetailClient({ product, locale }: ProductDetailClientProps) {
  const { t } = useTranslation();
  const getLink = (path: string) => `/${locale}${path}`;

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href={getLink('/reviews')}
          className="inline-flex items-center text-brand-600 hover:text-brand-700 mb-6"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Reviews
        </Link>

        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Image
                src={normalizeImageUrl(product.logoUrl)}
                alt={product.name}
                width={80}
                height={80}
                className="w-20 h-20 rounded-xl bg-slate-100 object-cover"
              />
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">{product.name}</h1>
                <span className="inline-block px-3 py-1 rounded-full bg-brand-100 text-brand-700 text-sm font-semibold">
                  {product.category}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-brand-600 mb-1">{product.rating}</div>
              <div className="text-sm text-slate-500">{product.reviewsCount} reviews</div>
            </div>
          </div>

          <p className="text-lg text-slate-700 mb-8 leading-relaxed">{product.description}</p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Pros</h2>
              <ul className="space-y-2">
                {product.pros.map((pro, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-700">{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4">Cons</h2>
              <ul className="space-y-2">
                {product.cons.map((con, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-slate-700">{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Features</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {product.features.map((feature, idx) => (
                <div key={idx} className="flex items-center">
                  <svg className="w-5 h-5 text-brand-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-slate-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <a
              href={product.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-6 py-3 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 transition text-center"
            >
              Get Started
            </a>
            <Link
              href={getLink('/compare')}
              className="px-6 py-3 border-2 border-brand-600 text-brand-600 font-bold rounded-lg hover:bg-brand-50 transition"
            >
              Compare
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

