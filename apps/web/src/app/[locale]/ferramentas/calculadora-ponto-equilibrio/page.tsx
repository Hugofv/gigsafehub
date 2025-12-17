import { Metadata } from 'next';
import BreakEvenCalculator from '@/components/tools/BreakEvenCalculator';
import { generateToolStructuredData, generateHowToStructuredData } from '@/components/StructuredData';

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Calculadora de Ponto de Equilíbrio | Quanto Preciso Faturar';
  const description = 'Descubra quanto você precisa faturar para cobrir todos os seus custos. Calcule seu ponto de equilíbrio e saiba quando começa a lucrar.';

  return {
    title,
    description,
    keywords: [
      'ponto de equilíbrio',
      'break even motorista',
      'quanto preciso faturar',
      'custos fixos motorista',
      'faturamento mínimo uber',
      'calculadora break even',
      'quando começo lucrar',
      'custos motorista app',
      'faturamento motorista 99',
      'planejamento financeiro motorista',
    ],
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'pt_BR',
    },
    alternates: {
      canonical: '/pt-BR/ferramentas/calculadora-ponto-equilibrio',
      languages: {
        'en-US': '/en-US/tools/break-even-calculator',
        'pt-BR': '/pt-BR/ferramentas/calculadora-ponto-equilibrio',
      },
    },
  };
}

export default function BreakEvenCalculatorPage() {
  const toolStructuredData = generateToolStructuredData({
    name: 'Calculadora de Ponto de Equilíbrio',
    description: 'Calcule quanto precisa faturar para cobrir todos os custos e descobrir quando começa a ter lucro real.',
    url: 'https://gigsafehub.com/pt-BR/ferramentas/calculadora-ponto-equilibrio',
    locale: 'pt-BR',
  });

  const howToStructuredData = generateHowToStructuredData({
    name: 'Como calcular seu ponto de equilíbrio',
    description: 'Passo a passo para descobrir quanto precisa faturar para cobrir seus custos',
    steps: [
      { name: 'Informe seus custos fixos anuais (IPVA, licenciamento)', text: 'Informe seus custos fixos anuais (IPVA, licenciamento)' },
      { name: 'Informe seus custos fixos mensais (seguro, plano de saúde, celular)', text: 'Informe seus custos fixos mensais (seguro, plano de saúde, celular)' },
      { name: 'Digite quantos km você roda por mês', text: 'Digite quantos km você roda por mês' },
      { name: 'Informe o custo de combustível por km', text: 'Informe o custo de combustível por km' },
      { name: 'Digite o valor médio das suas corridas', text: 'Digite o valor médio das suas corridas' },
      { name: 'Informe a taxa da plataforma', text: 'Informe a taxa da plataforma' },
      { name: 'Clique em Calcular para ver seu ponto de equilíbrio', text: 'Clique em Calcular para ver seu ponto de equilíbrio' },
    ],
    totalTime: 'PT3M',
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
      <BreakEvenCalculator locale="pt-BR" />
    </>
  );
}

