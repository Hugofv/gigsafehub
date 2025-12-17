import { Metadata } from 'next';
import BreakEvenCalculator from '@/components/tools/BreakEvenCalculator';
import { generateToolStructuredData, generateHowToStructuredData } from '@/components/StructuredData';

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Break-Even Calculator | How Much Revenue You Need';
  const description = 'Find out how much revenue you need to cover all your costs. Calculate your break-even point and know when you start making real profit.';

  return {
    title,
    description,
    keywords: [
      'break even point',
      'driver break even',
      'how much revenue needed',
      'fixed costs driver',
      'minimum revenue uber',
      'break even calculator',
      'when start profiting',
      'rideshare driver costs',
      'lyft minimum revenue',
      'driver financial planning',
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
      canonical: '/en-US/tools/break-even-calculator',
      languages: {
        'en-US': '/en-US/tools/break-even-calculator',
        'pt-BR': '/pt-BR/ferramentas/calculadora-ponto-equilibrio',
      },
    },
  };
}

export default function BreakEvenCalculatorPage() {
  const toolStructuredData = generateToolStructuredData({
    name: 'Break-Even Calculator',
    description: 'Calculate how much revenue you need to cover all costs and find out when you start making real profit.',
    url: 'https://gigsafehub.com/en-US/tools/break-even-calculator',
    locale: 'en-US',
  });

  const howToStructuredData = generateHowToStructuredData({
    name: 'How to calculate your break-even point',
    description: 'Step by step to find out how much revenue you need to cover your costs',
    steps: [
      { name: 'Enter your annual fixed costs (vehicle tax, registration)', text: 'Enter your annual fixed costs (vehicle tax, registration)' },
      { name: 'Enter your monthly fixed costs (insurance, health plan, phone)', text: 'Enter your monthly fixed costs (insurance, health plan, phone)' },
      { name: 'Enter how many miles you drive per month', text: 'Enter how many miles you drive per month' },
      { name: 'Enter the fuel cost per mile', text: 'Enter the fuel cost per mile' },
      { name: 'Enter your average trip fare', text: 'Enter your average trip fare' },
      { name: 'Enter the platform fee', text: 'Enter the platform fee' },
      { name: 'Click Calculate to see your break-even point', text: 'Click Calculate to see your break-even point' },
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
      <BreakEvenCalculator locale="en-US" />
    </>
  );
}

