import { Metadata } from 'next';
import DriverBudgetSimulator from '@/components/tools/DriverBudgetSimulator';
import { generateToolStructuredData, generateHowToStructuredData } from '@/components/StructuredData';

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Driver Budget Simulator | Complete Financial Planning';
  const description = 'Build your complete budget as a rideshare driver. Include all fixed, variable and personal costs and find out how much you need to earn to survive.';

  return {
    title,
    description,
    keywords: [
      'driver budget',
      'uber financial planning',
      'lyft driver costs',
      'monthly driver expenses',
      'how much earn uber',
      'budget simulator',
      'rideshare driver expenses',
      'uber planning',
      'driver finances',
      'how much need earn driver',
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
      canonical: '/en-US/tools/driver-budget-simulator',
      languages: {
        'en-US': '/en-US/tools/driver-budget-simulator',
        'pt-BR': '/pt-BR/ferramentas/simulador-orcamento',
      },
    },
  };
}

export default function DriverBudgetSimulatorPage() {
  const toolStructuredData = generateToolStructuredData({
    name: 'Driver Budget Simulator',
    description: 'Complete tool to build your budget as a rideshare driver. Includes vehicle, personal and work costs.',
    url: 'https://gigsafehub.com/en-US/tools/driver-budget-simulator',
    locale: 'en-US',
  });

  const howToStructuredData = generateHowToStructuredData({
    name: 'How to build your driver budget',
    description: 'Step by step to create a complete budget and know how much you need to earn',
    steps: [
      { name: 'Enter vehicle costs (tax, registration, insurance)', text: 'Enter vehicle costs (tax, registration, insurance)' },
      { name: 'Add your personal costs (health, housing, utilities, food)', text: 'Add your personal costs (health, housing, utilities, food)' },
      { name: 'Enter work costs (phone, subscriptions)', text: 'Enter work costs (phone, subscriptions)' },
      { name: 'Enter miles driven, fuel economy and fuel price data', text: 'Enter miles driven, fuel economy and fuel price data' },
      { name: 'Enter your average daily revenue and platform fee', text: 'Enter your average daily revenue and platform fee' },
      { name: 'Click Simulate to see your complete budget', text: 'Click Simulate to see your complete budget' },
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
      <DriverBudgetSimulator locale="en-US" />
    </>
  );
}

