'use client';

import React from 'react';
import { getQuizBySlug, getQuizResultById, type QuizSlug } from '@/lib/quizData';
import QuizEngine from '@/components/quiz/QuizEngine';
import QuizResult from '@/components/quiz/QuizResult';
import type { RecommendedArticle } from '@/components/quiz/QuizResult';

interface QuizPageClientProps {
  slug: string;
  locale: string;
  resultId: string | null;
  /** Pre-fetched when opening with ?result= (EEAT: recommended reading) */
  recommendedArticles?: RecommendedArticle[];
}

export default function QuizPageClient({ slug, locale, resultId, recommendedArticles = [] }: QuizPageClientProps) {
  const quiz = getQuizBySlug(slug);
  const isPt = locale === 'pt-BR';

  if (!quiz) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <p className="text-slate-400">
          {isPt ? 'Quiz não encontrado.' : 'Quiz not found.'}
        </p>
      </div>
    );
  }

  if (resultId) {
    const result = getQuizResultById(slug, resultId);
    if (result) {
      return (
        <QuizResult
          result={result}
          quizSlug={slug}
          quizTitle={isPt ? quiz.title : (quiz.titleEn ?? quiz.title)}
          locale={locale}
          updateUrl={false}
          keyFactors={[]}
          quizDisclaimer={quiz.disclaimer}
          quizDisclaimerEn={quiz.disclaimerEn}
          recommendedArticles={recommendedArticles}
        />
      );
    }
  }

  return (
    <QuizEngine
      quiz={quiz}
      locale={locale}
      slug={slug as QuizSlug}
      recommendedArticles={recommendedArticles}
    />
  );
}
