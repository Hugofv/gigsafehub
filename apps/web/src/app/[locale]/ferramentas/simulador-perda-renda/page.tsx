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

  // Redirect English users to the correct URL
  if (locale === 'en-US') {
    redirect('/en-US/tools/loss-income-simulator');
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gigsafehub.com';
  const canonicalUrl = `${baseUrl}/${locale}/ferramentas/simulador-perda-renda`;

  return {
    title: 'Simulador de Perda de Renda | Calcule Quanto Você Perderia Sem Trabalhar',
    description: 'Calculadora gratuita para motoristas de aplicativo e autônomos. Simule quanto de renda você perderia se ficasse sem trabalhar por doença, acidente ou imprevisto. Planeje sua proteção financeira.',
    keywords: [
      'calculadora perda de renda',
      'simulador renda autônomo',
      'quanto perco sem trabalhar',
      'seguro motorista aplicativo',
      'proteção renda uber',
      'seguro invalidez autônomo',
      'calcular perda financeira',
      'simulador seguro renda',
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
      title: 'Simulador de Perda de Renda para Autônomos | GigSafeHub',
      description: 'Descubra quanto de renda você perderia se ficasse sem trabalhar. Ferramenta gratuita para motoristas de Uber, 99, iFood e outros aplicativos.',
      type: 'website',
      url: canonicalUrl,
      siteName: 'GigSafeHub',
      locale: 'pt_BR',
      images: [
        {
          url: `${baseUrl}/og-simulador-perda-renda.png`,
          width: 1200,
          height: 630,
          alt: 'Simulador de Perda de Renda - GigSafeHub',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Simulador de Perda de Renda | GigSafeHub',
      description: 'Calcule quanto de renda você perderia sem seguro adequado. Ferramenta gratuita.',
      images: [`${baseUrl}/og-simulador-perda-renda.png`],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en-US': `${baseUrl}/en-US/tools/loss-income-simulator`,
        'pt-BR': `${baseUrl}/pt-BR/ferramentas/simulador-perda-renda`,
      },
    },
  };
}

export default async function SimuladorPerdaRendaPage({ params }: PageProps) {
  const { locale } = await params;

  // Redirect English users to the correct URL
  if (locale === 'en-US') {
    redirect('/en-US/tools/loss-income-simulator');
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gigsafehub.com';
  const pageUrl = `${baseUrl}/${locale}/ferramentas/simulador-perda-renda`;

  const breadcrumbItems = [
    { name: 'Início', url: `${baseUrl}/${locale}` },
    { name: 'Ferramentas', url: `${baseUrl}/${locale}/ferramentas` },
    { name: 'Simulador de Perda de Renda', url: pageUrl },
  ];

  const toolData = {
    name: 'Simulador de Perda de Renda',
    description: 'Calculadora gratuita para simular quanto de renda você perderia se ficasse sem trabalhar. Ideal para motoristas de aplicativo, entregadores e autônomos.',
    url: pageUrl,
    locale,
    applicationCategory: 'FinanceApplication',
  };

  const howToData = {
    name: 'Como usar o Simulador de Perda de Renda',
    description: 'Aprenda a calcular sua potencial perda de renda em poucos passos',
    steps: [
      { name: 'Informe sua renda mensal', text: 'Digite quanto você ganha em média por mês trabalhando.' },
      { name: 'Selecione o período de afastamento', text: 'Escolha por quantos dias você ficaria sem trabalhar no cenário simulado.' },
      { name: 'Veja o resultado', text: 'Analise quanto de renda você perderia e considere opções de proteção.' },
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
