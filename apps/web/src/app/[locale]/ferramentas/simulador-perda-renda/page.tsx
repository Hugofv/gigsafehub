import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import LossIncomeSimulator from '@/components/tools/LossIncomeSimulator';

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  // Redirect English users to the correct URL
  if (locale === 'en-US') {
    redirect('/en-US/tools/loss-income-simulator');
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gigsafehub.com';
  const canonicalUrl = `${baseUrl}/${locale}/ferramentas/simulador-perda-renda`;

  return {
    title: 'Simulador de Perda de Renda | Calcule Seu Risco',
    description: 'Calculadora gratuita para estimar quanto de renda você poderia perder se não puder trabalhar. Planeje-se e proteja seus ganhos com uma cobertura de seguro adequada.',
    keywords: ['calculadora perda de renda', 'seguro autônomo', 'proteção freelancer', 'calculadora proteção de renda', 'seguro invalidez', 'motorista aplicativo'],
    openGraph: {
      title: 'Simulador de Perda de Renda | GigSafeHub',
      description: 'Calcule quanto de renda você poderia perder sem seguro adequado. Ferramenta gratuita para autônomos, motoristas de aplicativo e freelancers.',
      type: 'website',
      url: canonicalUrl,
      siteName: 'GigSafeHub',
      locale: 'pt_BR',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Simulador de Perda de Renda | GigSafeHub',
      description: 'Calcule quanto de renda você poderia perder sem seguro adequado.',
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en-US': `${baseUrl}/en-US/tools/loss-income-simulator`,
        'pt-BR': `${baseUrl}/pt-BR/ferramentas/simulador-perda-renda`,
      },
    },
  };
}

export default async function SimuladorPerdaRendaPage({ params }: PageProps) {
  const { locale } = await params;

  // Redirect English users to the correct URL
  if (locale === 'en-US') {
    redirect('/en-US/tools/loss-income-simulator');
  }

  return <LossIncomeSimulator locale={locale} />;
}

