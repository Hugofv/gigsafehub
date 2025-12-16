import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import DailyProfitCalculator from '@/components/tools/DailyProfitCalculator';

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  // Redirect English users to the correct URL
  if (locale === 'en-US') {
    redirect('/en-US/tools/daily-profit-calculator');
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gigsafehub.com';
  const canonicalUrl = `${baseUrl}/${locale}/ferramentas/calculadora-lucro-diario`;

  return {
    title: 'Calculadora de Lucro Real Diário | Descubra Quanto Você Realmente Ganha',
    description: 'Calculadora gratuita para autônomos e motoristas de aplicativo. Descubra seu lucro real por hora após descontar combustível, manutenção, taxas e outros custos.',
    keywords: ['calculadora lucro diário', 'ganho real uber', 'lucro motorista aplicativo', 'quanto ganha uber', 'calculadora ifood', 'lucro autônomo'],
    openGraph: {
      title: 'Calculadora de Lucro Real Diário | GigSafeHub',
      description: 'Descubra quanto você realmente ganha por hora após todas as despesas. Ferramenta gratuita para motoristas de aplicativo e autônomos.',
      type: 'website',
      url: canonicalUrl,
      siteName: 'GigSafeHub',
      locale: 'pt_BR',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Calculadora de Lucro Real Diário | GigSafeHub',
      description: 'Descubra quanto você realmente ganha por hora após todas as despesas.',
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en-US': `${baseUrl}/en-US/tools/daily-profit-calculator`,
        'pt-BR': `${baseUrl}/pt-BR/ferramentas/calculadora-lucro-diario`,
      },
    },
  };
}

export default async function CalculadoraLucroDiarioPage({ params }: PageProps) {
  const { locale } = await params;

  // Redirect English users to the correct URL
  if (locale === 'en-US') {
    redirect('/en-US/tools/daily-profit-calculator');
  }

  return <DailyProfitCalculator locale={locale} />;
}

