'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslation } from '@/contexts/I18nContext';
import { useCategories } from '@/contexts/CategoriesContext';
import { normalizeImageUrl } from '@/lib/imageUtils';
import { formatArticleDateLong } from '@/lib/dateUtils';
import { trackToolsCTAClick, trackSimulatorCTAClick, trackRelatedArticleClick } from '@/lib/analytics';
import { matchToolsToArticle, getToolUrl, getToolName, getToolDescription, getToolCTA, ToolInfo } from '@/lib/toolMatcher';
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
  category?: {
    id: string;
    name: string;
    slug: string;
    slugEn?: string;
    slugPt?: string;
    parentId?: string | null;
  } | null;
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

// Helper function to build article path
function buildArticlePath(
  article: RelatedArticle,
  locale: string,
  categories: any[],
  buildPath: (category: any, locale?: string) => string
): string {
  const articleSlug =
    locale === 'pt-BR' && article.slugPt
      ? article.slugPt
      : locale === 'en-US' && article.slugEn
        ? article.slugEn
        : article.slug;

  // If article has a category, build the full category path
  if (article.category) {
    // Find the full category object from categories
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
}

// Component for inline CTA
function InlineRelatedArticleCTA({
  relatedArticle,
  locale,
  categories,
  buildPath,
  currentArticleSlug,
}: {
  relatedArticle: RelatedArticle;
  locale: string;
  categories: any[];
  buildPath: (category: any, locale?: string) => string;
  currentArticleSlug?: string;
}) {
  const relatedPath = buildArticlePath(relatedArticle, locale, categories, buildPath);

  return (
    <div className="my-8 py-6 px-4 border-l-4 border-brand-300 bg-slate-50 rounded-r">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          <svg
            className="w-5 h-5 text-brand-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
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
            onClick={() => trackRelatedArticleClick(currentArticleSlug || '', relatedArticle.slug)}
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

// Tool icon component
function ToolIcon({ icon, className }: { icon: ToolInfo['icon']; className?: string }) {
  const icons = {
    calculator: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    ),
    chart: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    ),
    currency: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
    search: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    ),
    flame: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    ),
    warning: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    ),
    budget: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    ),
  };

  return (
    <svg className={className || "w-7 h-7 text-white"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {icons[icon]}
    </svg>
  );
}

// Dynamic Tool CTA component
function InlineToolCTA({ tool, locale, position }: { tool: ToolInfo; locale: string; position: string }) {
  const toolUrl = getToolUrl(tool, locale);
  const toolName = getToolName(tool, locale);
  const toolDescription = getToolDescription(tool, locale);
  const ctaText = getToolCTA(tool, locale);

  // Get gradient colors for background
  const gradientMap: Record<string, { bg: string; border: string; badge: string; shadow: string }> = {
    'from-emerald-500 to-teal-500': {
      bg: 'from-emerald-50 via-teal-50 to-green-50',
      border: 'border-emerald-200',
      badge: 'bg-emerald-100 text-emerald-700',
      shadow: 'shadow-emerald-500/20'
    },
    'from-rose-500 to-pink-500': {
      bg: 'from-rose-50 via-pink-50 to-red-50',
      border: 'border-rose-200',
      badge: 'bg-rose-100 text-rose-700',
      shadow: 'shadow-rose-500/20'
    },
    'from-cyan-500 to-teal-500': {
      bg: 'from-cyan-50 via-teal-50 to-blue-50',
      border: 'border-cyan-200',
      badge: 'bg-cyan-100 text-cyan-700',
      shadow: 'shadow-cyan-500/20'
    },
    'from-purple-500 to-violet-500': {
      bg: 'from-purple-50 via-violet-50 to-indigo-50',
      border: 'border-purple-200',
      badge: 'bg-purple-100 text-purple-700',
      shadow: 'shadow-purple-500/20'
    },
    'from-amber-500 to-orange-500': {
      bg: 'from-amber-50 via-orange-50 to-yellow-50',
      border: 'border-amber-200',
      badge: 'bg-amber-100 text-amber-700',
      shadow: 'shadow-amber-500/20'
    },
    'from-violet-500 to-purple-500': {
      bg: 'from-violet-50 via-purple-50 to-indigo-50',
      border: 'border-violet-200',
      badge: 'bg-violet-100 text-violet-700',
      shadow: 'shadow-violet-500/20'
    },
    'from-blue-500 to-indigo-500': {
      bg: 'from-blue-50 via-indigo-50 to-violet-50',
      border: 'border-blue-200',
      badge: 'bg-blue-100 text-blue-700',
      shadow: 'shadow-blue-500/20'
    },
    'from-orange-500 to-red-500': {
      bg: 'from-orange-50 via-amber-50 to-yellow-50',
      border: 'border-orange-200',
      badge: 'bg-orange-100 text-orange-700',
      shadow: 'shadow-orange-500/20'
    },
  };

  const colors = gradientMap[tool.gradient] || gradientMap['from-orange-500 to-red-500'];

  return (
    <div className="my-10 not-prose">
      <div className={`bg-gradient-to-br ${colors.bg} rounded-2xl p-6 md:p-8 relative overflow-hidden border ${colors.border}`}>
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/50 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/50 rounded-full blur-2xl"></div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-5">
          <div className="flex-shrink-0">
            <div className={`w-14 h-14 bg-gradient-to-br ${tool.gradient} rounded-xl flex items-center justify-center shadow-lg ${colors.shadow}`}>
              <ToolIcon icon={tool.icon} />
            </div>
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className={`inline-flex items-center px-2 py-0.5 rounded-full ${colors.badge} text-xs font-medium mb-2`}>
              {locale === 'pt-BR' ? '🆓 Ferramenta Gratuita' : '🆓 Free Tool'}
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-1">
              {toolName}
            </h4>
            <p className="text-slate-600 text-sm">
              {toolDescription}
            </p>
          </div>
          <div className="flex-shrink-0">
            <Link
              href={toolUrl}
              className={`inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r ${tool.gradient} text-white font-bold rounded-lg hover:opacity-90 transition-all shadow-lg ${colors.shadow} text-sm whitespace-nowrap`}
              onClick={() => trackSimulatorCTAClick(`article_${position}_${tool.id}`)}
            >
              {ctaText}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Banner Tool CTA (shown after image) - Light Theme
function BannerToolCTA({ tools, locale }: { tools: ToolInfo[]; locale: string }) {
  if (tools.length === 0) return null;

  return (
    <div className="mb-8 not-prose">
      <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 rounded-2xl p-6 relative overflow-hidden border border-slate-200 shadow-sm">
        {/* Decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-teal-100/50 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-orange-100/50 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-1 w-8 bg-gradient-to-r from-teal-500 to-orange-500 rounded-full"></div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
              {locale === 'pt-BR' ? 'Ferramentas Recomendadas' : 'Recommended Tools'}
            </span>
          </div>

          <div className={`grid gap-4 ${tools.length === 2 ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
            {tools.map((tool) => {
              const toolUrl = getToolUrl(tool, locale);
              const toolName = getToolName(tool, locale);
              const ctaText = getToolCTA(tool, locale);

              return (
                <Link
                  key={tool.id}
                  href={toolUrl}
                  className="group flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all"
                  onClick={() => trackSimulatorCTAClick(`article_banner_${tool.id}`)}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${tool.gradient} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                    <ToolIcon icon={tool.icon} className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-slate-900 font-semibold text-sm mb-0.5 group-hover:text-brand-600 transition-colors">
                      {toolName}
                    </h4>
                    <p className="text-slate-500 text-xs">
                      {ctaText}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Function to split content and insert CTAs
function splitContentWithCTAs(
  content: string,
  relatedArticles: RelatedArticle[] | undefined,
  inlineTool: ToolInfo | null
): Array<{ type: 'html' | 'cta' | 'tool'; content?: string; article?: RelatedArticle; tool?: ToolInfo }> {
  const parts: Array<{ type: 'html' | 'cta' | 'tool'; content?: string; article?: RelatedArticle; tool?: ToolInfo }> = [];

  if (!content) {
    return [{ type: 'html', content: '' }];
  }

  // Find all break points (after closing tags)
  const breakTagRegex = /<\/(p|h2|h3|section|div|ul|ol)>/gi;
  const breakPoints: number[] = [];

  let match;
  while ((match = breakTagRegex.exec(content)) !== null) {
    breakPoints.push(match.index + match[0].length);
  }

  if (breakPoints.length < 2) {
    // Not enough break points, just return content with tool CTA at end
    parts.push({ type: 'html', content });
    if (inlineTool) {
      parts.push({ type: 'tool', tool: inlineTool });
    }
    return parts;
  }

  // Calculate insertion points:
  // - Related article CTA: after ~25% of content
  // - Tool CTA: after ~60% of content
  const contentLength = content.length;
  const relatedArticlePoint = Math.floor(contentLength * 0.25);
  const toolPoint = Math.floor(contentLength * 0.60);

  // Find closest break points
  let relatedBreakIndex = -1;
  let toolBreakIndex = -1;

  for (let i = 0; i < breakPoints.length; i++) {
    if (relatedBreakIndex === -1 && breakPoints[i] >= relatedArticlePoint) {
      relatedBreakIndex = i;
    }
    if (toolBreakIndex === -1 && breakPoints[i] >= toolPoint) {
      toolBreakIndex = i;
    }
  }

  // Ensure tool comes after related article
  if (toolBreakIndex <= relatedBreakIndex) {
    toolBreakIndex = Math.min(relatedBreakIndex + 2, breakPoints.length - 1);
  }

  // Build parts with CTAs inserted
  let lastIndex = 0;
  let relatedArticleInserted = false;
  let toolInserted = false;
  let relatedArticleIndex = 0;

  for (let i = 0; i < breakPoints.length; i++) {
    const breakPoint = breakPoints[i];

    // Insert related article CTA
    if (!relatedArticleInserted && i === relatedBreakIndex && relatedArticles && relatedArticles.length > 0) {
      const htmlContent = content.substring(lastIndex, breakPoint);
      if (htmlContent.trim()) {
        parts.push({ type: 'html', content: htmlContent });
      }
      parts.push({ type: 'cta', article: relatedArticles[relatedArticleIndex] });
      relatedArticleIndex++;
      relatedArticleInserted = true;
      lastIndex = breakPoint;
    }

    // Insert tool CTA
    if (!toolInserted && i === toolBreakIndex && inlineTool) {
      const htmlContent = content.substring(lastIndex, breakPoint);
      if (htmlContent.trim()) {
        parts.push({ type: 'html', content: htmlContent });
      }
      parts.push({ type: 'tool', tool: inlineTool });
      toolInserted = true;
      lastIndex = breakPoint;

      // Insert second related article if available
      if (relatedArticles && relatedArticles.length > relatedArticleIndex) {
        // Find next break point for second related article
        const nextBreakIndex = Math.min(i + 2, breakPoints.length - 1);
        if (nextBreakIndex > i) {
          const nextBreakPoint = breakPoints[nextBreakIndex];
          const nextHtmlContent = content.substring(lastIndex, nextBreakPoint);
          if (nextHtmlContent.trim()) {
            parts.push({ type: 'html', content: nextHtmlContent });
          }
          parts.push({ type: 'cta', article: relatedArticles[relatedArticleIndex] });
          lastIndex = nextBreakPoint;
        }
      }
    }
  }

  // Add remaining content
  if (lastIndex < content.length) {
    const remaining = content.substring(lastIndex);
    if (remaining.trim()) {
      parts.push({ type: 'html', content: remaining });
    }
  }

  // If tool wasn't inserted (e.g., content too short), add at end
  if (!toolInserted && inlineTool) {
    parts.push({ type: 'tool', tool: inlineTool });
  }

  // Ensure we always have at least one part
  if (parts.length === 0) {
    parts.push({ type: 'html', content });
    if (inlineTool) {
      parts.push({ type: 'tool', tool: inlineTool });
    }
  }

  return parts;
}

export default function ArticleDetailClient({
  article,
  locale,
  isComparison = false,
}: ArticleDetailClientProps) {
  const { t } = useTranslation();
  const { categories, buildPath } = useCategories();

  // Determine if this is a comparison article based on category or prop
  const isComparisonArticle =
    isComparison || (article.category?.name?.toLowerCase().includes('compar') ?? false);

  // Get category slug for breadcrumb
  const categorySlug = article.category
    ? locale === 'pt-BR'
      ? article.category.slugPt || article.category.slug
      : article.category.slugEn || article.category.slug
    : 'articles';

  const categoryName =
    article.category?.name || (isComparisonArticle ? t('nav.compare') : t('nav.blog'));

  const formatDate = (dateString: string) => {
    return formatArticleDateLong(dateString, locale === 'pt-BR' ? 'pt-BR' : 'en-US');
  };

  // Build article URL for sharing
  const articleSlug =
    locale === 'pt-BR' ? article.slugPt || article.slug : article.slugEn || article.slug;
  const articleUrl = `/${locale}/${categorySlug}/${articleSlug}`;

  // Match tools to article content
  const matchedTools = useMemo(() => {
    try {
      return matchToolsToArticle(article.title, article.content || '', article.excerpt);
    } catch (error) {
      console.error('Error matching tools:', error);
      return [];
    }
  }, [article.title, article.content, article.excerpt]);

  // Process content to insert CTAs (use first tool for inline CTA)
  const contentParts = useMemo(() => {
    try {
      const inlineTool = matchedTools.length > 0 ? matchedTools[0] : null;
      return splitContentWithCTAs(article.content || '', article.relatedArticles, inlineTool);
    } catch (error) {
      console.error('Error processing content:', error);
      return [{ type: 'html' as const, content: article.content || '' }];
    }
  }, [article.content, article.relatedArticles, matchedTools]);

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

          {article.excerpt && <p className="text-xl text-slate-600 mb-6">{article.excerpt}</p>}

          <div className="flex items-center gap-4 text-sm text-slate-500 mb-6">
            <time dateTime={article.date}>{formatDate(article.date)}</time>
            {article.readingTime && (
              <>
                <span>•</span>
                <span>
                  {article.readingTime} {t('common.minRead')}
                </span>
              </>
            )}
            {article.partnerTag && (
              <>
                <span>•</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {article.partnerTag.split(',').map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-brand-100 text-brand-700 rounded-full text-xs"
                    >
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

      {/* Tools CTA Banner */}
      <div className="bg-gradient-to-r from-brand-50 via-teal-50 to-brand-50 border-y border-brand-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link
            href={`/${locale}${locale === 'pt-BR' ? '/ferramentas' : '/tools'}`}
            className="flex items-center justify-center gap-3 group"
            onClick={() => trackToolsCTAClick('article_header_banner')}
          >
            <span className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg shadow-sm">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </span>
            <span className="text-sm font-medium text-slate-700 group-hover:text-brand-600 transition-colors">
              {locale === 'pt-BR'
                ? '🆓 Experimente nossas ferramentas gratuitas para autônomos'
                : '🆓 Try our free tools for gig workers'}
            </span>
            <svg className="w-4 h-4 text-slate-400 group-hover:text-brand-600 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
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

        {/* Banner Tool CTA - shown after image */}
        {matchedTools.length > 0 && (
          <BannerToolCTA tools={matchedTools} locale={locale} />
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 md:p-12">
          <div className="prose prose-lg max-w-none prose-slate prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-slate-900 prose-code:text-brand-600 prose-code:bg-slate-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
            {contentParts.map((part, index) => {
              if (part.type === 'html' && part.content) {
                return (
                  <div key={`html-${index}`} dangerouslySetInnerHTML={{ __html: part.content }} />
                );
              } else if (part.type === 'cta' && part.article) {
                return (
                  <InlineRelatedArticleCTA
                    key={`cta-${index}`}
                    relatedArticle={part.article}
                    locale={locale}
                    categories={categories}
                    buildPath={buildPath}
                    currentArticleSlug={article.slug}
                  />
                );
              } else if (part.type === 'tool' && part.tool) {
                return <InlineToolCTA key={`tool-${index}`} tool={part.tool} locale={locale} position="inline" />;
              }
              return null;
            })}
          </div>

          {/* Article Credits Section */}
          <div className="mt-8 pt-8 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-600">
              {locale === 'pt-BR' ? (
                <>
                  Artigo criado por <strong className="text-slate-700">GigSafeHub</strong>. Para
                  republicação, favor manter créditos e link para{' '}
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
                  Article created by <strong className="text-slate-700">GigSafeHub</strong>. For
                  republication, please maintain credits and link to{' '}
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
            <div
              className={`grid gap-6 ${
                article.relatedArticles.length === 1
                  ? 'grid-cols-1 max-w-2xl'
                  : article.relatedArticles.length === 2
                    ? 'grid-cols-1 md:grid-cols-2'
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }`}
            >
              {article.relatedArticles.map((relatedArticle, index) => {
                const relatedPath = buildArticlePath(relatedArticle, locale, categories, buildPath);

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
                          <svg
                            className="w-16 h-16 text-brand-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
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
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                          {locale === 'pt-BR' ? 'Relacionado' : 'Related'}
                        </span>
                        {relatedArticle.readingTime && (
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
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
                          <svg
                            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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
            <p className="text-slate-600">{t('common.relatedProductsDescription')}</p>
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {isComparisonArticle ? t('common.backToComparisons') : t('common.backToArticles')}
          </Link>
        </div>
      </div>
    </div>
  );
}
