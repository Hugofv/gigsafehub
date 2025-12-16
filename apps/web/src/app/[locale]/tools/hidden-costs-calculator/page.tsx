import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import HiddenCostsCalculator from '@/components/tools/HiddenCostsCalculator';
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
    redirect('/pt-BR/ferramentas/calculadora-custos-ocultos');
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gigsafehub.com';
  const canonicalUrl = `${baseUrl}/${locale}/tools/hidden-costs-calculator`;

  return {
    title: 'Hidden Costs Calculator | Discover Expenses You\'re Overlooking',
    description: 'Free calculator to discover hidden costs like vehicle depreciation, tire wear, oil changes, brakes and more. Understand your true expenses as a rideshare driver.',
    keywords: [
      'hidden costs uber',
      'car depreciation calculator',
      'rideshare hidden expenses',
      'vehicle wear calculator',
      'lyft maintenance costs',
      'doordash vehicle expenses',
      'depreciation per mile',
      'true cost per mile',
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
      title: 'Hidden Costs Calculator for Drivers | GigSafeHub',
      description: 'Discover costs you might be overlooking: depreciation, wear, preventive maintenance and more. Free tool.',
      type: 'website',
      url: canonicalUrl,
      siteName: 'GigSafeHub',
      locale: 'en_US',
      images: [
        {
          url: `${baseUrl}/og-hidden-costs-calculator.png`,
          width: 1200,
          height: 630,
          alt: 'Hidden Costs Calculator - GigSafeHub',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Hidden Costs Calculator | GigSafeHub',
      description: 'Discover costs you might be overlooking as a rideshare driver.',
      images: [`${baseUrl}/og-hidden-costs-calculator.png`],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en-US': `${baseUrl}/en-US/tools/hidden-costs-calculator`,
        'pt-BR': `${baseUrl}/pt-BR/ferramentas/calculadora-custos-ocultos`,
      },
    },
  };
}

export default async function HiddenCostsCalculatorPage({ params }: PageProps) {
  const { locale } = await params;

  if (locale === 'pt-BR') {
    redirect('/pt-BR/ferramentas/calculadora-custos-ocultos');
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gigsafehub.com';
  const pageUrl = `${baseUrl}/${locale}/tools/hidden-costs-calculator`;

  const breadcrumbItems = [
    { name: 'Home', url: `${baseUrl}/${locale}` },
    { name: 'Tools', url: `${baseUrl}/${locale}/tools` },
    { name: 'Hidden Costs Calculator', url: pageUrl },
  ];

  const toolData = {
    name: 'Hidden Costs Calculator',
    description: 'Free calculator to discover hidden costs like depreciation, tire wear, oil changes and brakes on your vehicle.',
    url: pageUrl,
    locale,
    applicationCategory: 'FinanceApplication',
  };

  const howToData = {
    name: 'How to Use the Hidden Costs Calculator',
    description: 'Discover the invisible costs of your work',
    steps: [
      { name: 'Enter vehicle information', text: 'Type the value and age of your vehicle.' },
      { name: 'Add your mileage', text: 'Enter how many miles you drive per month.' },
      { name: 'Include fixed costs', text: 'Add phone, insurance, health plan if applicable.' },
      { name: 'See your real costs', text: 'Discover how much each mile costs including wear.' },
    ],
    totalTime: 'PT3M',
  };

  return (
    <>
      <StructuredData data={generateBreadcrumbStructuredData(breadcrumbItems)} />
      <StructuredData data={generateToolStructuredData(toolData)} />
      <StructuredData data={generateHowToStructuredData(howToData)} />
      <HiddenCostsCalculator locale={locale} />
    </>
  );
}

export const dynamic = 'force-dynamic';
