import { Metadata } from 'next';
import FuelCalculator from '@/components/tools/FuelCalculator';
import { generateToolStructuredData, generateHowToStructuredData } from '@/components/StructuredData';

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Fuel Calculator | Gas vs Ethanol Comparison';
  const description = 'Calculate your monthly fuel expenses and find out if gasoline or ethanol is better for you. Compare prices and save money.';

  return {
    title,
    description,
    keywords: [
      'fuel calculator',
      'gas or ethanol',
      'compare fuel',
      'monthly fuel cost',
      'fuel savings',
      'gas calculator',
      'ethanol calculator',
      'cost per mile',
      'uber fuel expenses',
      'how much gas per month',
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
      canonical: '/en-US/tools/fuel-calculator',
      languages: {
        'en-US': '/en-US/tools/fuel-calculator',
        'pt-BR': '/pt-BR/ferramentas/calculadora-combustivel',
      },
    },
  };
}

export default function FuelCalculatorPage() {
  const toolStructuredData = generateToolStructuredData({
    name: 'Fuel Calculator',
    description: 'Calculate fuel expenses and compare gas vs ethanol to find out which is more economical for you.',
    url: 'https://gigsafehub.com/en-US/tools/fuel-calculator',
    locale: 'en-US',
  });

  const howToStructuredData = generateHowToStructuredData({
    name: 'How to calculate fuel expenses',
    description: 'Step by step to calculate monthly fuel expenses and compare gas vs ethanol',
    steps: [
      { name: 'Enter how many miles you drive per month', text: 'Enter how many miles you drive per month' },
      { name: 'Enter your vehicle\'s fuel economy with gasoline (MPG)', text: 'Enter your vehicle\'s fuel economy with gasoline (MPG)' },
      { name: 'Enter the current gas price', text: 'Enter the current gas price' },
      { name: 'Optionally, enter the ethanol price to compare', text: 'Optionally, enter the ethanol price to compare' },
      { name: 'If you know, enter the ethanol fuel economy (usually 70% of gasoline)', text: 'If you know, enter the ethanol fuel economy (usually 70% of gasoline)' },
      { name: 'Click Calculate to see monthly expenses and recommendation', text: 'Click Calculate to see monthly expenses and recommendation' },
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
      <FuelCalculator locale="en-US" />
    </>
  );
}

