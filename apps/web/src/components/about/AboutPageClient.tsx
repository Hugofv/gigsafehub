'use client';

import React from 'react';
import Link from 'next/link';
import { TRANSLATIONS } from '@/constants';

interface AboutPageClientProps {
  locale: string;
}

// Helper function to translate using a specific locale
const translate = (path: string, locale: string): string => {
  const keys = path.split('.');
  let value: any = TRANSLATIONS[locale as keyof typeof TRANSLATIONS];
  for (const key of keys) {
    if (value && value[key]) {
      value = value[key];
    } else {
      return path; // Fallback to key if not found
    }
  }
  return value as string;
};

export default function AboutPageClient({ locale }: AboutPageClientProps) {
  const t = (path: string) => translate(path, locale);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm">
            <Link href={`/${locale}`} className="text-slate-500 hover:text-brand-600 transition-colors">
              {t('common.home')}
            </Link>
            <span className="text-slate-400" aria-hidden="true">/</span>
            <span className="text-slate-900 font-medium" aria-current="page">
              {t('nav.about')}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {locale === 'pt-BR' ? 'Sobre Nós' : 'About Us'}
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            {locale === 'pt-BR' ? (
              <>
                Conheça a missão, o que fazemos e os valores que guiam o GigSafeHub — o hub de informação e comparação de seguros para a Gig Economy.
              </>
            ) : (
              <>
                Learn about the mission, what we do, and the values that guide GigSafeHub — the information and insurance comparison hub for the Gig Economy.
              </>
            )}
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 md:p-12">
          <div className="prose prose-lg max-w-none prose-slate [&_ul]:list-none">
            {/* Mission Section */}
            <section id="mission" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {locale === 'pt-BR' ? 'Nossa Missão' : 'Our Mission'}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    O GigSafeHub tem como missão capacitar e proteger trabalhadores da Gig Economy por meio de informação clara, comparações imparciais e recomendações práticas. Queremos reduzir a vulnerabilidade financeira de motoristas, entregadores, freelancers e nômades digitais oferecendo ferramentas que facilitem a escolha de seguros adequados e acessíveis.
                  </>
                ) : (
                  <>
                    GigSafeHub's mission is to empower and protect Gig Economy workers through clear information, impartial comparisons, and practical recommendations. We want to reduce the financial vulnerability of drivers, delivery workers, freelancers, and digital nomads by offering tools that facilitate the choice of adequate and accessible insurance.
                  </>
                )}
              </p>
              <p className="text-slate-700 leading-relaxed">
                {locale === 'pt-BR' ? (
                  <>
                    Nossa missão está alinhada ao propósito do projeto: centralizar e comparar ofertas, educar o público e conectar seguradoras e insurtechs a clientes qualificados.
                  </>
                ) : (
                  <>
                    Our mission is aligned with the project's purpose: to centralize and compare offers, educate the public, and connect insurers and insurtechs to qualified customers.
                  </>
                )}
              </p>
            </section>

            {/* What We Do Section */}
            <section id="what-we-do" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {locale === 'pt-BR' ? 'O que fazemos' : 'What We Do'}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    Criamos um ecossistema de produtos e conteúdo pensado para quem vive de trabalhos sob demanda. Entre nossas principais atividades estão:
                  </>
                ) : (
                  <>
                    We create an ecosystem of products and content designed for those who live on on-demand work. Among our main activities are:
                  </>
                )}
              </p>
              <ul className="text-slate-700 space-y-3 mb-4">
                <li className="pl-8">
                  <strong className="text-slate-900">
                    {locale === 'pt-BR' ? 'Comparador de seguros:' : 'Insurance comparator:'}
                  </strong>{' '}
                  {locale === 'pt-BR' ? (
                    'ferramentas que comparam apólices por cobertura, preço, assistência e reputação da seguradora.'
                  ) : (
                    'tools that compare policies by coverage, price, assistance, and insurer reputation.'
                  )}
                </li>
                <li className="pl-8">
                  <strong className="text-slate-900">
                    {locale === 'pt-BR' ? 'Conteúdo educativo:' : 'Educational content:'}
                  </strong>{' '}
                  {locale === 'pt-BR' ? (
                    'guias, artigos e checklists que ajudam o trabalhador a entender riscos e soluções.'
                  ) : (
                    'guides, articles, and checklists that help workers understand risks and solutions.'
                  )}
                </li>
                <li className="pl-8">
                  <strong className="text-slate-900">
                    {locale === 'pt-BR' ? 'Recomendações personalizadas:' : 'Personalized recommendations:'}
                  </strong>{' '}
                  {locale === 'pt-BR' ? (
                    'orientação para escolher a apólice ideal conforme perfil (quilometragem, veículo, dependência de renda).'
                  ) : (
                    'guidance to choose the ideal policy according to profile (mileage, vehicle, income dependency).'
                  )}
                </li>
                <li className="pl-8">
                  <strong className="text-slate-900">
                    {locale === 'pt-BR' ? 'Parcerias com seguradoras e insurtechs:' : 'Partnerships with insurers and insurtechs:'}
                  </strong>{' '}
                  {locale === 'pt-BR' ? (
                    'integração com produtos flexíveis e inovadores para oferecer opções mais adequadas à economia gig.'
                  ) : (
                    'integration with flexible and innovative products to offer options more suitable for the gig economy.'
                  )}
                </li>
                <li className="pl-8">
                  <strong className="text-slate-900">
                    {locale === 'pt-BR' ? 'Atendimento e suporte:' : 'Service and support:'}
                  </strong>{' '}
                  {locale === 'pt-BR' ? (
                    'ajuda para entender propostas, acionar assistência e abrir sinistros quando necessário.'
                  ) : (
                    'help to understand proposals, activate assistance, and file claims when necessary.'
                  )}
                </li>
              </ul>
            </section>

            {/* Our Values Section */}
            <section id="values" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {locale === 'pt-BR' ? 'Nossos Valores' : 'Our Values'}
              </h2>
              <ul className="text-slate-700 space-y-3">
                <li className="pl-8">
                  <strong className="text-slate-900">
                    {locale === 'pt-BR' ? 'Transparência' : 'Transparency'}
                  </strong>
                  {' — '}
                  {locale === 'pt-BR' ? (
                    'Análises claras, sem jargões e com critérios objetivos para comparação.'
                  ) : (
                    'Clear analyses, without jargon and with objective criteria for comparison.'
                  )}
                </li>
                <li className="pl-8">
                  <strong className="text-slate-900">
                    {locale === 'pt-BR' ? 'Independência' : 'Independence'}
                  </strong>
                  {' — '}
                  {locale === 'pt-BR' ? (
                    'Não somos influenciados por comissões; priorizamos a melhor solução para o usuário.'
                  ) : (
                    'We are not influenced by commissions; we prioritize the best solution for the user.'
                  )}
                </li>
                <li className="pl-8">
                  <strong className="text-slate-900">
                    {locale === 'pt-BR' ? 'Acessibilidade' : 'Accessibility'}
                  </strong>
                  {' — '}
                  {locale === 'pt-BR' ? (
                    'Produtos e linguagem pensados para serem compreendidos por qualquer trabalhador independente.'
                  ) : (
                    'Products and language designed to be understood by any independent worker.'
                  )}
                </li>
                <li className="pl-8">
                  <strong className="text-slate-900">
                    {locale === 'pt-BR' ? 'Praticidade' : 'Practicality'}
                  </strong>
                  {' — '}
                  {locale === 'pt-BR' ? (
                    'Soluções que economizam tempo e ajudam o usuário a tomar decisões rápidas e seguras.'
                  ) : (
                    'Solutions that save time and help users make quick and safe decisions.'
                  )}
                </li>
                <li className="pl-8">
                  <strong className="text-slate-900">
                    {locale === 'pt-BR' ? 'Foco no usuário' : 'User focus'}
                  </strong>
                  {' — '}
                  {locale === 'pt-BR' ? (
                    'Colocamos as necessidades reais dos gig workers no centro de tudo o que fazemos.'
                  ) : (
                    'We place the real needs of gig workers at the center of everything we do.'
                  )}
                </li>
                <li className="pl-8">
                  <strong className="text-slate-900">
                    {locale === 'pt-BR' ? 'Inovação' : 'Innovation'}
                  </strong>
                  {' — '}
                  {locale === 'pt-BR' ? (
                    'Buscamos produtos modernos (insurtechs) que tragam flexibilidade e menor custo.'
                  ) : (
                    'We seek modern products (insurtechs) that bring flexibility and lower cost.'
                  )}
                </li>
              </ul>
            </section>

            {/* How We Work Section */}
            <section id="how-we-work" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {locale === 'pt-BR' ? 'Como trabalhamos' : 'How We Work'}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    Nossa metodologia combina pesquisa de mercado, avaliação técnica e feedback dos próprios trabalhadores. Avaliamos produtos por:
                  </>
                ) : (
                  <>
                    Our methodology combines market research, technical evaluation, and feedback from workers themselves. We evaluate products by:
                  </>
                )}
              </p>
              <ul className="text-slate-700 space-y-2">
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Segurança e amplitude de cobertura' : 'Safety and coverage breadth'}
                </li>
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Preço e custo-benefício' : 'Price and cost-benefit'}
                </li>
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Qualidade da assistência 24h' : 'Quality of 24h assistance'}
                </li>
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Facilidade para abertura de sinistros' : 'Ease of filing claims'}
                </li>
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Transparência nos termos e franquias' : 'Transparency in terms and deductibles'}
                </li>
              </ul>
            </section>

            {/* Personalized Help Section */}
            {/* <section id="personalized-help" className="mb-12 scroll-mt-8">
              <div className="bg-gradient-to-br from-brand-50 to-brand-100 rounded-lg p-6 border border-brand-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  {locale === 'pt-BR' ? 'Quer ajuda personalizada?' : 'Want Personalized Help?'}
                </h2>
                <p className="text-slate-700 leading-relaxed mb-4">
                  {locale === 'pt-BR' ? (
                    <>
                      Se você é motorista, entregador ou freelancer e quer uma recomendação gratuita, fale com a nossa equipe. Podemos fazer uma análise rápida do seu perfil e indicar apólices que realmente protejam sua renda.
                    </>
                  ) : (
                    <>
                      If you are a driver, delivery worker, or freelancer and want a free recommendation, talk to our team. We can do a quick analysis of your profile and recommend policies that truly protect your income.
                    </>
                  )}
                </p>
                <div className="space-y-2 mt-4">
                  <p className="text-slate-700">
                    <strong className="text-slate-900">
                      {locale === 'pt-BR' ? 'Comparar seguros:' : 'Compare insurance:'}
                    </strong>{' '}
                    {locale === 'pt-BR' ? (
                      <>
                        acesse nosso{' '}
                        <Link href={`/${locale}/compare`} className="text-brand-600 hover:text-brand-700 underline">
                          Comparador
                        </Link>
                        .
                      </>
                    ) : (
                      <>
                        access our{' '}
                        <Link href={`/${locale}/compare`} className="text-brand-600 hover:text-brand-700 underline">
                          Comparator
                        </Link>
                        .
                      </>
                    )}
                  </p>
                  <p className="text-slate-700">
                    <strong className="text-slate-900">
                      {locale === 'pt-BR' ? 'Falar com um especialista:' : 'Talk to an expert:'}
                    </strong>{' '}
                    {locale === 'pt-BR' ? (
                      <>
                        entre em{' '}
                        <Link href={`/${locale}/contact`} className="text-brand-600 hover:text-brand-700 underline">
                          contato
                        </Link>
                        {' '}para atendimento personalizado.
                      </>
                    ) : (
                      <>
                        {' '}
                        <Link href={`/${locale}/contact`} className="text-brand-600 hover:text-brand-700 underline">
                          contact us
                        </Link>
                        {' '}for personalized service.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </section> */}

            {/* Footer Note */}
            <div className="mt-12 pt-8 border-t border-slate-200">
              <p className="text-sm text-slate-600 italic text-center">
                {locale === 'pt-BR' ? (
                  <>
                    Conteúdo criado pelo GigSafeHub. Nossa atuação é focada em tornar o processo de decisão por seguros mais simples, acessível e transparente — conectando trabalhadores e seguradoras de forma eficiente.
                  </>
                ) : (
                  <>
                    Content created by GigSafeHub. Our work is focused on making the insurance decision process simpler, more accessible, and transparent — efficiently connecting workers and insurers.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

