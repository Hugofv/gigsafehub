import { Metadata } from 'next';
import CostPerTripCalculator from '@/components/tools/CostPerTripCalculator';
import { generateToolStructuredData, generateHowToStructuredData } from '@/components/StructuredData';

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Calculadora de Custo por Corrida | Quanto Custa Cada Viagem';
  const description = 'Descubra quanto custa cada corrida e se vale a pena aceitar. Calcule combustível, desgaste, taxa da plataforma e descubra seu lucro real por viagem.';

  return {
    title,
    description,
    keywords: [
      'custo por corrida',
      'calculadora uber',
      'calculadora 99',
      'vale a pena aceitar corrida',
      'custo viagem motorista',
      'lucro por corrida',
      'calculadora motorista app',
      'quanto custa corrida uber',
      'custo combustível corrida',
      'ponto de equilíbrio corrida',
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
      canonical: '/pt-BR/ferramentas/calculadora-custo-corrida',
      languages: {
        'en-US': '/en-US/tools/cost-per-trip-calculator',
        'pt-BR': '/pt-BR/ferramentas/calculadora-custo-corrida',
      },
    },
  };
}

export default function CostPerTripCalculatorPage() {
  const toolStructuredData = generateToolStructuredData({
    name: 'Calculadora de Custo por Corrida',
    description: 'Calcule quanto custa cada corrida e descubra se vale a pena aceitar. Inclui combustível, desgaste do veículo e taxas da plataforma.',
    url: 'https://gigsafehub.com/pt-BR/ferramentas/calculadora-custo-corrida',
    locale: 'pt-BR',
  });

  const howToStructuredData = generateHowToStructuredData({
    name: 'Como calcular o custo por corrida',
    description: 'Passo a passo para descobrir quanto custa cada corrida e se vale a pena aceitar',
    steps: [
      { name: 'Informe a distância média das suas corridas em km', text: 'Informe a distância média das suas corridas em km' },
      { name: 'Digite o consumo do seu veículo (km/l)', text: 'Digite o consumo do seu veículo (km/l)' },
      { name: 'Informe o preço atual do combustível', text: 'Informe o preço atual do combustível' },
      { name: 'Digite o valor médio que você recebe por corrida', text: 'Digite o valor médio que você recebe por corrida' },
      { name: 'Informe a taxa da plataforma (geralmente 25%)', text: 'Informe a taxa da plataforma (geralmente 25%)' },
      { name: 'Clique em Calcular para ver o custo real e se a corrida é lucrativa', text: 'Clique em Calcular para ver o custo real e se a corrida é lucrativa' },
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
      <CostPerTripCalculator locale="pt-BR" />
    </>
  );
}

