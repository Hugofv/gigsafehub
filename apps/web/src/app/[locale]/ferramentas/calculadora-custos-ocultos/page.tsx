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

  if (locale === 'en-US') {
    redirect('/en-US/tools/hidden-costs-calculator');
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gigsafehub.com';
  const canonicalUrl = `${baseUrl}/${locale}/ferramentas/calculadora-custos-ocultos`;

  return {
    title: 'Calculadora de Custos Ocultos | Descubra Gastos que Você Ignora',
    description: 'Calculadora gratuita para descobrir custos ocultos como depreciação do veículo, desgaste de pneus, óleo, freios e outros. Entenda suas verdadeiras despesas como motorista de aplicativo.',
    keywords: [
      'custos ocultos uber',
      'depreciação carro uber',
      'custos invisíveis motorista',
      'desgaste veículo 99',
      'manutenção carro aplicativo',
      'despesas escondidas ifood',
      'calculadora depreciação',
      'custo real por km',
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
      title: 'Calculadora de Custos Ocultos para Motoristas | GigSafeHub',
      description: 'Descubra custos que você pode estar ignorando: depreciação, desgaste, manutenção preventiva e mais. Ferramenta gratuita.',
      type: 'website',
      url: canonicalUrl,
      siteName: 'GigSafeHub',
      locale: 'pt_BR',
      images: [
        {
          url: `${baseUrl}/og-custos-ocultos.png`,
          width: 1200,
          height: 630,
          alt: 'Calculadora de Custos Ocultos - GigSafeHub',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Calculadora de Custos Ocultos | GigSafeHub',
      description: 'Descubra custos que você pode estar ignorando como motorista de aplicativo.',
      images: [`${baseUrl}/og-custos-ocultos.png`],
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

export default async function CalculadoraCustosOcultosPage({ params }: PageProps) {
  const { locale } = await params;

  if (locale === 'en-US') {
    redirect('/en-US/tools/hidden-costs-calculator');
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gigsafehub.com';
  const pageUrl = `${baseUrl}/${locale}/ferramentas/calculadora-custos-ocultos`;

  const breadcrumbItems = [
    { name: 'Início', url: `${baseUrl}/${locale}` },
    { name: 'Ferramentas', url: `${baseUrl}/${locale}/ferramentas` },
    { name: 'Calculadora de Custos Ocultos', url: pageUrl },
  ];

  const toolData = {
    name: 'Calculadora de Custos Ocultos',
    description: 'Calculadora gratuita para descobrir custos ocultos como depreciação, desgaste de pneus, óleo e freios do seu veículo.',
    url: pageUrl,
    locale,
    applicationCategory: 'FinanceApplication',
  };

  const howToData = {
    name: 'Como usar a Calculadora de Custos Ocultos',
    description: 'Descubra os custos invisíveis do seu trabalho',
    steps: [
      { name: 'Informe dados do veículo', text: 'Digite o valor e a idade do seu veículo.' },
      { name: 'Adicione sua quilometragem', text: 'Informe quantos km você roda por mês.' },
      { name: 'Inclua custos fixos', text: 'Adicione celular, seguro, plano de saúde se tiver.' },
      { name: 'Veja seus custos reais', text: 'Descubra quanto custa cada km rodado incluindo desgaste.' },
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
