import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import MonthlyGoalSimulator from '@/components/tools/MonthlyGoalSimulator';
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

  if (locale === 'pt-BR') {
    redirect('/pt-BR/ferramentas/simulador-meta-mensal');
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gigsafehub.com';
  // Always use production base URL for canonical to ensure consistency
  const productionBaseUrl = 'https://gigsafehub.com';
  const canonicalUrl = `${productionBaseUrl}/${locale}/tools/monthly-goal-simulator`;

  return {
    title: 'Monthly Goal Simulator | Plan Your Earnings as a Driver',
    description: 'Free calculator to plan your monthly income goal. Discover how many hours, days and trips you need to reach your financial objectives as a rideshare driver or gig worker.',
    keywords: [
      'monthly goal calculator',
      'uber earnings planner',
      'lyft income goal',
      'rideshare income planning',
      'gig worker goal calculator',
      'how much to work uber',
      'delivery driver goals',
      'weekly income target',
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
      title: 'Monthly Goal Simulator for Drivers | GigSafeHub',
      description: 'Plan how to reach your monthly income goal. Free tool for Uber, Lyft, DoorDash drivers and gig workers.',
      type: 'website',
      url: canonicalUrl,
      siteName: 'GigSafeHub',
      locale: 'en_US',
      images: [
        {
          url: `${productionBaseUrl}/og-monthly-goal-simulator.png`,
          width: 1200,
          height: 630,
          alt: 'Monthly Goal Simulator - GigSafeHub',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Monthly Goal Simulator | GigSafeHub',
      description: 'Plan how to reach your monthly income goal as a rideshare driver.',
      images: [`${productionBaseUrl}/og-monthly-goal-simulator.png`],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en-US': `${productionBaseUrl}/en-US/tools/monthly-goal-simulator`,
        'pt-BR': `${productionBaseUrl}/pt-BR/ferramentas/simulador-meta-mensal`,
      },
    },
  };
}

export default async function MonthlyGoalSimulatorPage({ params }: PageProps) {
  const { locale } = await params;

  if (locale === 'pt-BR') {
    redirect('/pt-BR/ferramentas/simulador-meta-mensal');
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gigsafehub.com';
  const pageUrl = `${baseUrl}/${locale}/tools/monthly-goal-simulator`;

  const breadcrumbItems = [
    { name: 'Home', url: `${baseUrl}/${locale}` },
    { name: 'Tools', url: `${baseUrl}/${locale}/tools` },
    { name: 'Monthly Goal Simulator', url: pageUrl },
  ];

  const toolData = {
    name: 'Monthly Goal Simulator',
    description: 'Free calculator to plan your monthly income goal and discover how many hours and trips you need.',
    url: pageUrl,
    locale,
    applicationCategory: 'FinanceApplication',
  };

  const howToData = {
    name: 'How to Use the Monthly Goal Simulator',
    description: 'Learn how to plan your income goals',
    steps: [
      { name: 'Set your monthly goal', text: 'Type how much you want to earn per month.' },
      { name: 'Enter your average per trip', text: 'Add how much you earn on average per trip or delivery.' },
      { name: 'Set your availability', text: 'Enter how many hours per day and days per week you can work.' },
      { name: 'Get your plan', text: 'See how many trips, hours and days you need to hit your goal.' },
    ],
    totalTime: 'PT2M',
  };

  return (
    <>
      <StructuredData data={generateBreadcrumbStructuredData(breadcrumbItems)} />
      <StructuredData data={generateToolStructuredData(toolData)} />
      <StructuredData data={generateHowToStructuredData(howToData)} />
      <MonthlyGoalSimulator locale={locale} />
    </>
  );
}

export const dynamic = 'force-dynamic';
