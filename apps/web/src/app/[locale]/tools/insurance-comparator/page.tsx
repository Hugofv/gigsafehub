import { Metadata } from 'next';
import InsuranceComparator from '@/components/comparator/InsuranceComparator';
import { generateToolStructuredData, generateHowToStructuredData } from '@/components/StructuredData';

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Compare Insurance Quotes for Gig Workers | GigSafeHub';
  const description = 'Compare real insurance quotes from top providers in minutes. Built specifically for rideshare and delivery drivers. Find the best coverage at the best price.';

  return {
    title,
    description,
    keywords: [
      'gig worker insurance',
      'rideshare insurance comparison',
      'uber driver insurance',
      'lyft driver insurance',
      'delivery driver insurance',
      'compare insurance quotes',
      'cheap rideshare insurance',
      'gig economy insurance',
    ],
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'en_US',
    },
    alternates: {
      canonical: '/en-US/tools/insurance-comparator',
      languages: {
        'en-US': '/en-US/tools/insurance-comparator',
        'pt-BR': '/pt-BR/ferramentas/comparador-seguro',
        'x-default': '/en-US/tools/insurance-comparator',
      },
    },
  };
}

export default function InsuranceComparatorPage() {
  const toolStructuredData = generateToolStructuredData({
    name: 'Insurance Comparator for Gig Workers',
    description: 'Compare real insurance quotes from multiple providers. Built for rideshare and delivery drivers.',
    url: 'https://gigsafehub.com/en-US/tools/insurance-comparator',
    locale: 'en-US',
  });

  const howToStructuredData = generateHowToStructuredData({
    name: 'How to compare insurance quotes for gig workers',
    description: 'Step by step to compare insurance quotes and find the best rate',
    steps: [
      { name: 'Select your country and gig type', text: 'Choose your location and whether you do rideshare, delivery, or both' },
      { name: 'Enter your personal information', text: 'Provide your name, contact info, and address' },
      { name: 'Add your vehicle details', text: 'Enter your vehicle year, make, model, and usage' },
      { name: 'Complete your driving profile', text: 'Share your driving history and work profile' },
      { name: 'Set your coverage preferences', text: 'Choose your desired liability limits and deductible' },
      { name: 'Compare quotes from top providers', text: 'Review and compare real quotes side-by-side' },
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
      <InsuranceComparator locale="en-US" />
    </>
  );
}
