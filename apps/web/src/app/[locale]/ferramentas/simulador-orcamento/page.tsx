import { Metadata } from 'next';
import DriverBudgetSimulator from '@/components/tools/DriverBudgetSimulator';
import { generateToolStructuredData, generateHowToStructuredData } from '@/components/StructuredData';

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Simulador de Orçamento do Motorista | Planejamento Financeiro Completo';
  const description = 'Monte seu orçamento completo como motorista de app. Inclua todos os custos fixos, variáveis e pessoais e descubra quanto precisa faturar para sobreviver.';

  return {
    title,
    description,
    keywords: [
      'orçamento motorista app',
      'planejamento financeiro uber',
      'custos motorista 99',
      'despesas mensais motorista',
      'quanto ganhar uber',
      'simulador orçamento',
      'gastos motorista aplicativo',
      'planejamento uber',
      'finanças motorista',
      'quanto preciso ganhar motorista',
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
      canonical: '/pt-BR/ferramentas/simulador-orcamento',
      languages: {
        'en-US': '/en-US/tools/driver-budget-simulator',
        'pt-BR': '/pt-BR/ferramentas/simulador-orcamento',
      },
    },
  };
}

export default function DriverBudgetSimulatorPage() {
  const toolStructuredData = generateToolStructuredData({
    name: 'Simulador de Orçamento do Motorista',
    description: 'Ferramenta completa para montar seu orçamento como motorista de app. Inclui custos do veículo, pessoais e de trabalho.',
    url: 'https://gigsafehub.com/pt-BR/ferramentas/simulador-orcamento',
    locale: 'pt-BR',
  });

  const howToStructuredData = generateHowToStructuredData({
    name: 'Como montar seu orçamento de motorista',
    description: 'Passo a passo para criar um orçamento completo e saber quanto precisa faturar',
    steps: [
      { name: 'Informe os custos do veículo (IPVA, licenciamento, seguro)', text: 'Informe os custos do veículo (IPVA, licenciamento, seguro)' },
      { name: 'Adicione seus custos pessoais (saúde, moradia, contas, alimentação)', text: 'Adicione seus custos pessoais (saúde, moradia, contas, alimentação)' },
      { name: 'Informe os custos do trabalho (celular, assinaturas)', text: 'Informe os custos do trabalho (celular, assinaturas)' },
      { name: 'Digite os dados de km rodados, consumo e preço do combustível', text: 'Digite os dados de km rodados, consumo e preço do combustível' },
      { name: 'Informe seu faturamento médio diário e taxa da plataforma', text: 'Informe seu faturamento médio diário e taxa da plataforma' },
      { name: 'Clique em Simular para ver seu orçamento completo', text: 'Clique em Simular para ver seu orçamento completo' },
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
      <DriverBudgetSimulator locale="pt-BR" />
    </>
  );
}

