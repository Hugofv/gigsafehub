'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/contexts/I18nContext';
import type { Article } from '@gigsafehub/types';

export default function ArticlesClient({ 
  articles, 
  locale 
}: { 
  articles: Article[];
  locale: string;
}) {
  const { t } = useTranslation();

  return (
    <div className='min-h-screen bg-slate-50 py-12'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-extrabold text-slate-900 mb-4'>
            {t('articles.title')}
          </h1>
          <p className='text-xl text-slate-500 max-w-2xl mx-auto'>
            {t('articles.subtitle')}
          </p>
        </div>

        {articles.length === 0 ? (
          <div className='text-center py-20 text-slate-500 italic'>
            {t('articles.noArticles')}
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {articles.map((article) => (
              <Link
                href={`/${locale}/articles/${article.slug}`}
                key={article.id}
                className='group flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300'
              >
                <div className='h-48 overflow-hidden relative'>
                  <img
                    src={article.imageUrl}
                    alt={article.title}
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500'
                  />
                  <div className='absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-900 uppercase tracking-wide'>
                    {article.partnerTag}
                  </div>
                  <div className='absolute top-4 right-4 bg-brand-600/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-white uppercase tracking-wide'>
                    {article.locale}
                  </div>
                </div>
                <div className='p-6 flex-1 flex flex-col'>
                  <div className='text-xs text-slate-400 mb-2'>
                    {article.date}
                  </div>
                  <h3 className='text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors'>
                    {article.title}
                  </h3>
                  <p className='text-slate-600 text-sm line-clamp-3 mb-4 flex-1'>
                    {article.excerpt}
                  </p>
                  <span className='text-brand-600 font-semibold text-sm flex items-center'>
                    {t('articles.readMore')}{' '}
                    <svg
                      className='w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M17 8l4 4m0 0l-4 4m4-4H3'
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

