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

  if (locale === 'en-US') {
    redirect('/en-US/tools/monthly-goal-simulator');
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gigsafehub.com';
  // Always use production base URL for canonical to ensure consistency
  const productionBaseUrl = 'https://gigsafehub.com';
  const canonicalUrl = `${productionBaseUrl}/${locale}/ferramentas/simulador-meta-mensal`;

  return {
    title: 'Simulador de Meta Mensal | Planeje Seus Ganhos como Motorista',
    description: 'Calculadora gratuita para planejar sua meta de renda mensal. Descubra quantas horas, dias e corridas você precisa para alcançar seus objetivos como motorista de aplicativo ou autônomo.',
    keywords: [
      'meta mensal uber',
      'planejamento renda motorista',
      'quanto preciso trabalhar uber',
      'meta ganhos 99',
      'calculadora metas ifood',
      'planejamento financeiro autônomo',
      'quantas corridas preciso fazer',
      'meta semanal motorista',
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
      title: 'Simulador de Meta Mensal para Motoristas | GigSafeHub',
      description: 'Planeje como alcançar sua meta de renda mensal. Ferramenta gratuita para motoristas de Uber, 99, iFood e outros aplicativos.',
      type: 'website',
      url: canonicalUrl,
      siteName: 'GigSafeHub',
      locale: 'pt_BR',
      images: [
        {
          url: `${productionBaseUrl}/og-simulador-meta.png`,
          width: 1200,
          height: 630,
          alt: 'Simulador de Meta Mensal - GigSafeHub',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Simulador de Meta Mensal | GigSafeHub',
      description: 'Planeje como alcançar sua meta de renda mensal como motorista de aplicativo.',
      images: [`${productionBaseUrl}/og-simulador-meta.png`],
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

export default async function SimuladorMetaMensalPage({ params }: PageProps) {
  const { locale } = await params;

  if (locale === 'en-US') {
    redirect('/en-US/tools/monthly-goal-simulator');
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gigsafehub.com';
  const pageUrl = `${baseUrl}/${locale}/ferramentas/simulador-meta-mensal`;

  const breadcrumbItems = [
    { name: 'Início', url: `${baseUrl}/${locale}` },
    { name: 'Ferramentas', url: `${baseUrl}/${locale}/ferramentas` },
    { name: 'Simulador de Meta Mensal', url: pageUrl },
  ];

  const toolData = {
    name: 'Simulador de Meta Mensal',
    description: 'Calculadora gratuita para planejar sua meta de renda mensal e descobrir quantas horas e corridas você precisa fazer.',
    url: pageUrl,
    locale,
    applicationCategory: 'FinanceApplication',
  };

  const howToData = {
    name: 'Como usar o Simulador de Meta Mensal',
    description: 'Aprenda a planejar suas metas de renda',
    steps: [
      { name: 'Defina sua meta mensal', text: 'Digite quanto você quer ganhar por mês.' },
      { name: 'Informe sua média por corrida', text: 'Adicione quanto você ganha em média por corrida ou entrega.' },
      { name: 'Configure sua disponibilidade', text: 'Informe quantas horas por dia e dias por semana você pode trabalhar.' },
      { name: 'Receba seu plano', text: 'Veja quantas corridas, horas e dias você precisa para bater sua meta.' },
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
