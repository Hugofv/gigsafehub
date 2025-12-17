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
    title: 'Ferramentas Gratuitas para Autônomos e Freelancers',
    description: 'Calculadoras e ferramentas gratuitas para ajudar autônomos e freelancers a gerenciar suas finanças, estimar perda de renda e tomar decisões mais inteligentes sobre seguros e proteção.',
    keywords: ['ferramentas autônomo', 'calculadora freelancer', 'calculadora de renda', 'ferramentas de seguro', 'planejamento financeiro', 'motorista aplicativo'],
    openGraph: {
      title: 'Ferramentas Gratuitas para Autônomos | GigSafeHub',
      description: 'Calculadoras e ferramentas gratuitas projetadas para autônomos, freelancers e trabalhadores de aplicativo.',
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

export default async function FerramentasPage({ params }: PageProps) {
  const { locale } = await params;

  if (locale === 'en-US') {
    redirect('/en-US/tools');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-navy-900">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm mb-8">
          <Link href={`/${locale}`} className="text-slate-400 hover:text-white transition-colors">
            Início
          </Link>
          <span className="text-slate-600">/</span>
          <span className="text-white font-medium">Ferramentas</span>
        </nav>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-teal-500/20 text-teal-400 text-sm font-medium mb-6">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Ferramentas Gratuitas
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 tracking-tight">
            Ferramentas para <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-orange-400">Autônomos</span>
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed">
            Calculadoras e ferramentas gratuitas para ajudar motoristas de aplicativo, entregadores e freelancers a tomar decisões financeiras mais inteligentes.
          </p>
        </div>

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

      </div>
    </div>
  );
}

