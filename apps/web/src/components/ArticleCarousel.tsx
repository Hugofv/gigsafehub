'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCategories } from '@/contexts/CategoriesContext';
import { normalizeImageUrl } from '@/lib/imageUtils';
import { formatArticleDateLong } from '@/lib/dateUtils';

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
  category?: {
    id: string;
    name: string;
    slug: string;
    slugEn?: string;
    slugPt?: string;
  } | null;
}

interface ArticleCarouselProps {
  articles: Article[];
  locale: string;
}

export default function ArticleCarousel({ articles, locale }: ArticleCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { buildPath, categories } = useCategories();

  // Auto-advance carousel
  useEffect(() => {
    if (articles.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [articles.length]);

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
    return formatArticleDateLong(date, locale);
  };

  const currentArticle = articles[currentIndex];

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-12">
      {/* Carousel Container */}
      <div className="relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
        <Link
          href={getArticlePath(currentArticle)}
          className="block group"
        >
          <div className="relative h-64 md:h-80 lg:h-96">
            <Image
              src={normalizeImageUrl(currentArticle.imageUrl)}
              alt={currentArticle.imageAlt || currentArticle.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                {currentArticle.partnerTag && (
                  <>
                    {currentArticle.partnerTag.split(',').map((tag, index) => (
                      <span key={index} className="px-3 py-1 text-xs font-semibold bg-brand-500 rounded-full">
                        {tag.trim()}
                      </span>
                    ))}
                  </>
                )}
                <span className="text-sm text-white/80">
                  {formatDate(currentArticle.date)}
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-3 line-clamp-2 group-hover:text-brand-300 transition-colors">
                {currentArticle.title}
              </h3>
              <p className="text-white/90 line-clamp-2 text-sm md:text-base">
                {currentArticle.excerpt}
              </p>
            </div>
          </div>
        </Link>

        {/* Navigation Dots */}
        {articles.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
            {articles.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? 'w-8 bg-white'
                    : 'w-2 bg-white/50 hover:bg-white/75'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Navigation Arrows */}
        {articles.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentIndex((prev) => (prev - 1 + articles.length) % articles.length);
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all z-10"
              aria-label="Previous article"
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentIndex((prev) => (prev + 1) % articles.length);
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-2 transition-all z-10"
              aria-label="Next article"
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

