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

  // Redirect Portuguese users to the correct URL
  if (locale === 'pt-BR') {
    redirect('/pt-BR/ferramentas/calculadora-lucro-diario');
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gigsafehub.com';
  const canonicalUrl = `${baseUrl}/${locale}/tools/daily-profit-calculator`;

  return {
    title: 'Daily Real Profit Calculator | Discover Your True Earnings',
    description: 'Free calculator for gig workers and rideshare drivers. Discover your real hourly profit after deducting fuel, maintenance, fees, and other costs.',
    keywords: ['daily profit calculator', 'real uber earnings', 'rideshare profit', 'how much uber makes', 'gig worker calculator', 'delivery driver profit'],
    openGraph: {
      title: 'Daily Real Profit Calculator | GigSafeHub',
      description: 'Discover how much you really earn per hour after all expenses. Free tool for rideshare drivers and gig workers.',
      type: 'website',
      url: canonicalUrl,
      siteName: 'GigSafeHub',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Daily Real Profit Calculator | GigSafeHub',
      description: 'Discover how much you really earn per hour after all expenses.',
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

export default async function DailyProfitCalculatorPage({ params }: PageProps) {
  const { locale } = await params;

  // Redirect Portuguese users to the correct URL
  if (locale === 'pt-BR') {
    redirect('/pt-BR/ferramentas/calculadora-lucro-diario');
  }

  return <DailyProfitCalculator locale={locale} />;
}

