import { Metadata } from 'next';
import Link from 'next/link';
import { quizList } from '@/lib/quizData';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isPt = locale === 'pt-BR';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gigsafehub.com';
  const title = isPt
    ? 'Quizzes | Risco de Burnout e Proposta de Valor Única | GigSafeHub'
    : 'Quizzes | Burnout Risk and Unique Value Proposition | GigSafeHub';
  const description = isPt
    ? 'Quizzes gratuitos para freelancers e gig workers: calculador de risco de burnout e identificador de proposta de valor única. Descubra em poucos minutos.'
    : 'Free quizzes for freelancers and gig workers: burnout risk calculator and unique value proposition identifier. Discover in minutes.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/${locale}/quiz`,
      siteName: 'GigSafeHub',
      locale: isPt ? 'pt_BR' : 'en_US',
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/quiz`,
    },
    robots: { index: true, follow: true },
  };
}

export default async function QuizListPage({ params }: PageProps) {
  const { locale } = await params;
  const isPt = locale === 'pt-BR';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-navy-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <nav className="flex items-center space-x-2 text-sm mb-8" aria-label="Breadcrumb">
          <Link href={`/${locale}`} className="text-slate-400 hover:text-white transition-colors">
            {isPt ? 'Início' : 'Home'}
          </Link>
          <span className="text-slate-600" aria-hidden="true">/</span>
          <span className="text-white font-medium" aria-current="page">
            {isPt ? 'Quizzes' : 'Quizzes'}
          </span>
        </nav>

        <header className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-500/20 text-teal-400 text-sm font-medium mb-6">
            ~3 min
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {isPt ? 'Quizzes com valor real' : 'Quizzes with real value'}
          </h1>
          <p className="text-lg text-slate-300">
            {isPt
              ? 'Descubra seu risco de burnout ou sua proposta de valor única — para freelancers e gig workers.'
              : 'Discover your burnout risk or your unique value proposition — for freelancers and gig workers.'}
          </p>
        </header>

        <ul className="space-y-6">
          {quizList.map((quiz) => {
            const title = isPt ? quiz.title : (quiz.titleEn ?? quiz.title);
            const description = isPt ? quiz.description : (quiz.descriptionEn ?? quiz.description);
            return (
              <li key={quiz.slug}>
                <Link
                  href={`/${locale}/quiz/${quiz.slug}`}
                  className="block rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 hover:border-teal-500/50 hover:bg-white/10 transition-all duration-300"
                >
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-2">{title}</h2>
                  <p className="text-slate-400">{description}</p>
                  <span className="inline-flex items-center gap-2 mt-4 text-teal-400 font-semibold text-sm">
                    {isPt ? 'Fazer quiz' : 'Take quiz'}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
