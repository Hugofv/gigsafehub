import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import LossIncomeSimulator from '@/components/tools/LossIncomeSimulator';
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
    redirect('/pt-BR/ferramentas/simulador-perda-renda');
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gigsafehub.com';
  // Always use production base URL for canonical to ensure consistency
  const productionBaseUrl = 'https://gigsafehub.com';
  const canonicalUrl = `${productionBaseUrl}/${locale}/tools/loss-income-simulator`;

  return {
    title: 'Loss Income Simulator | Calculate How Much You\'d Lose Without Working',
    description: 'Free calculator for rideshare drivers and gig workers. Simulate how much income you\'d lose if you couldn\'t work due to illness, accident, or emergency. Plan your financial protection.',
    keywords: [
      'income loss calculator',
      'gig worker insurance',
      'freelancer income protection',
      'rideshare driver insurance',
      'disability income calculator',
      'uber driver protection',
      'income replacement calculator',
      'self employed insurance',
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
      title: 'Loss Income Simulator for Gig Workers | GigSafeHub',
      description: 'Calculate how much income you\'d lose if you couldn\'t work. Free tool for Uber, Lyft, DoorDash drivers and freelancers.',
      type: 'website',
      url: canonicalUrl,
      siteName: 'GigSafeHub',
      locale: 'en_US',
      images: [
        {
          url: `${productionBaseUrl}/og-loss-income-simulator.png`,
          width: 1200,
          height: 630,
          alt: 'Loss Income Simulator - GigSafeHub',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Loss Income Simulator | GigSafeHub',
      description: 'Calculate how much income you\'d lose without proper protection. Free tool.',
      images: [`${productionBaseUrl}/og-loss-income-simulator.png`],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en-US': `${productionBaseUrl}/en-US/tools/loss-income-simulator`,
        'pt-BR': `${productionBaseUrl}/pt-BR/ferramentas/simulador-perda-renda`,
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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gigsafehub.com';
  const pageUrl = `${baseUrl}/${locale}/tools/loss-income-simulator`;

  const breadcrumbItems = [
    { name: 'Home', url: `${baseUrl}/${locale}` },
    { name: 'Tools', url: `${baseUrl}/${locale}/tools` },
    { name: 'Loss Income Simulator', url: pageUrl },
  ];

  const toolData = {
    name: 'Loss Income Simulator',
    description: 'Free calculator to simulate how much income you\'d lose if you couldn\'t work. Ideal for rideshare drivers, delivery workers and freelancers.',
    url: pageUrl,
    locale,
    applicationCategory: 'FinanceApplication',
  };

  const howToData = {
    name: 'How to Use the Loss Income Simulator',
    description: 'Learn how to calculate your potential income loss in a few steps',
    steps: [
      { name: 'Enter your monthly income', text: 'Type how much you earn on average per month.' },
      { name: 'Select the time off period', text: 'Choose how many days you\'d be unable to work in the simulated scenario.' },
      { name: 'See the result', text: 'Analyze how much income you\'d lose and consider protection options.' },
    ],
    totalTime: 'PT2M',
  };

  return (
    <>
      <StructuredData data={generateBreadcrumbStructuredData(breadcrumbItems)} />
      <StructuredData data={generateToolStructuredData(toolData)} />
      <StructuredData data={generateHowToStructuredData(howToData)} />
      <LossIncomeSimulator locale={locale} />
    </>
  );
}

export const dynamic = 'force-dynamic';
