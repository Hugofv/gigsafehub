import { Metadata } from 'next';
import FuelCalculator from '@/components/tools/FuelCalculator';
import { generateToolStructuredData, generateHowToStructuredData } from '@/components/StructuredData';

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Calculadora de Combustível | Gasolina vs Etanol';
  const description = 'Calcule seus gastos mensais com combustível e descubra se vale mais a pena usar gasolina ou etanol. Compare preços e economize.';

  return {
    title,
    description,
    keywords: [
      'calculadora combustível',
      'gasolina ou etanol',
      'comparar combustível',
      'custo combustível mensal',
      'economia combustível',
      'calculadora gasolina',
      'calculadora etanol',
      'custo por km',
      'gasto combustível uber',
      'quanto gasto gasolina mês',
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
      canonical: '/pt-BR/ferramentas/calculadora-combustivel',
      languages: {
        'en-US': '/en-US/tools/fuel-calculator',
        'pt-BR': '/pt-BR/ferramentas/calculadora-combustivel',
      },
    },
  };
}

export default function FuelCalculatorPage() {
  const toolStructuredData = generateToolStructuredData({
    name: 'Calculadora de Combustível',
    description: 'Calcule gastos com combustível e compare gasolina vs etanol para descobrir qual é mais econômico para você.',
    url: 'https://gigsafehub.com/pt-BR/ferramentas/calculadora-combustivel',
    locale: 'pt-BR',
  });

  const howToStructuredData = generateHowToStructuredData({
    name: 'Como calcular gastos com combustível',
    description: 'Passo a passo para calcular gastos mensais com combustível e comparar gasolina vs etanol',
    steps: [
      { name: 'Informe quantos km você roda por mês', text: 'Informe quantos km você roda por mês' },
      { name: 'Digite o consumo do seu veículo com gasolina (km/l)', text: 'Digite o consumo do seu veículo com gasolina (km/l)' },
      { name: 'Informe o preço atual da gasolina', text: 'Informe o preço atual da gasolina' },
      { name: 'Opcionalmente, informe o preço do etanol para comparar', text: 'Opcionalmente, informe o preço do etanol para comparar' },
      { name: 'Se souber, informe o consumo com etanol (geralmente 70% da gasolina)', text: 'Se souber, informe o consumo com etanol (geralmente 70% da gasolina)' },
      { name: 'Clique em Calcular para ver o gasto mensal e a recomendação', text: 'Clique em Calcular para ver o gasto mensal e a recomendação' },
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
      <FuelCalculator locale="pt-BR" />
    </>
  );
}

