import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';

interface PageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;

  if (locale === 'en-US') {
    redirect('/en-US/tools');
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gigsafehub.com';
  const canonicalUrl = `${baseUrl}/${locale}/ferramentas`;

  return {
    title: 'Ferramentas Gratuitas para Motoristas de App e Autônomos | GigSafeHub',
    description: 'Calculadoras e ferramentas 100% gratuitas para motoristas de Uber, 99 e iFood. Calcule lucro real, custos ocultos, meta mensal e muito mais. Ajudamos você a entender seus ganhos e tomar melhores decisões financeiras.',
    keywords: [
      'ferramentas motorista aplicativo',
      'calculadora uber',
      'calculadora 99',
      'calculadora ifood',
      'lucro real motorista',
      'custos ocultos uber',
      'quanto ganha motorista uber',
      'calculadora freelancer',
      'calculadora autônomo',
      'ferramentas gratuitas motorista',
      'planejamento financeiro motorista',
      'simulador renda motorista',
      'custo por corrida',
      'ponto de equilíbrio motorista',
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
      title: 'Ferramentas Gratuitas para Motoristas de App e Autônomos | GigSafeHub',
      description: 'Calculadoras e ferramentas 100% gratuitas para motoristas de Uber, 99 e iFood. Descubra quanto você realmente ganha!',
      type: 'website',
      url: canonicalUrl,
      siteName: 'GigSafeHub',
      locale: 'pt_BR',
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'en-US': `${baseUrl}/en-US/tools`,
        'pt-BR': `${baseUrl}/pt-BR/ferramentas`,
      },
    },
  };
}

// Tool data for structured data and relationships
const tools = [
  {
    id: 'simulador-perda-renda',
    name: 'Simulador de Perda de Renda',
    description: 'Calcule quanto de renda você poderia perder sem seguro adequado.',
    related: ['calculadora-lucro-diario', 'calculadora-ponto-equilibrio'],
  },
  {
    id: 'calculadora-lucro-diario',
    name: 'Calculadora de Lucro Real Diário',
    description: 'Descubra quanto você realmente ganha por hora após todos os custos.',
    related: ['calculadora-custos-ocultos', 'calculadora-custo-corrida'],
  },
  {
    id: 'simulador-meta-mensal',
    name: 'Simulador de Meta Mensal',
    description: 'Defina sua meta e descubra quantas horas e corridas precisa.',
    related: ['calculadora-lucro-diario', 'simulador-orcamento'],
  },
  {
    id: 'calculadora-custos-ocultos',
    name: 'Calculadora de Custos Ocultos',
    description: 'Descubra custos invisíveis como depreciação e desgaste.',
    related: ['calculadora-custo-corrida', 'calculadora-combustivel'],
  },
  {
    id: 'calculadora-custo-corrida',
    name: 'Calculadora de Custo por Corrida',
    description: 'Quanto custa cada corrida? Descubra se vale a pena aceitar.',
    related: ['calculadora-combustivel', 'calculadora-lucro-diario'],
  },
  {
    id: 'calculadora-combustivel',
    name: 'Calculadora de Combustível',
    description: 'Compare gasolina vs etanol e economize no abastecimento.',
    related: ['calculadora-custo-corrida', 'calculadora-custos-ocultos'],
  },
  {
    id: 'calculadora-ponto-equilibrio',
    name: 'Calculadora de Ponto de Equilíbrio',
    description: 'Descubra quanto precisa faturar para cobrir todos os custos.',
    related: ['simulador-orcamento', 'calculadora-lucro-diario'],
  },
  {
    id: 'simulador-orcamento',
    name: 'Simulador de Orçamento Completo',
    description: 'Monte seu orçamento completo com todos os custos.',
    related: ['calculadora-ponto-equilibrio', 'simulador-meta-mensal'],
  },
];

export default async function FerramentasPage({ params }: PageProps) {
  const { locale } = await params;

  if (locale === 'en-US') {
    redirect('/en-US/tools');
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gigsafehub.com';

  // ItemList structured data for the tool collection
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Ferramentas Gratuitas para Motoristas de App',
    description: 'Coleção de calculadoras e ferramentas gratuitas para motoristas de Uber, 99, iFood e outros aplicativos.',
    numberOfItems: tools.length,
    itemListElement: tools.map((tool, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: tool.name,
      description: tool.description,
      url: `${baseUrl}/${locale}/ferramentas/${tool.id}`,
    })),
  };

  // BreadcrumbList structured data
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Início',
        item: `${baseUrl}/${locale}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Ferramentas',
        item: `${baseUrl}/${locale}/ferramentas`,
      },
    ],
  };

  // FAQ structured data
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'As ferramentas são realmente gratuitas?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Sim, todas as nossas calculadoras e ferramentas são 100% gratuitas. Não pedimos cadastro, não coletamos dados pessoais e você pode usar quantas vezes quiser.',
        },
      },
      {
        '@type': 'Question',
        name: 'Para quem são essas ferramentas?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'As ferramentas foram criadas para motoristas de aplicativo (Uber, 99, iFood, Rappi), entregadores, freelancers e qualquer trabalhador autônomo que queira entender melhor seus ganhos e custos.',
        },
      },
      {
        '@type': 'Question',
        name: 'Como calcular meu lucro real como motorista de Uber?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Use nossa Calculadora de Lucro Real Diário. Informe seu faturamento bruto, custos com combustível, manutenção e taxas. A ferramenta calcula automaticamente seu lucro real por hora de trabalho.',
        },
      },
      {
        '@type': 'Question',
        name: 'Quais custos os motoristas de app costumam esquecer?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Os custos mais esquecidos são: depreciação do veículo, desgaste de pneus, troca de óleo, pastilhas de freio, seguro do carro e plano de saúde. Use nossa Calculadora de Custos Ocultos para descobrir todos.',
        },
      },
      {
        '@type': 'Question',
        name: 'Como saber se vale a pena aceitar uma corrida?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Use nossa Calculadora de Custo por Corrida. Informe a distância, seu consumo de combustível e o valor da corrida. A ferramenta mostra se a corrida é lucrativa ou se você terá prejuízo.',
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-navy-900">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm mb-8" aria-label="Breadcrumb">
          <Link href={`/${locale}`} className="text-slate-400 hover:text-white transition-colors">
            Início
          </Link>
          <span className="text-slate-600" aria-hidden="true">/</span>
          <span className="text-white font-medium" aria-current="page">Ferramentas</span>
        </nav>

        {/* Header */}
        <header className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-500/20 text-teal-400 text-sm font-medium mb-6">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            100% Gratuitas
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
            Ferramentas Gratuitas para{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-orange-400">
              Motoristas de App
            </span>
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed mb-8">
            Criamos ferramentas práticas para ajudar motoristas de Uber, 99, iFood e outros aplicativos a entender seus ganhos reais, descobrir custos ocultos e tomar decisões financeiras mais inteligentes.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            <span className="px-3 py-1.5 bg-white/10 rounded-full text-slate-300">
              <svg className="w-4 h-4 inline mr-1.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Sem cadastro
            </span>
            <span className="px-3 py-1.5 bg-white/10 rounded-full text-slate-300">
              <svg className="w-4 h-4 inline mr-1.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              100% gratuitas
            </span>
            <span className="px-3 py-1.5 bg-white/10 rounded-full text-slate-300">
              <svg className="w-4 h-4 inline mr-1.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Resultados instantâneos
            </span>
          </div>
        </header>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Loss Income Simulator Card */}
          <Link
            href={`/${locale}/ferramentas/simulador-perda-renda`}
            className="group relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 hover:border-orange-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-orange-500/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center mb-6 shadow-lg shadow-orange-500/30">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">
                Simulador de Perda de Renda
              </h2>
              <p className="text-slate-400 mb-6">
                Calcule quanto de renda você poderia perder sem uma cobertura de seguro adequada. Veja o custo real de ficar sem seguro.
              </p>
              <div className="flex items-center text-orange-400 font-semibold">
                Experimentar Agora
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Daily Profit Calculator Card */}
          <Link
            href={`/${locale}/ferramentas/calculadora-lucro-diario`}
            className="group relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 hover:border-emerald-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-500/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
                Calculadora de Lucro Real Diário
              </h2>
              <p className="text-slate-400 mb-6">
                Descubra quanto você realmente ganha por hora após descontar combustível, manutenção, taxas e outros custos.
              </p>
              <div className="flex items-center text-emerald-400 font-semibold">
                Experimentar Agora
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Monthly Goal Simulator Card */}
          <Link
            href={`/${locale}/ferramentas/simulador-meta-mensal`}
            className="group relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 hover:border-purple-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-violet-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-purple-400 transition-colors">
                Simulador de Meta Mensal
              </h2>
              <p className="text-slate-400 mb-6">
                Defina sua meta de renda e descubra quantas horas, dias e corridas você precisa para alcançá-la.
              </p>
              <div className="flex items-center text-purple-400 font-semibold">
                Experimentar Agora
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Hidden Costs Calculator Card */}
          <Link
            href={`/${locale}/ferramentas/calculadora-custos-ocultos`}
            className="group relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 hover:border-rose-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-rose-500/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 to-pink-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center mb-6 shadow-lg shadow-rose-500/30">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-rose-400 transition-colors">
                Calculadora de Custos Ocultos
              </h2>
              <p className="text-slate-400 mb-6">
                Descubra custos ocultos como depreciação, manutenção e desgaste que você pode estar ignorando.
              </p>
              <div className="flex items-center text-rose-400 font-semibold">
                Experimentar Agora
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Cost per Trip Calculator Card */}
          <Link
            href={`/${locale}/ferramentas/calculadora-custo-corrida`}
            className="group relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 hover:border-cyan-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-cyan-500/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-teal-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/30">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                Calculadora de Custo por Corrida
              </h2>
              <p className="text-slate-400 mb-6">
                Quanto custa cada corrida? Descubra se vale a pena aceitar baseado em combustível, desgaste e taxas.
              </p>
              <div className="flex items-center text-cyan-400 font-semibold">
                Experimentar Agora
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Fuel Calculator Card */}
          <Link
            href={`/${locale}/ferramentas/calculadora-combustivel`}
            className="group relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 hover:border-amber-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-500/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-6 shadow-lg shadow-amber-500/30">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors">
                Calculadora de Combustível
              </h2>
              <p className="text-slate-400 mb-6">
                Compare gasolina vs etanol e descubra qual combustível é mais econômico para você.
              </p>
              <div className="flex items-center text-amber-400 font-semibold">
                Experimentar Agora
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Break-Even Calculator Card */}
          <Link
            href={`/${locale}/ferramentas/calculadora-ponto-equilibrio`}
            className="group relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 hover:border-blue-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                Calculadora de Ponto de Equilíbrio
              </h2>
              <p className="text-slate-400 mb-6">
                Quanto você precisa faturar para cobrir todos os custos? Descubra seu ponto de equilíbrio.
              </p>
              <div className="flex items-center text-blue-400 font-semibold">
                Experimentar Agora
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Driver Budget Simulator Card */}
          <Link
            href={`/${locale}/ferramentas/simulador-orcamento`}
            className="group relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 hover:border-violet-500/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-violet-500/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mb-6 shadow-lg shadow-violet-500/30">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-violet-400 transition-colors">
                Simulador de Orçamento Completo
              </h2>
              <p className="text-slate-400 mb-6">
                Monte seu orçamento completo: custos fixos, variáveis e pessoais. Saiba quanto precisa faturar.
              </p>
              <div className="flex items-center text-violet-400 font-semibold">
                Experimentar Agora
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Tool Relationships Section */}
        <section className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ferramentas que combinam entre si
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Use nossas ferramentas em conjunto para ter uma visão completa da sua situação financeira como motorista de app.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Relationship 1 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Se você usou a Calculadora de Lucro Diário...</h3>
                  <p className="text-slate-400 text-sm mb-3">
                    Também vai gostar da Calculadora de Custos Ocultos para descobrir gastos que você pode estar esquecendo.
                  </p>
                  <Link
                    href={`/${locale}/ferramentas/calculadora-custos-ocultos`}
                    className="inline-flex items-center text-emerald-400 text-sm font-medium hover:text-emerald-300 transition-colors"
                  >
                    Experimentar agora
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Relationship 2 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Se você usou o Simulador de Meta Mensal...</h3>
                  <p className="text-slate-400 text-sm mb-3">
                    Complete sua análise com o Simulador de Orçamento para saber exatamente quanto precisa faturar.
                  </p>
                  <Link
                    href={`/${locale}/ferramentas/simulador-orcamento`}
                    className="inline-flex items-center text-purple-400 text-sm font-medium hover:text-purple-300 transition-colors"
                  >
                    Experimentar agora
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Relationship 3 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Se você usou a Calculadora de Custo por Corrida...</h3>
                  <p className="text-slate-400 text-sm mb-3">
                    A Calculadora de Combustível vai te ajudar a economizar ainda mais em cada viagem.
                  </p>
                  <Link
                    href={`/${locale}/ferramentas/calculadora-combustivel`}
                    className="inline-flex items-center text-cyan-400 text-sm font-medium hover:text-cyan-300 transition-colors"
                  >
                    Experimentar agora
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Relationship 4 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Se você usou a Calculadora de Ponto de Equilíbrio...</h3>
                  <p className="text-slate-400 text-sm mb-3">
                    O Simulador de Perda de Renda mostra quanto você pode perder se ficar sem trabalhar.
                  </p>
                  <Link
                    href={`/${locale}/ferramentas/simulador-perda-renda`}
                    className="inline-flex items-center text-blue-400 text-sm font-medium hover:text-blue-300 transition-colors"
                  >
                    Experimentar agora
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Tire suas dúvidas sobre nossas ferramentas e como elas podem ajudar você.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            <details className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="text-white font-semibold pr-4">As ferramentas são realmente gratuitas?</h3>
                <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-6 text-slate-300">
                Sim, todas as nossas calculadoras e ferramentas são 100% gratuitas. Não pedimos cadastro, não coletamos dados pessoais e você pode usar quantas vezes quiser. Nossa missão é ajudar motoristas de aplicativo a terem mais clareza sobre suas finanças.
              </div>
            </details>

            <details className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="text-white font-semibold pr-4">Para quem são essas ferramentas?</h3>
                <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-6 text-slate-300">
                As ferramentas foram criadas para motoristas de aplicativo (Uber, 99, iFood, Rappi), entregadores, freelancers e qualquer trabalhador autônomo que queira entender melhor seus ganhos e custos. Se você trabalha por conta própria, essas calculadoras são para você.
              </div>
            </details>

            <details className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="text-white font-semibold pr-4">Como calcular meu lucro real como motorista de Uber?</h3>
                <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-6 text-slate-300">
                Use nossa <Link href={`/${locale}/ferramentas/calculadora-lucro-diario`} className="text-emerald-400 hover:underline">Calculadora de Lucro Real Diário</Link>. Informe seu faturamento bruto, custos com combustível, manutenção e taxas. A ferramenta calcula automaticamente seu lucro real por hora de trabalho, permitindo que você saiba exatamente quanto está ganhando.
              </div>
            </details>

            <details className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="text-white font-semibold pr-4">Quais custos os motoristas de app costumam esquecer?</h3>
                <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-6 text-slate-300">
                Os custos mais esquecidos são: depreciação do veículo (seu carro perde valor a cada km rodado), desgaste de pneus, troca de óleo, pastilhas de freio, seguro do carro e plano de saúde. Use nossa <Link href={`/${locale}/ferramentas/calculadora-custos-ocultos`} className="text-rose-400 hover:underline">Calculadora de Custos Ocultos</Link> para descobrir todos esses gastos invisíveis.
              </div>
            </details>

            <details className="group bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
              <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                <h3 className="text-white font-semibold pr-4">Como saber se vale a pena aceitar uma corrida?</h3>
                <svg className="w-5 h-5 text-slate-400 group-open:rotate-180 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className="px-6 pb-6 text-slate-300">
                Use nossa <Link href={`/${locale}/ferramentas/calculadora-custo-corrida`} className="text-cyan-400 hover:underline">Calculadora de Custo por Corrida</Link>. Informe a distância, seu consumo de combustível e o valor da corrida. A ferramenta mostra se a corrida é lucrativa ou se você terá prejuízo, ajudando você a tomar decisões mais inteligentes.
              </div>
            </details>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mt-20 text-center">
          <div className="bg-gradient-to-r from-teal-500/20 to-orange-500/20 backdrop-blur-sm rounded-3xl border border-white/10 p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Comece a usar agora mesmo
            </h2>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
              Escolha uma ferramenta e descubra informações valiosas sobre seus ganhos em menos de 2 minutos. Sem cadastro, sem complicação.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={`/${locale}/ferramentas/calculadora-lucro-diario`}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                Calcular meu lucro real
              </Link>
              <Link
                href={`/${locale}/ferramentas/calculadora-custos-ocultos`}
                className="px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
              >
                Descobrir custos ocultos
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

