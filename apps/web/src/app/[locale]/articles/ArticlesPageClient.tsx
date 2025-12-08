'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCategories } from '@/contexts/CategoriesContext';
import { useTranslation } from '@/contexts/I18nContext';
import { normalizeImageUrl } from '@/lib/imageUtils';
import { getLocalizedSlug } from '@/lib/slug';
import { formatArticleDate } from '@/lib/dateUtils';

interface Article {
  id: string;
  slug: string;
  slugEn?: string;
  slugPt?: string;
  title: string;
  excerpt: string;
  imageUrl: string;
  imageAlt?: string;
  date: string | Date;
  partnerTag?: string;
  readingTime?: number;
  category?: {
    id: string;
    name: string;
    slug: string;
    slugEn?: string;
    slugPt?: string;
  } | null;
}

interface RootCategory {
  id: string;
  name: string;
  nameEn?: string;
  namePt?: string;
  slug: string;
  slugEn?: string;
  slugPt?: string;
}

interface ArticlesPageClientProps {
  articles: Article[];
  rootCategories: RootCategory[];
  selectedCategory: string | null;
  locale: string;
}

export default function ArticlesPageClient({
  articles,
  rootCategories,
  selectedCategory,
  locale,
}: ArticlesPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { buildPath, categories } = useCategories();
  const { t } = useTranslation();

  const handleCategoryFilter = (categorySlug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (categorySlug) {
      params.set('category', categorySlug);
    } else {
      params.delete('category');
    }
    router.push(`/${locale}/articles?${params.toString()}`);
  };

  const getSlug = (article: Article) => {
    if (locale === 'pt-BR' && article.slugPt) return article.slugPt;
    if (locale === 'en-US' && article.slugEn) return article.slugEn;
    return article.slug;
  };

  const getArticlePath = (article: Article) => {
    const articleSlug = getSlug(article);

    // If article has a category, build the full category path
    if (article.category) {
      // Find the full category object from context
      const fullCategory = categories.find((c) => c.id === article.category?.id);

      if (fullCategory) {
        try {
          const categoryPath = buildPath(fullCategory, locale);
          return `/${locale}/${categoryPath}/${articleSlug}`;
        } catch (error) {
          // Fallback to simple category slug if buildPath fails
        }
      }

      // Fallback to simple category slug
      const categorySlug =
        locale === 'pt-BR'
          ? article.category.slugPt || article.category.slug
          : article.category.slugEn || article.category.slug;
      return `/${locale}/${categorySlug}/${articleSlug}`;
    }

    // Fallback to articles route if no category
    return `/${locale}/articles/${articleSlug}`;
  };

  const formatDate = (date: string | Date) => {
    return formatArticleDate(date, locale);
  };

  const getCategoryName = (category: RootCategory) => {
    if (locale === 'pt-BR' && category.namePt) return category.namePt;
    if (locale === 'en-US' && category.nameEn) return category.nameEn;
    return category.name;
  };

  const getCategorySlug = (category: RootCategory) => {
    if (locale === 'pt-BR' && category.slugPt) return category.slugPt;
    if (locale === 'en-US' && category.slugEn) return category.slugEn;
    return category.slug;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-brand-600 to-brand-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">{t('articles.allArticles')}</h1>
          <p className="text-xl text-brand-100">{t('articles.allArticlesSubtitle')}</p>
        </div>
      </div>

      {/* Filter Tags */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-slate-700 mr-2">
              {t('articles.filterBy')}
            </span>
            <button
              onClick={() => handleCategoryFilter(null)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                !selectedCategory
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {t('articles.all')}
            </button>
            {rootCategories.map((category) => {
              const categorySlug = getCategorySlug(category);
              const categoryName = getCategoryName(category);
              const isSelected = selectedCategory === categorySlug;

              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryFilter(categorySlug)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                    isSelected
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {categoryName}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {articles.length === 0 ? (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <svg
                className="w-24 h-24 mx-auto text-slate-300 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                {t('articles.noArticlesFound')}
              </h3>
              <p className="text-slate-600">{t('articles.noArticlesMessage')}</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <p className="text-slate-600">
                {t('articles.showing')} {articles.length}{' '}
                {articles.length === 1 ? t('articles.article') : t('articles.articles')}
                {selectedCategory && (
                  <span className="ml-2">
                    {t('articles.in')}{' '}
                    <span className="font-semibold text-slate-900">
                      {getCategoryName(
                        rootCategories.find((cat) => getCategorySlug(cat) === selectedCategory) ||
                          rootCategories[0]
                      )}
                    </span>
                  </span>
                )}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={getArticlePath(article)}
                  className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-brand-300"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <Image
                      src={normalizeImageUrl(article.imageUrl)}
                      alt={article.imageAlt || article.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {article.partnerTag && (
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        {article.partnerTag.split(',').map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 text-xs font-semibold bg-brand-500 text-white rounded-full"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-sm text-slate-500 mb-3">
                      <span>{formatDate(article.date)}</span>
                      {article.readingTime && (
                        <>
                          <span>•</span>
                          <span>
                            {article.readingTime} {t('common.minRead')}
                          </span>
                        </>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-slate-600 line-clamp-3 text-sm leading-relaxed">
                      {article.excerpt}
                    </p>
                    <div className="mt-4 flex items-center text-brand-600 font-semibold text-sm group-hover:gap-2 transition-all">
                      {t('articles.readMore')}
                      <svg
                        className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
