'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { QuizResultVariant, QuizResultCta, KeyFactor } from '@/lib/quizData';

export interface RecommendedArticle {
  title: string;
  excerpt?: string;
  url: string;
}

interface QuizResultProps {
  result: QuizResultVariant;
  quizSlug: string;
  quizTitle: string;
  locale: string;
  totalScore?: number;
  /** Factors that drove this result (from answers); empty when viewing shared URL */
  keyFactors?: KeyFactor[];
  /** Quiz-level disclaimer (EEAT) */
  quizDisclaimer?: string;
  quizDisclaimerEn?: string;
  /** Articles to show in "Leia em seguida" (fetched by page) */
  recommendedArticles?: RecommendedArticle[];
  /** When true, update URL with ?result= for sharing (e.g. after completing quiz) */
  updateUrl?: boolean;
}

function getCtaHref(cta: QuizResultCta, locale: string): string {
  const path = locale === 'pt-BR' ? cta.path : (cta.pathEn ?? cta.path);
  return `/${locale}${path}`;
}

export default function QuizResult({
  result,
  quizSlug,
  quizTitle,
  locale,
  totalScore,
  keyFactors = [],
  quizDisclaimer,
  quizDisclaimerEn,
  recommendedArticles = [],
  updateUrl = true,
}: QuizResultProps) {
  const router = useRouter();

  const isPt = locale === 'pt-BR';
  const title = isPt ? result.title : (result.titleEn ?? result.title);
  const description = isPt ? result.description : (result.descriptionEn ?? result.description);
  const methodologyShort = isPt ? result.methodologyShort : (result.methodologyShortEn ?? result.methodologyShort);
  const disclaimerText = isPt ? quizDisclaimer : (quizDisclaimerEn ?? quizDisclaimer);
  const factorsToShow = keyFactors.length >= 1 ? keyFactors : (result.keyFactorsFallback ?? []);

  useEffect(() => {
    if (!updateUrl || !result?.id) return;
    const path = `/${locale}/quiz/${quizSlug}?result=${encodeURIComponent(result.id)}`;
    router.replace(path, { scroll: false });
  }, [updateUrl, result?.id, locale, quizSlug, router]);

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="rounded-2xl border border-teal-500/30 bg-white/5 backdrop-blur-sm p-8 md:p-10">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{title}</h2>
        <p className="text-slate-300 leading-relaxed mb-6">{description}</p>
        {totalScore != null && (
          <p className="text-sm text-slate-400 mb-6">
            {isPt ? 'Seu score:' : 'Your score:'} {totalScore}
          </p>
        )}

        {/* O que pesou no seu resultado */}
        {factorsToShow.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
              {isPt ? 'O que pesou no seu resultado' : 'What drove your result'}
            </h3>
            <ul className="space-y-2">
              {factorsToShow.map((f) => (
                <li key={f.id} className="flex items-center gap-3 text-slate-200">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-500/30 flex items-center justify-center text-teal-400 text-xs font-bold">!</span>
                  <span>{isPt ? f.label : (f.labelEn ?? f.label)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Próximos passos (ordered CTAs) */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
            {isPt ? 'Próximos passos' : 'Next steps'}
          </h3>
          <div className="space-y-3">
            {result.ctas.map((cta, index) => {
              const href = getCtaHref(cta, locale);
              const label = isPt ? cta.label : (cta.labelEn ?? cta.label);
              return (
                <Link
                  key={cta.path + (cta.pathEn ?? '') + index}
                  href={href}
                  className="flex items-center gap-4 w-full text-left px-5 py-4 rounded-xl bg-teal-500/20 border border-teal-500/30 hover:bg-teal-500/30 text-white font-medium transition-colors"
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  {label}
                  <span className="ml-auto text-teal-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Leia em seguida (recommended articles) */}
        {recommendedArticles.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-3">
              {isPt ? 'Leia em seguida' : 'Recommended reading'}
            </h3>
            <ul className="space-y-3">
              {recommendedArticles.map((art) => (
                <li key={art.url}>
                  <Link
                    href={art.url}
                    className="block p-4 rounded-xl bg-white/5 border border-white/10 hover:border-teal-500/30 hover:bg-white/10 transition-colors"
                  >
                    <span className="font-semibold text-white">{art.title}</span>
                    {art.excerpt && (
                      <p className="text-sm text-slate-400 mt-1 line-clamp-2">{art.excerpt}</p>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Como interpretamos este quiz (methodology) */}
        {methodologyShort && (
          <div className="mb-8 p-4 rounded-xl bg-slate-800/50 border border-slate-600/30">
            <h3 className="text-sm font-semibold text-slate-300 mb-2">
              {isPt ? 'Como interpretamos este quiz' : 'How we interpret this quiz'}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">{methodologyShort}</p>
          </div>
        )}

        {/* Disclaimer */}
        {disclaimerText && (
          <div className="mb-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <p className="text-sm text-amber-200/90 leading-relaxed">{disclaimerText}</p>
            <Link
              href={`/${locale}/faq`}
              className="inline-block mt-2 text-sm font-medium text-amber-400 hover:text-amber-300"
            >
              {isPt ? 'Dúvidas sobre seguros e risco? Veja o FAQ' : 'Questions about insurance and risk? See the FAQ'}
            </Link>
          </div>
        )}

      </div>

      <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
        <Link href={`/${locale}/quiz`} className="text-slate-400 hover:text-white font-medium">
          {isPt ? 'Ver outros quizzes' : 'View other quizzes'}
        </Link>
        <span className="text-slate-600">|</span>
        <Link href={`/${locale}/faq`} className="text-slate-400 hover:text-white font-medium">
          {isPt ? 'FAQ' : 'FAQ'}
        </Link>
      </div>
    </div>
  );
}
