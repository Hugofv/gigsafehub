import { Metadata } from 'next';
import InsuranceComparator from '@/components/comparator/InsuranceComparator';
import { generateToolStructuredData, generateHowToStructuredData } from '@/components/StructuredData';

export async function generateMetadata(): Promise<Metadata> {
  const title = 'Comparar Cotações de Seguro para Motoristas de App | GigSafeHub';
  const description = 'Compare cotações reais de seguro das melhores seguradoras em minutos. Feito para motoristas de app e entregadores. Encontre a melhor cobertura pelo melhor preço.';

  return {
    title,
    description,
    keywords: [
      'seguro motorista de app',
      'comparar seguro uber',
      'seguro 99',
      'seguro entregador',
      'cotação seguro auto',
      'seguro barato motorista',
      'comparador de seguro',
      'seguro gig economy',
    ],
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'pt_BR',
    },
    alternates: {
      canonical: '/pt-BR/ferramentas/comparador-seguro',
      languages: {
        'en-US': '/en-US/tools/insurance-comparator',
        'pt-BR': '/pt-BR/ferramentas/comparador-seguro',
        'x-default': '/en-US/tools/insurance-comparator',
      },
    },
  };
}

export default function ComparadorSeguroPage() {
  const toolStructuredData = generateToolStructuredData({
    name: 'Comparador de Seguro para Motoristas de App',
    description: 'Compare cotações reais de seguro de várias seguradoras. Feito para motoristas de app e entregadores.',
    url: 'https://gigsafehub.com/pt-BR/ferramentas/comparador-seguro',
    locale: 'pt-BR',
  });

  const howToStructuredData = generateHowToStructuredData({
    name: 'Como comparar cotações de seguro para motoristas de app',
    description: 'Passo a passo para comparar cotações de seguro e encontrar a melhor taxa',
    steps: [
      { name: 'Selecione seu país e tipo de trabalho', text: 'Escolha sua localização e se você faz transporte, entregas ou ambos' },
      { name: 'Insira suas informações pessoais', text: 'Forneça seu nome, contato e endereço' },
      { name: 'Adicione os detalhes do seu veículo', text: 'Informe ano, marca, modelo e uso do veículo' },
      { name: 'Complete seu perfil de direção', text: 'Compartilhe seu histórico de direção e perfil de trabalho' },
      { name: 'Defina suas preferências de cobertura', text: 'Escolha seus limites de responsabilidade e franquia' },
      { name: 'Compare cotações das melhores seguradoras', text: 'Revise e compare cotações reais lado a lado' },
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
      <InsuranceComparator locale="pt-BR" />
    </>
  );
}
