import { Metadata } from 'next';
import CostPerTripCalculator from '@/components/tools/CostPerTripCalculator';
import { generateToolStructuredData, generateHowToStructuredData } from '@/components/StructuredData';

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Cost per Trip Calculator | How Much Each Ride Costs';
  const description = 'Find out how much each trip costs and if it\'s worth accepting. Calculate fuel, wear, platform fees and discover your real profit per trip.';

  return {
    title,
    description,
    keywords: [
      'cost per trip',
      'uber calculator',
      'lyft calculator',
      'worth accepting ride',
      'driver trip cost',
      'profit per trip',
      'rideshare calculator',
      'how much uber trip costs',
      'fuel cost per ride',
      'break even point ride',
    ],
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_US',
    },
    alternates: {
      canonical: '/en-US/tools/cost-per-trip-calculator',
      languages: {
        'en-US': '/en-US/tools/cost-per-trip-calculator',
        'pt-BR': '/pt-BR/ferramentas/calculadora-custo-corrida',
      },
    },
  };
}

export default function CostPerTripCalculatorPage() {
  const toolStructuredData = generateToolStructuredData({
    name: 'Cost per Trip Calculator',
    description: 'Calculate how much each trip costs and find out if it\'s worth accepting. Includes fuel, vehicle wear and platform fees.',
    url: 'https://gigsafehub.com/en-US/tools/cost-per-trip-calculator',
    locale: 'en-US',
  });

  const howToStructuredData = generateHowToStructuredData({
    name: 'How to calculate cost per trip',
    description: 'Step by step to find out how much each trip costs and if it\'s worth accepting',
    steps: [
      { name: 'Enter the average distance of your trips in miles', text: 'Enter the average distance of your trips in miles' },
      { name: 'Enter your vehicle\'s fuel economy (MPG)', text: 'Enter your vehicle\'s fuel economy (MPG)' },
      { name: 'Enter the current fuel price', text: 'Enter the current fuel price' },
      { name: 'Enter the average fare you receive per trip', text: 'Enter the average fare you receive per trip' },
      { name: 'Enter the platform fee (usually 25%)', text: 'Enter the platform fee (usually 25%)' },
      { name: 'Click Calculate to see the real cost and if the trip is profitable', text: 'Click Calculate to see the real cost and if the trip is profitable' },
    ],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToStructuredData) }}
      />
      <CostPerTripCalculator locale="en-US" />
    </>
  );
}

