'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCategories } from '@/contexts/CategoriesContext';

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

interface ArticleListProps {
  articles: Article[];
  locale: string;
  title?: string;
  showViewAll?: boolean;
  viewAllLink?: string;
}

export default function ArticleList({
  articles,
  locale,
  title,
  showViewAll = true,
  viewAllLink,
}: ArticleListProps) {
  const { buildPath, categories } = useCategories();

  if (!articles || articles.length === 0) {
    return null;
  }

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
      const fullCategory = categories.find(c => c.id === article.category?.id);

      if (fullCategory) {
        try {
          const categoryPath = buildPath(fullCategory, locale);
          return `/${locale}/${categoryPath}/${articleSlug}`;
        } catch (error) {
          // Fallback to simple category slug if buildPath fails
        }
      }

      // Fallback to simple category slug
      const categorySlug = locale === 'pt-BR'
        ? (article.category.slugPt || article.category.slug)
        : (article.category.slugEn || article.category.slug);
      return `/${locale}/${categorySlug}/${articleSlug}`;
    }

    // Fallback to articles route if no category
    return `/${locale}/articles/${articleSlug}`;
  };

  const formatDate = (date: string | Date) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(d);
  };

  const defaultViewAllLink = `/${locale}/articles`;

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          {title && (
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{title}</h2>
              <p className="text-slate-600">Latest insights and guides for gig workers</p>
            </div>
          )}
          {showViewAll && (
            <Link
              href={viewAllLink || defaultViewAllLink}
              className="hidden md:flex items-center gap-2 text-brand-600 hover:text-brand-700 font-semibold transition-colors"
            >
              View All Articles
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>

        {/* Articles Grid */}
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
                  src={article.imageUrl || '/placeholder-article.jpg'}
                  alt={article.imageAlt || article.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {article.partnerTag && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-xs font-semibold bg-brand-500 text-white rounded-full">
                      {article.partnerTag}
                    </span>
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
                      <span>{article.readingTime} min read</span>
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
                  Read More
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile View All Button */}
        {showViewAll && (
          <div className="mt-8 text-center md:hidden">
            <Link
              href={viewAllLink || defaultViewAllLink}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-semibold rounded-lg hover:bg-brand-700 transition-colors"
            >
              View All Articles
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

