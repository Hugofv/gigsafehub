'use client';

import React, { useState, useCallback, useEffect } from 'react';
import type { QuizDefinition, QuizQuestion, QuizOption, QuizResultVariant, QuizSlug } from '@/lib/quizData';
import { computeQuizResult, getKeyFactorsForResult } from '@/lib/quizData';
import { getArticleBySlug, getLatestArticles } from '@/services/api';
import { useCategories } from '@/contexts/CategoriesContext';
import QuizResult, { type RecommendedArticle } from './QuizResult';

interface QuizEngineProps {
  quiz: QuizDefinition;
  locale: string;
  slug: QuizSlug;
  /** Pre-fetched articles when opening with ?result= (optional) */
  recommendedArticles?: RecommendedArticle[];
}

export default function QuizEngine({ quiz, locale, slug, recommendedArticles: initialRecommendedArticles = [] }: QuizEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResultVariant | null>(null);
  const [totalScore, setTotalScore] = useState<number | undefined>(undefined);
  const [finalAnswers, setFinalAnswers] = useState<Record<string, string>>({});
  const [recommendedArticles, setRecommendedArticles] = useState<RecommendedArticle[]>(initialRecommendedArticles);
  const [explanationExpanded, setExplanationExpanded] = useState(false);
  const { buildPath, categories } = useCategories();

  const isPt = locale === 'pt-BR';
  const question = quiz.questions[currentIndex] as QuizQuestion | undefined;
  const progress = quiz.questions.length ? ((currentIndex + 1) / quiz.questions.length) * 100 : 0;

  useEffect(() => {
    setExplanationExpanded(false);
  }, [currentIndex]);

  const setAnswer = useCallback(
    (questionId: string, optionId: string) => {
      const nextAnswers = { ...answers, [questionId]: optionId };
      setAnswers(nextAnswers);
      if (currentIndex < quiz.questions.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        const computed = computeQuizResult(slug, nextAnswers);
        setResult(computed.result);
        setTotalScore(computed.totalScore);
        setFinalAnswers(nextAnswers);
      }
    },
    [currentIndex, quiz.questions.length, slug, answers]
  );

  useEffect(() => {
    if (!result || initialRecommendedArticles.length > 0) return;
    const slugs = result.recommendedArticleSlugs?.filter(Boolean) ?? [];
    if (slugs.length > 0) {
      Promise.all(slugs.slice(0, 4).map((s) => getArticleBySlug(s, locale))).then((fetched) => {
        const mapped: RecommendedArticle[] = fetched
          .filter((a): a is NonNullable<typeof a> => a != null)
          .map((a: any) => {
            const slugUse = locale === 'pt-BR' ? (a.slugPt ?? a.slug) : (a.slugEn ?? a.slug);
            let url = `/${locale}/articles/${slugUse}`;
            if (a.category) {
              const fullCategory = categories.find((c: any) => c.id === a.category?.id);
              if (fullCategory) {
                try {
                  const categoryPath = buildPath(fullCategory, locale);
                  if (categoryPath) url = `/${locale}/${categoryPath}/${slugUse}`;
                } catch {
                  const catSlug = locale === 'pt-BR' ? (a.category.slugPt || a.category.slug) : (a.category.slugEn || a.category.slug);
                  if (catSlug) url = `/${locale}/${catSlug}/${slugUse}`;
                }
              }
            }
            return { title: a.title, excerpt: a.excerpt, url };
          });
        setRecommendedArticles(mapped);
      });
    } else {
      getLatestArticles(3, locale).then((articles) => {
        const mapped: RecommendedArticle[] = (articles || []).slice(0, 3).map((a: any) => {
          const slugUse = locale === 'pt-BR' ? (a.slugPt ?? a.slug) : (a.slugEn ?? a.slug);
          let url = `/${locale}/articles/${slugUse}`;
          if (a.category) {
            const fullCategory = categories.find((c: any) => c.id === a.category?.id);
            if (fullCategory) {
              try {
                const categoryPath = buildPath(fullCategory, locale);
                if (categoryPath) url = `/${locale}/${categoryPath}/${slugUse}`;
              } catch {
                const catSlug = locale === 'pt-BR' ? (a.category.slugPt || a.category.slug) : (a.category.slugEn || a.category.slug);
                if (catSlug) url = `/${locale}/${catSlug}/${slugUse}`;
              }
            }
          }
          return { title: a.title, excerpt: a.excerpt, url };
        });
        setRecommendedArticles(mapped);
      });
    }
  }, [result, locale, initialRecommendedArticles.length, buildPath, categories]);

  const goBack = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }, [currentIndex]);

  if (result) {
    const keyFactors = getKeyFactorsForResult(slug, result.id, finalAnswers);
    const articlesToShow = recommendedArticles.length > 0 ? recommendedArticles : initialRecommendedArticles;
    return (
      <QuizResult
        result={result}
        quizSlug={slug}
        quizTitle={isPt ? quiz.title : (quiz.titleEn ?? quiz.title)}
        locale={locale}
        totalScore={totalScore}
        keyFactors={keyFactors}
        quizDisclaimer={quiz.disclaimer}
        quizDisclaimerEn={quiz.disclaimerEn}
        recommendedArticles={articlesToShow}
      />
    );
  }

  if (!question) {
    return null;
  }

  const questionText = isPt ? question.question : (question.questionEn ?? question.question);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-slate-400 mb-2">
          <span>
            {isPt ? 'Pergunta' : 'Question'} {currentIndex + 1} {isPt ? 'de' : 'of'} {quiz.questions.length}
          </span>
          <span>~{quiz.estimatedMinutes} min</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{questionText}</h2>

      {/* Saiba mais / Why this matters (EEAT) */}
      {(question.explanationShort ?? question.explanationShortEn) && (
        <div className="mb-6">
          <button
            type="button"
            onClick={() => setExplanationExpanded((e) => !e)}
            className="inline-flex items-center gap-2 text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors"
            aria-expanded={explanationExpanded}
          >
            {isPt ? 'Saiba mais' : 'Why this matters'}
            <svg
              className={`w-4 h-4 transition-transform ${explanationExpanded ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {explanationExpanded && (
            <p className="mt-2 p-4 rounded-xl bg-slate-800/50 border border-slate-600/30 text-slate-300 text-sm leading-relaxed">
              {isPt ? question.explanationShort : (question.explanationShortEn ?? question.explanationShort)}
            </p>
          )}
        </div>
      )}

      {/* Options */}
      <ul className="space-y-3">
        {question.options.map((opt: QuizOption) => {
          const label = isPt ? opt.label : (opt.labelEn ?? opt.label);
          return (
            <li key={opt.id}>
              <button
                type="button"
                onClick={() => setAnswer(question.id, opt.id)}
                className="w-full text-left px-6 py-4 rounded-xl bg-white/5 border border-white/10 hover:border-teal-500/50 hover:bg-white/10 transition-all duration-200 text-white font-medium"
              >
                {label}
              </button>
            </li>
          );
        })}
      </ul>

      {/* Back */}
      {currentIndex > 0 && (
        <div className="mt-8">
          <button
            type="button"
            onClick={goBack}
            className="text-slate-400 hover:text-white text-sm font-medium inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {isPt ? 'Voltar' : 'Back'}
          </button>
        </div>
      )}
    </div>
  );
}
