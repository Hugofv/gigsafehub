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

  // Redirect Portuguese users to the correct URL
  if (locale === 'pt-BR') {
    redirect('/pt-BR/ferramentas/simulador-perda-renda');
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gigsafehub.com';
  const canonicalUrl = `${baseUrl}/${locale}/tools/loss-income-simulator`;

  return {
    title: 'Loss Income Simulator | Calculate Your Risk',
    description: 'Free calculator to estimate how much income you could lose if you\'re unable to work. Plan ahead and protect your earnings with proper insurance coverage.',
    keywords: ['income loss calculator', 'gig worker insurance', 'freelancer protection', 'income protection calculator', 'disability insurance calculator'],
    openGraph: {
      title: 'Loss Income Simulator | GigSafeHub',
      description: 'Calculate how much income you could lose without proper insurance. Free tool for gig workers and freelancers.',
      type: 'website',
      url: canonicalUrl,
      siteName: 'GigSafeHub',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Loss Income Simulator | GigSafeHub',
      description: 'Calculate how much income you could lose without proper insurance.',
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

export default async function LossIncomeSimulatorPage({ params }: PageProps) {
  const { locale } = await params;

  // Redirect Portuguese users to the correct URL
  if (locale === 'pt-BR') {
    redirect('/pt-BR/ferramentas/simulador-perda-renda');
  }

  return <LossIncomeSimulator locale={locale} />;
}

