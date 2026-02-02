import { ImageResponse } from 'next/og';
import { getQuizBySlug, getQuizResultById } from '@/lib/quizData';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');
  const resultId = searchParams.get('result');
  const locale = searchParams.get('locale') || 'pt-BR';

  const quiz = slug ? getQuizBySlug(slug) : null;
  const result = slug && resultId ? getQuizResultById(slug, resultId) : null;

  const title = result
    ? (locale === 'pt-BR' ? result.title : (result.titleEn ?? result.title))
    : quiz
      ? (locale === 'pt-BR' ? quiz.title : (quiz.titleEn ?? quiz.title))
      : 'Quiz | GigSafeHub';

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          fontFamily: 'system-ui, sans-serif',
          padding: 48,
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              color: '#2dd4bf',
              fontSize: 24,
              fontWeight: 600,
            }}
          >
            <span>GigSafeHub</span>
          </div>
          <h1
            style={{
              color: 'white',
              fontSize: 56,
              fontWeight: 800,
              lineHeight: 1.2,
              margin: 0,
              maxWidth: 1000,
            }}
          >
            {title}
          </h1>
        </div>
        <p
          style={{
            color: '#94a3b8',
            fontSize: 28,
            margin: 0,
          }}
        >
          gigsafehub.com
        </p>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
