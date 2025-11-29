'use client';

import React from 'react';
import Link from 'next/link';
import CalculatorWidget from '@/components/CalculatorWidget';
import ComparisonTable from '@/components/ComparisonTable';
import type { Article, FinancialProduct } from '@gigsafehub/types';

export default function ArticleDetailClient({ 
  article, 
  comparisonProducts 
}: { 
  article: Article;
  comparisonProducts: FinancialProduct[];
}) {
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header Image */}
      <div className="h-64 md:h-96 w-full relative">
        <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-4 md:p-10 max-w-7xl mx-auto">
            <span className="inline-block px-3 py-1 mb-4 rounded bg-brand-500 text-white text-xs font-bold uppercase tracking-wider">
                {article.partnerTag}
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 leading-tight max-w-4xl">{article.title}</h1>
            <p className="text-slate-300 text-lg">{article.date}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Main Content */}
            <div className="lg:col-span-8">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 md:p-10 prose prose-lg prose-slate max-w-none">
                    <p className="lead font-medium text-slate-500 mb-8">{article.excerpt}</p>
                    
                    {/* Render HTML content safely */}
                    <div dangerouslySetInnerHTML={{ __html: article.content }} />

                    {/* Inject Comparison Table if products exist */}
                    {comparisonProducts.length > 0 && (
                        <>
                            <h3 className="text-2xl font-bold mt-10 mb-4">Head-to-Head Comparison</h3>
                            <ComparisonTable products={comparisonProducts} />
                        </>
                    )}

                    <div className="mt-12 pt-8 border-t border-slate-100">
                        <h4 className="font-bold text-slate-900 mb-4">Conclusion</h4>
                        <p>
                            Both options provide solid coverage, but for most gig workers needing a quick certificate, 
                            Next Insurance wins on speed. If you are in a high-risk consultant role, Hiscox is the better specialist.
                        </p>
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-8">
                {/* Sticky Wrapper */}
                <div className="sticky top-24">
                    <CalculatorWidget />

                    <div className="mt-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <h4 className="font-bold text-slate-900 mb-2">Need Help?</h4>
                        <p className="text-slate-600 text-sm mb-4">Our financial experts review dozens of products weekly.</p>
                        <Link href="/reviews" className="text-brand-600 font-bold hover:underline text-sm">
                            Browse all reviews &rarr;
                        </Link>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}

