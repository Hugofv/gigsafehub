'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/contexts/I18nContext';
import { normalizeImageUrl } from '@/lib/imageUtils';
import { formatArticleDateLong } from '@/lib/dateUtils';
import CommentsSection from '@/components/Comments';
import ShareButtons from '@/components/ShareButtons';

interface RelatedArticle {
  id: string;
  title: string;
  slug: string;
  slugEn?: string;
  slugPt?: string;
  excerpt?: string;
  imageUrl?: string;
  imageAlt?: string;
  date?: string;
  readingTime?: number;
}

interface Article {
  id: string;
  title: string;
  slug: string;
  slugEn?: string;
  slugPt?: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  imageAlt?: string;
  date: string;
  partnerTag?: string;
  locale: string;
  readingTime?: number;
  relatedProductIds?: string[];
  relatedArticles?: RelatedArticle[];
  categoryId?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
    slugEn?: string;
    slugPt?: string;
  } | null;
}

interface ArticleDetailClientProps {
  article: Article;
  locale: string;
  isComparison?: boolean;
}

export default function ArticleDetailClient({ article, locale, isComparison = false }: ArticleDetailClientProps) {
  const { t } = useTranslation();

  // Determine if this is a comparison article based on category or prop
  const isComparisonArticle = isComparison || (article.category?.name?.toLowerCase().includes('compar') ?? false);

  // Get category slug for breadcrumb
  const categorySlug = article.category
    ? (locale === 'pt-BR'
        ? (article.category.slugPt || article.category.slug)
        : (article.category.slugEn || article.category.slug))
    : 'articles';

  const categoryName = article.category?.name || (isComparisonArticle ? t('nav.compare') : t('nav.blog'));

  const formatDate = (dateString: string) => {
    return formatArticleDateLong(dateString, locale === 'pt-BR' ? 'pt-BR' : 'en-US');
  };

  // Build article URL for sharing
  const articleSlug = locale === 'pt-BR'
    ? (article.slugPt || article.slug)
    : (article.slugEn || article.slug);
  const articleUrl = `/${locale}/${categorySlug}/${articleSlug}`;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="text-sm text-slate-600 mb-4">
            <Link href={`/${locale}`} className="hover:text-brand-600">
              {t('nav.home')}
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/${locale}/${categorySlug}`} className="hover:text-brand-600">
              {categoryName}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-slate-900">{article.title}</span>
          </nav>

          <h1 className="text-4xl font-bold text-slate-900 mb-4">{article.title}</h1>

          {article.excerpt && (
            <p className="text-xl text-slate-600 mb-6">{article.excerpt}</p>
          )}

          <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
            <time dateTime={article.date}>{formatDate(article.date)}</time>
            {article.readingTime && (
              <>
                <span>•</span>
                <span>{article.readingTime} {t('common.minRead')}</span>
              </>
            )}
            {article.partnerTag && (
              <>
                <span>•</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {article.partnerTag.split(',').map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-brand-100 text-brand-700 rounded-full text-xs">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Share Buttons */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600 font-medium">
              {locale === 'pt-BR' ? 'Compartilhar:' : 'Share:'}
            </span>
            <ShareButtons
              url={articleUrl}
              title={article.title}
              description={article.excerpt}
              locale={locale}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {article.imageUrl && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <Image
              src={normalizeImageUrl(article.imageUrl)}
              alt={article.imageAlt || article.title}
              width={1200}
              height={600}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
          <div
            className="prose prose-lg max-w-none prose-slate prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 prose-code:text-brand-600 prose-code:bg-slate-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Article Credits Section */}
          <div className="mt-8 pt-8 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-600">
              {locale === 'pt-BR' ? (
                <>
                  Artigo criado por <strong className="text-slate-700">GigSafeHub</strong>. Para republicação, favor manter créditos e link para{' '}
                  <a
                    href="https://gigsafehub.com"
                    className="text-brand-600 hover:text-brand-700"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    gigsafehub.com
                  </a>
                  .
                </>
              ) : (
                <>
                  Article created by <strong className="text-slate-700">GigSafeHub</strong>. For republication, please maintain credits and link to{' '}
                  <a
                    href="https://gigsafehub.com"
                    className="text-brand-600 hover:text-brand-700"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    gigsafehub.com
                  </a>
                  .
                </>
              )}
            </p>
          </div>
        </div>

        {/* Related Articles Section */}
        {article.relatedArticles && article.relatedArticles.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {locale === 'pt-BR' ? 'Artigos Relacionados' : 'Related Articles'}
            </h2>
            <p className="text-slate-600 mb-6">
              {locale === 'pt-BR'
                ? 'Continue explorando conteúdo relacionado que pode ser útil para você:'
                : 'Continue exploring related content that may be useful for you:'}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {article.relatedArticles.map((relatedArticle) => {
                const relatedSlug = locale === 'pt-BR' && relatedArticle.slugPt
                  ? relatedArticle.slugPt
                  : locale === 'en-US' && relatedArticle.slugEn
                    ? relatedArticle.slugEn
                    : relatedArticle.slug;
                const relatedPath = article.category
                  ? `/${locale}/${categorySlug}/${relatedSlug}`
                  : `/${locale}/articles/${relatedSlug}`;

                return (
                  <Link
                    key={relatedArticle.id}
                    href={relatedPath}
                    className="group bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg hover:border-brand-300 transition-all"
                  >
                    {relatedArticle.imageUrl && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={normalizeImageUrl(relatedArticle.imageUrl)}
                          alt={relatedArticle.imageAlt || relatedArticle.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors line-clamp-2">
                        {relatedArticle.title}
                      </h3>
                      {relatedArticle.excerpt && (
                        <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                          {relatedArticle.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        {relatedArticle.readingTime && (
                          <>
                            <span>{relatedArticle.readingTime} {t('common.minRead')}</span>
                            {relatedArticle.date && <span>•</span>}
                          </>
                        )}
                        {relatedArticle.date && (
                          <time dateTime={relatedArticle.date}>
                            {formatDate(relatedArticle.date)}
                          </time>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Related Products Section */}
        {article.relatedProductIds && article.relatedProductIds.length > 0 && (
          <div className="mt-12 pt-8 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {t('common.relatedProducts')}
            </h2>
            <p className="text-slate-600">
              {t('common.relatedProductsDescription')}
            </p>
          </div>
        )}
      </article>

      {/* Comments Section */}
      <div className="bg-slate-50 border-t border-slate-200">
        <CommentsSection articleId={article.id} locale={locale} />

        {/* Back to Articles */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 border-t border-slate-200">
          <Link
            href={`/${locale}/${categorySlug}`}
            className="inline-flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {isComparisonArticle ? t('common.backToComparisons') : t('common.backToArticles')}
          </Link>
        </div>
      </div>
    </div>
  );
}

