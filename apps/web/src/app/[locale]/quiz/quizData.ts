/**
 * Re-export quiz data from lib/ to avoid Webpack issues with [locale] in path.
 * All imports should use @/lib/quizData.
 */
export {
  getQuizBySlug,
  getQuizResultById,
  computeQuizResult,
  getKeyFactorsForResult,
  quizList,
  type QuizSlug,
  type QuizOption,
  type QuizQuestion,
  type KeyFactor,
  type QuizResultCta,
  type QuizResultVariant,
  type QuizDefinition,
} from '@/lib/quizData';
