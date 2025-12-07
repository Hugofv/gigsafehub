'use client';

import React, { useMemo } from 'react';
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

// Component for inline CTA
function InlineRelatedArticleCTA({
  relatedArticle,
  locale
}: {
  relatedArticle: RelatedArticle;
  locale: string;
}) {
  const relatedSlug = locale === 'pt-BR' && relatedArticle.slugPt
    ? relatedArticle.slugPt
    : locale === 'en-US' && relatedArticle.slugEn
      ? relatedArticle.slugEn
      : relatedArticle.slug;
  const relatedPath = `/${locale}/articles/${relatedSlug}`;

  return (
    <div className="my-8 py-6 px-4 border-l-4 border-brand-300 bg-slate-50 rounded-r">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-500 mb-1.5 uppercase tracking-wide">
            {locale === 'pt-BR' ? 'Artigo Relacionado' : 'Related Article'}
          </p>
          <h4 className="text-base font-semibold text-slate-900 mb-1.5 leading-snug">
            {relatedArticle.title}
          </h4>
          {relatedArticle.excerpt && (
            <p className="text-sm text-slate-600 mb-3 line-clamp-2 leading-relaxed">
              {relatedArticle.excerpt}
            </p>
          )}
          <Link
            href={relatedPath}
            className="inline-flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 font-medium transition-colors"
          >
            {locale === 'pt-BR' ? 'Ler mais' : 'Read more'}
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Function to split content and insert CTAs
function splitContentWithCTAs(
  content: string,
  relatedArticles: RelatedArticle[] | undefined
): Array<{ type: 'html' | 'cta'; content?: string; article?: RelatedArticle }> {
  if (!content || !relatedArticles || relatedArticles.length === 0) {
    return [{ type: 'html', content }];
  }

  const parts: Array<{ type: 'html' | 'cta'; content?: string; article?: RelatedArticle }> = [];

  // Split by closing section tags (</section>)
  const sectionRegex = /<\/section>/gi;
  const sectionMatches = Array.from(content.matchAll(sectionRegex));

  if (sectionMatches.length >= 2) {
    // We have multiple sections
    let lastIndex = 0;
    let ctaIndex = 0;

    sectionMatches.forEach((match, index) => {
      const sectionEnd = match.index! + match[0].length;
      const sectionContent = content.substring(lastIndex, sectionEnd);

      if (sectionContent.trim()) {
        parts.push({ type: 'html', content: sectionContent });

        // Insert CTA after first section
        if (index === 0 && ctaIndex < relatedArticles.length) {
          parts.push({ type: 'cta', article: relatedArticles[ctaIndex] });
          ctaIndex++;
        }
        // Insert CTA in the middle (after second section if we have 3+ sections)
        else if (index === 1 && sectionMatches.length >= 3 && ctaIndex < relatedArticles.length) {
          parts.push({ type: 'cta', article: relatedArticles[ctaIndex] });
          ctaIndex++;
        }
      }

      lastIndex = sectionEnd;
    });

    // Add remaining content
    if (lastIndex < content.length) {
      const remaining = content.substring(lastIndex);
      if (remaining.trim()) {
        parts.push({ type: 'html', content: remaining });
      }
    }
  } else {
    // No sections, try splitting by closing h2 tags or paragraphs
    const h2CloseRegex = /<\/h2>/gi;
    const h2Matches = Array.from(content.matchAll(h2CloseRegex));

    if (h2Matches.length >= 2) {
      // Split by h2 tags
      let lastIndex = 0;
      let ctaIndex = 0;

      h2Matches.forEach((match, index) => {
        const h2End = match.index! + match[0].length;
        const nextMatch = h2Matches[index + 1];
        const sectionEnd = nextMatch ? nextMatch.index! : content.length;
        const sectionContent = content.substring(lastIndex, sectionEnd);

        if (sectionContent.trim()) {
          parts.push({ type: 'html', content: sectionContent });

          // Insert CTA after first h2
          if (index === 0 && ctaIndex < relatedArticles.length) {
            parts.push({ type: 'cta', article: relatedArticles[ctaIndex] });
            ctaIndex++;
          }
        }

        lastIndex = sectionEnd;
      });

      // Add remaining
      if (lastIndex < content.length) {
        const remaining = content.substring(lastIndex);
        if (remaining.trim()) {
          parts.push({ type: 'html', content: remaining });
        }
      }
    } else {
      // Fallback: insert CTA after first paragraph
      const firstParagraphRegex = /(<p[^>]*>.*?<\/p>)/i;
      const firstMatch = content.match(firstParagraphRegex);

      if (firstMatch && firstMatch.index !== undefined) {
        const beforeFirst = content.substring(0, firstMatch.index);
        const firstP = firstMatch[0];
        const afterFirst = content.substring(firstMatch.index + firstMatch[0].length);

        if (beforeFirst.trim()) parts.push({ type: 'html', content: beforeFirst });
        parts.push({ type: 'html', content: firstP });
        parts.push({ type: 'cta', article: relatedArticles[0] });
        if (afterFirst.trim()) parts.push({ type: 'html', content: afterFirst });
      } else {
        // Just return content as-is
        parts.push({ type: 'html', content });
      }
    }
  }

  // Ensure we always have at least one part
  if (parts.length === 0) {
    parts.push({ type: 'html', content });
  }

  return parts;
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

  // Process content to insert CTAs
  const contentParts = useMemo(() => {
    try {
      return splitContentWithCTAs(article.content || '', article.relatedArticles);
    } catch (error) {
      console.error('Error processing content:', error);
      return [{ type: 'html' as const, content: article.content || '' }];
    }
  }, [article.content, article.relatedArticles]);

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
          <div className="prose prose-lg max-w-none prose-slate prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 prose-code:text-brand-600 prose-code:bg-slate-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
            {contentParts.map((part, index) => {
              if (part.type === 'html' && part.content) {
                return (
                  <div
                    key={`html-${index}`}
                    dangerouslySetInnerHTML={{ __html: part.content }}
                  />
                );
              } else if (part.type === 'cta' && part.article) {
                return (
                  <InlineRelatedArticleCTA
                    key={`cta-${index}`}
                    relatedArticle={part.article}
                    locale={locale}
                  />
                );
              }
              return null;
            })}
          </div>

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
          <div className="mt-16 pt-12 border-t-2 border-slate-200">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-1 w-12 bg-gradient-to-r from-brand-600 to-brand-400 rounded-full"></div>
                <h2 className="text-3xl font-bold text-slate-900">
                  {locale === 'pt-BR' ? 'Continue Explorando' : 'Continue Exploring'}
                </h2>
              </div>
              <p className="text-lg text-slate-600 max-w-2xl">
                {locale === 'pt-BR'
                  ? 'Artigos relacionados que podem ajudar você a se proteger melhor:'
                  : 'Related articles that can help you protect yourself better:'}
              </p>
            </div>
            <div className={`grid gap-6 ${
              article.relatedArticles.length === 1
                ? 'grid-cols-1 max-w-2xl'
                : article.relatedArticles.length === 2
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}>
              {article.relatedArticles.map((relatedArticle, index) => {
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
                    className="group relative bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-md border border-slate-200 overflow-hidden hover:shadow-xl hover:border-brand-400 transition-all duration-300 hover:-translate-y-1"
                  >
                    {/* Decorative gradient overlay */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-500/5 to-transparent rounded-bl-full pointer-events-none"></div>

                    {/* Image */}
                    <div className="relative h-56 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                      {relatedArticle.imageUrl ? (
                        <Image
                          src={normalizeImageUrl(relatedArticle.imageUrl)}
                          alt={relatedArticle.imageAlt || relatedArticle.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-100 to-brand-200">
                          <svg className="w-16 h-16 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                      )}
                      {/* Gradient overlay on image */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Content */}
                    <div className="p-6 relative">
                      {/* Badge */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-700 text-xs font-semibold rounded-full">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          {locale === 'pt-BR' ? 'Relacionado' : 'Related'}
                        </span>
                        {relatedArticle.readingTime && (
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {relatedArticle.readingTime} {t('common.minRead')}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors line-clamp-2 leading-tight">
                        {relatedArticle.title}
                      </h3>

                      {relatedArticle.excerpt && (
                        <p className="text-sm text-slate-600 line-clamp-3 mb-4 leading-relaxed">
                          {relatedArticle.excerpt}
                        </p>
                      )}

                      {/* CTA */}
                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <span className="text-sm font-semibold text-brand-600 group-hover:text-brand-700 flex items-center gap-2 transition-colors">
                          {locale === 'pt-BR' ? 'Ler artigo' : 'Read article'}
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                        {relatedArticle.date && (
                          <time dateTime={relatedArticle.date} className="text-xs text-slate-400">
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

