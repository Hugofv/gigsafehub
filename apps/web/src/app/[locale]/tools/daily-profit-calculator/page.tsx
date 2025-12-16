import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import DailyProfitCalculator from '@/components/tools/DailyProfitCalculator';
import StructuredData, {
  generateBreadcrumbStructuredData,
  generateToolStructuredData,
  generateHowToStructuredData
} from '@/components/StructuredData';

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
    title: 'Daily Real Profit Calculator | Discover Your True Hourly Earnings',
    description: 'Free calculator for Uber, Lyft, DoorDash drivers and gig workers. Discover your real hourly profit after deducting fuel, maintenance, platform fees, and other costs.',
    keywords: [
      'daily profit calculator',
      'uber earnings calculator',
      'lyft profit calculator',
      'rideshare real earnings',
      'doordash profit',
      'gig worker calculator',
      'delivery driver profit',
      'true hourly rate',
    ],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: 'Daily Real Profit Calculator for Drivers | GigSafeHub',
      description: 'Discover how much you really earn per hour after all expenses. Free tool for Uber, Lyft, DoorDash drivers and gig workers.',
      type: 'website',
      url: canonicalUrl,
      siteName: 'GigSafeHub',
      locale: 'en_US',
      images: [
        {
          url: `${baseUrl}/og-daily-profit-calculator.png`,
          width: 1200,
          height: 630,
          alt: 'Daily Real Profit Calculator - GigSafeHub',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Daily Real Profit Calculator | GigSafeHub',
      description: 'Discover how much you really earn per hour after all expenses.',
      images: [`${baseUrl}/og-daily-profit-calculator.png`],
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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gigsafehub.com';
  const pageUrl = `${baseUrl}/${locale}/tools/daily-profit-calculator`;

  const breadcrumbItems = [
    { name: 'Home', url: `${baseUrl}/${locale}` },
    { name: 'Tools', url: `${baseUrl}/${locale}/tools` },
    { name: 'Daily Profit Calculator', url: pageUrl },
  ];

  const toolData = {
    name: 'Daily Real Profit Calculator',
    description: 'Free calculator to discover your real hourly profit after deducting all expenses like fuel, maintenance and fees.',
    url: pageUrl,
    locale,
    applicationCategory: 'FinanceApplication',
  };

  const howToData = {
    name: 'How to Use the Daily Profit Calculator',
    description: 'Learn how to calculate your real profit in a few steps',
    steps: [
      { name: 'Enter your gross earnings', text: 'Type how much you earned gross for the day.' },
      { name: 'Add your hours worked', text: 'Enter how many hours you worked.' },
      { name: 'List your costs', text: 'Include fuel, maintenance, fees and other expenses.' },
      { name: 'See your real profit', text: 'Discover how much you really earned per hour.' },
    ],
    totalTime: 'PT3M',
  };

  return (
    <>
      <StructuredData data={generateBreadcrumbStructuredData(breadcrumbItems)} />
      <StructuredData data={generateToolStructuredData(toolData)} />
      <StructuredData data={generateHowToStructuredData(howToData)} />
      <DailyProfitCalculator locale={locale} />
    </>
  );
}

export const dynamic = 'force-dynamic';
