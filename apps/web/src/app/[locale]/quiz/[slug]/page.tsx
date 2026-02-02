import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getQuizBySlug, getQuizResultById } from '@/lib/quizData';
import { getArticleBySlug, getLatestArticles } from '@/services/api';
import QuizPageClient from './QuizPageClient';

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ result?: string }>;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const { result: resultId } = await searchParams;
  const quiz = getQuizBySlug(slug);
  if (!quiz) return { title: 'Quiz | GigSafeHub' };

  const isPt = locale === 'pt-BR';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gigsafehub.com';
  const quizTitle = isPt ? quiz.title : (quiz.titleEn ?? quiz.title);

  let title = quizTitle;
  let description = isPt ? quiz.description : (quiz.descriptionEn ?? quiz.description);

  if (resultId) {
    const result = getQuizResultById(slug, resultId);
    if (result) {
      const resultTitle = isPt ? result.title : (result.titleEn ?? result.title);
      title = `${resultTitle} | ${quizTitle}`;
      description = isPt ? result.description : (result.descriptionEn ?? result.description);
    }
  }

  const url = resultId
    ? `${baseUrl}/${locale}/quiz/${slug}?result=${encodeURIComponent(resultId)}`
    : `${baseUrl}/${locale}/quiz/${slug}`;

  const ogImageUrl = resultId
    ? `${baseUrl}/api/og/quiz-result?slug=${encodeURIComponent(slug)}&result=${encodeURIComponent(resultId)}&locale=${encodeURIComponent(locale)}`
    : undefined;

  return {
    title: `${title} | GigSafeHub`,
    description,
    openGraph: {
      title: `${title} | GigSafeHub`,
      description,
      url,
      siteName: 'GigSafeHub',
      locale: isPt ? 'pt_BR' : 'en_US',
      ...(ogImageUrl && {
        images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | GigSafeHub`,
      description,
      ...(ogImageUrl && { images: [ogImageUrl] }),
    },
    alternates: {
      canonical: url,
    },
    robots: { index: true, follow: true },
  };
}

export default async function QuizSlugPage({ params, searchParams }: PageProps) {
  const { locale, slug } = await params;
  const { result: resultId } = await searchParams;
  const quiz = getQuizBySlug(slug);

  if (!quiz) notFound();

  const isPt = locale === 'pt-BR';
  const quizTitle = isPt ? quiz.title : (quiz.titleEn ?? quiz.title);

  let recommendedArticles: { title: string; excerpt?: string; url: string }[] = [];
  if (resultId) {
    const result = getQuizResultById(slug, resultId);
    const slugs = result?.recommendedArticleSlugs?.filter(Boolean) ?? [];
    if (slugs.length > 0) {
      const fetched = await Promise.all(
        slugs.slice(0, 4).map((articleSlug) => getArticleBySlug(articleSlug, locale))
      );
      recommendedArticles = fetched
        .filter((a): a is NonNullable<typeof a> => a != null)
        .map((a: any) => {
          const slugUse = locale === 'pt-BR' ? (a.slugPt ?? a.slug) : (a.slugEn ?? a.slug);
          return {
            title: a.title,
            excerpt: a.excerpt,
            url: `/${locale}/articles/${slugUse}`,
          };
        });
    }
    if (recommendedArticles.length === 0) {
      const articles = await getLatestArticles(3, locale);
      recommendedArticles = (articles || []).slice(0, 3).map((a: any) => {
        const articleSlug = locale === 'pt-BR' ? (a.slugPt ?? a.slug) : (a.slugEn ?? a.slug);
        const url = `/${locale}/articles/${articleSlug}`;
        return { title: a.title, excerpt: a.excerpt, url };
      });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-navy-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <nav className="flex items-center space-x-2 text-sm mb-8" aria-label="Breadcrumb">
          <Link href={`/${locale}`} className="text-slate-400 hover:text-white transition-colors">
            {isPt ? 'Início' : 'Home'}
          </Link>
          <span className="text-slate-600" aria-hidden="true">/</span>
          <Link href={`/${locale}/quiz`} className="text-slate-400 hover:text-white transition-colors">
            {isPt ? 'Quizzes' : 'Quizzes'}
          </Link>
          <span className="text-slate-600" aria-hidden="true">/</span>
          <span className="text-white font-medium" aria-current="page">{quizTitle}</span>
        </nav>

        {!resultId && (
          <header className="text-center max-w-2xl mx-auto mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{quizTitle}</h1>
            <p className="text-slate-300">
              {isPt ? quiz.description : (quiz.descriptionEn ?? quiz.description)}
            </p>
            <p className="text-sm text-slate-500 mt-2">~{quiz.estimatedMinutes} min</p>
          </header>
        )}

        <QuizPageClient
          slug={slug}
          locale={locale}
          resultId={resultId ?? null}
          recommendedArticles={recommendedArticles}
        />
      </div>
    </div>
  );
}
