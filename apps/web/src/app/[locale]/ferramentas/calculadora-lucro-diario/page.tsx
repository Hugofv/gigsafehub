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

  // Redirect English users to the correct URL
  if (locale === 'en-US') {
    redirect('/en-US/tools/daily-profit-calculator');
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gigsafehub.com';
  const canonicalUrl = `${baseUrl}/${locale}/ferramentas/calculadora-lucro-diario`;

  return {
    title: 'Calculadora de Lucro Real Diário | Descubra Seu Ganho Real por Hora',
    description: 'Calculadora gratuita para motoristas de Uber, 99, iFood e autônomos. Descubra seu lucro real por hora após descontar combustível, manutenção, taxas de plataforma e outros custos.',
    keywords: [
      'calculadora lucro uber',
      'quanto ganha uber por hora',
      'lucro real motorista aplicativo',
      'calculadora 99',
      'ganho real ifood',
      'lucro líquido autônomo',
      'calculadora despesas uber',
      'quanto sobra uber',
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
      title: 'Calculadora de Lucro Real Diário para Motoristas | GigSafeHub',
      description: 'Descubra quanto você realmente ganha por hora após todas as despesas. Ferramenta gratuita para motoristas de Uber, 99, iFood e outros.',
      type: 'website',
      url: canonicalUrl,
      siteName: 'GigSafeHub',
      locale: 'pt_BR',
      images: [
        {
          url: `${baseUrl}/og-calculadora-lucro.png`,
          width: 1200,
          height: 630,
          alt: 'Calculadora de Lucro Real Diário - GigSafeHub',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Calculadora de Lucro Real Diário | GigSafeHub',
      description: 'Descubra quanto você realmente ganha por hora após todas as despesas.',
      images: [`${baseUrl}/og-calculadora-lucro.png`],
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

export default async function CalculadoraLucroDiarioPage({ params }: PageProps) {
  const { locale } = await params;

  // Redirect English users to the correct URL
  if (locale === 'en-US') {
    redirect('/en-US/tools/daily-profit-calculator');
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gigsafehub.com';
  const pageUrl = `${baseUrl}/${locale}/ferramentas/calculadora-lucro-diario`;

  const breadcrumbItems = [
    { name: 'Início', url: `${baseUrl}/${locale}` },
    { name: 'Ferramentas', url: `${baseUrl}/${locale}/ferramentas` },
    { name: 'Calculadora de Lucro Real', url: pageUrl },
  ];

  const toolData = {
    name: 'Calculadora de Lucro Real Diário',
    description: 'Calculadora gratuita para descobrir seu lucro real por hora após descontar todas as despesas como combustível, manutenção e taxas.',
    url: pageUrl,
    locale,
    applicationCategory: 'FinanceApplication',
  };

  const howToData = {
    name: 'Como usar a Calculadora de Lucro Real',
    description: 'Aprenda a calcular seu lucro real em poucos passos',
    steps: [
      { name: 'Informe seu faturamento bruto', text: 'Digite quanto você ganhou bruto no dia.' },
      { name: 'Adicione suas horas trabalhadas', text: 'Informe quantas horas você trabalhou.' },
      { name: 'Liste seus custos', text: 'Inclua combustível, manutenção, taxas e outros gastos.' },
      { name: 'Veja seu lucro real', text: 'Descubra quanto você realmente ganhou por hora.' },
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
