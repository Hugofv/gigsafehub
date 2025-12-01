'use client';

import React from 'react';
import Link from 'next/link';
import { TRANSLATIONS } from '@/constants';

interface TermsPageClientProps {
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

export default function TermsPageClient({ locale }: TermsPageClientProps) {
  const t = (path: string) => translate(path, locale);
  const lastUpdated = new Date().toISOString();
  const formattedDate = new Date().toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

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
              {t('legal.termsTitle')}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {t('legal.termsTitle')} – GigSafeHub
          </h1>
          <p className="text-slate-600">
            <time dateTime={lastUpdated} className="font-medium">
              {locale === 'pt-BR' ? 'Atualizado em' : 'Last Updated'}: {formattedDate}
            </time>
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 md:p-12">
          {/* Introduction */}
          <div className="prose prose-lg max-w-none prose-slate [&_ul]:list-none mb-8">
            <p className="text-slate-700 leading-relaxed">
              {locale === 'pt-BR' ? (
                <>
                  Bem-vindo ao GigSafeHub. Ao acessar ou utilizar nosso site, você concorda com estes Termos de Uso. Leia atentamente, pois eles estabelecem regras, responsabilidades e limitações importantes para o uso de nossa plataforma de comparação e educação sobre seguros voltada para trabalhadores da Gig Economy.
                </>
              ) : (
                <>
                  Welcome to GigSafeHub. By accessing or using our website, you agree to these Terms of Use. Please read carefully, as they establish important rules, responsibilities, and limitations for using our insurance comparison and education platform for Gig Economy workers.
                </>
              )}
            </p>
          </div>

          {/* Table of Contents */}
          <nav
            aria-label="Table of contents"
            className="mb-12 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <svg
                className="w-5 h-5 text-brand-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <h2 className="text-lg font-semibold text-slate-900">
                {locale === 'pt-BR' ? 'Índice' : 'Table of Contents'}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <a
                href="#platform-objective"
                className="text-sm text-slate-700 hover:text-brand-600 hover:bg-white px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 group"
              >
                <span className="text-brand-400 group-hover:text-brand-600">•</span>
                {locale === 'pt-BR' ? '1. Objetivo da Plataforma' : '1. Platform Objective'}
              </a>
              <a
                href="#acceptance"
                className="text-sm text-slate-700 hover:text-brand-600 hover:bg-white px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 group"
              >
                <span className="text-brand-400 group-hover:text-brand-600">•</span>
                {locale === 'pt-BR' ? '2. Aceitação dos Termos' : '2. Acceptance of Terms'}
              </a>
              <a
                href="#permitted-use"
                className="text-sm text-slate-700 hover:text-brand-600 hover:bg-white px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 group"
              >
                <span className="text-brand-400 group-hover:text-brand-600">•</span>
                {locale === 'pt-BR' ? '3. Uso Permitido da Plataforma' : '3. Permitted Use of Platform'}
              </a>
              <a
                href="#information-nature"
                className="text-sm text-slate-700 hover:text-brand-600 hover:bg-white px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 group"
              >
                <span className="text-brand-400 group-hover:text-brand-600">•</span>
                {locale === 'pt-BR' ? '4. Natureza das Informações' : '4. Information Nature'}
              </a>
              <a
                href="#partners"
                className="text-sm text-slate-700 hover:text-brand-600 hover:bg-white px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 group"
              >
                <span className="text-brand-400 group-hover:text-brand-600">•</span>
                {locale === 'pt-BR' ? '5. Relacionamento com Parceiros' : '5. Partner Relationships'}
              </a>
              <a
                href="#registration"
                className="text-sm text-slate-700 hover:text-brand-600 hover:bg-white px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 group"
              >
                <span className="text-brand-400 group-hover:text-brand-600">•</span>
                {locale === 'pt-BR' ? '6. Cadastro e Interações' : '6. Registration and Interactions'}
              </a>
              <a
                href="#intellectual-property"
                className="text-sm text-slate-700 hover:text-brand-600 hover:bg-white px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 group"
              >
                <span className="text-brand-400 group-hover:text-brand-600">•</span>
                {t('legal.intellectualProperty')}
              </a>
              <a
                href="#external-links"
                className="text-sm text-slate-700 hover:text-brand-600 hover:bg-white px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 group"
              >
                <span className="text-brand-400 group-hover:text-brand-600">•</span>
                {locale === 'pt-BR' ? '8. Links Externos' : '8. External Links'}
              </a>
              <a
                href="#user-responsibility"
                className="text-sm text-slate-700 hover:text-brand-600 hover:bg-white px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 group"
              >
                <span className="text-brand-400 group-hover:text-brand-600">•</span>
                {locale === 'pt-BR' ? '9. Responsabilidade do Usuário' : '9. User Responsibility'}
              </a>
              <a
                href="#limitation-liability"
                className="text-sm text-slate-700 hover:text-brand-600 hover:bg-white px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 group"
              >
                <span className="text-brand-400 group-hover:text-brand-600">•</span>
                {locale === 'pt-BR' ? '10. Limitação de Responsabilidade' : '10. Limitation of Liability'}
              </a>
              <a
                href="#cookies-data"
                className="text-sm text-slate-700 hover:text-brand-600 hover:bg-white px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 group"
              >
                <span className="text-brand-400 group-hover:text-brand-600">•</span>
                {locale === 'pt-BR' ? '11. Cookies e Dados' : '11. Cookies and Data'}
              </a>
              <a
                href="#terms-changes"
                className="text-sm text-slate-700 hover:text-brand-600 hover:bg-white px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 group"
              >
                <span className="text-brand-400 group-hover:text-brand-600">•</span>
                {locale === 'pt-BR' ? '12. Modificações nos Termos' : '12. Changes to Terms'}
              </a>
              <a
                href="#contact"
                className="text-sm text-slate-700 hover:text-brand-600 hover:bg-white px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 group"
              >
                <span className="text-brand-400 group-hover:text-brand-600">•</span>
                {locale === 'pt-BR' ? '13. Contato' : '13. Contact'}
              </a>
            </div>
          </nav>

          <div className="prose prose-lg max-w-none prose-slate [&_ul]:list-none">
            {/* Section 1: Platform Objective */}
            <section id="platform-objective" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {locale === 'pt-BR' ? '1. Objetivo da Plataforma' : '1. Platform Objective'}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    O GigSafeHub é uma plataforma informativa que oferece:
                  </>
                ) : (
                  <>
                    GigSafeHub is an informative platform that offers:
                  </>
                )}
              </p>
              <ul className="text-slate-700 space-y-2 mb-4">
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Comparação de seguros e produtos financeiros;' : 'Comparison of insurance and financial products;'}
                </li>
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Conteúdos educativos sobre proteção financeira, seguros e riscos;' : 'Educational content about financial protection, insurance, and risks;'}
                </li>
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Ferramentas de recomendação e apoio para gig workers.' : 'Recommendation tools and support for gig workers.'}
                </li>
              </ul>
              <p className="text-slate-700 leading-relaxed mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    Nosso propósito é fornecer informações independentes, imparciais e acessíveis, conforme definido em nossa missão oficial.
                  </>
                ) : (
                  <>
                    Our purpose is to provide independent, impartial, and accessible information, as defined in our official mission.
                  </>
                )}
              </p>
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 my-4">
                <p className="text-slate-800 font-semibold mb-2">
                  {locale === 'pt-BR' ? 'Importante:' : 'Important:'}
                </p>
                <p className="text-slate-700">
                  {locale === 'pt-BR' ? (
                    <>
                      O GigSafeHub não vende seguros diretamente. As contratações finais são feitas com seguradoras ou parceiros autorizados.
                    </>
                  ) : (
                    <>
                      GigSafeHub does not sell insurance directly. Final contracts are made with insurers or authorized partners.
                    </>
                  )}
                </p>
              </div>
            </section>

            {/* Section 2: Acceptance of Terms */}
            <section id="acceptance" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {locale === 'pt-BR' ? '2. Aceitação dos Termos' : '2. Acceptance of Terms'}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    Ao acessar o site, utilizar o comparador ou consumir qualquer conteúdo, você declara que:
                  </>
                ) : (
                  <>
                    By accessing the site, using the comparator, or consuming any content, you declare that:
                  </>
                )}
              </p>
              <ul className="text-slate-700 space-y-2 mb-4">
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Leu e concordou com estes Termos;' : 'You have read and agreed to these Terms;'}
                </li>
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'É maior de 18 anos ou possui autorização legal;' : 'You are 18 years or older or have legal authorization;'}
                </li>
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Não utilizará o site de forma indevida.' : 'You will not use the site improperly.'}
                </li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                {locale === 'pt-BR' ? (
                  <>
                    Caso não concorde, não utilize a plataforma.
                  </>
                ) : (
                  <>
                    If you do not agree, do not use the platform.
                  </>
                )}
              </p>
            </section>

            {/* Section 3: Permitted Use */}
            <section id="permitted-use" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {locale === 'pt-BR' ? '3. Uso Permitido da Plataforma' : '3. Permitted Use of Platform'}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    Você pode usar o GigSafeHub para:
                  </>
                ) : (
                  <>
                    You can use GigSafeHub to:
                  </>
                )}
              </p>
              <ul className="text-slate-700 space-y-2 mb-6">
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Ler artigos e guias;' : 'Read articles and guides;'}
                </li>
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Comparar produtos de seguros;' : 'Compare insurance products;'}
                </li>
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Solicitar recomendações e orientações;' : 'Request recommendations and guidance;'}
                </li>
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Entrar em contato com nossa equipe;' : 'Contact our team;'}
                </li>
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Compartilhar conteúdos citando a fonte.' : 'Share content citing the source.'}
                </li>
              </ul>
              <p className="text-slate-700 leading-relaxed mb-4 font-semibold">
                {locale === 'pt-BR' ? 'É proibido:' : 'It is prohibited:'}
              </p>
              <ul className="text-slate-700 space-y-2">
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Copiar grandes trechos de conteúdo sem autorização;' : 'Copy large portions of content without authorization;'}
                </li>
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Utilizar robôs, scraping ou automações sem consentimento;' : 'Use robots, scraping, or automation without consent;'}
                </li>
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Distribuir informações falsas ou difamatórias;' : 'Distribute false or defamatory information;'}
                </li>
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Invadir sistemas, alterar código ou comprometer a segurança.' : 'Invade systems, alter code, or compromise security.'}
                </li>
              </ul>
            </section>

            {/* Section 4: Information Nature */}
            <section id="information-nature" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {locale === 'pt-BR' ? '4. Natureza das Informações e Limitadores' : '4. Information Nature and Limitations'}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    Apesar de nossa equipe fazer análises criteriosas, o GigSafeHub não garante que:
                  </>
                ) : (
                  <>
                    Despite our team making careful analyses, GigSafeHub does not guarantee that:
                  </>
                )}
              </p>
              <ul className="text-slate-700 space-y-2 mb-4">
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Os preços exibidos estejam sempre atualizados;' : 'The displayed prices are always up to date;'}
                </li>
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'As condições dos seguros sejam estáveis (podem mudar a qualquer momento pela seguradora);' : 'Insurance conditions are stable (they may change at any time by the insurer);'}
                </li>
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'As informações substituam aconselhamento profissional especializado.' : 'The information replaces specialized professional advice.'}
                </li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                {locale === 'pt-BR' ? (
                  <>
                    As recomendações são educacionais, baseadas em critérios imparciais e orientados à segurança do gig worker, conforme nossa missão central.
                  </>
                ) : (
                  <>
                    Recommendations are educational, based on impartial criteria and oriented to gig worker safety, in accordance with our core mission.
                  </>
                )}
              </p>
            </section>

            {/* Section 5: Partners */}
            <section id="partners" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {locale === 'pt-BR' ? '5. Relacionamento com Seguradoras e Parceiros' : '5. Relationship with Insurers and Partners'}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    O GigSafeHub pode receber remuneração ao indicar seguradoras parceiras, mas isso não influencia:
                  </>
                ) : (
                  <>
                    GigSafeHub may receive compensation for referring partner insurers, but this does not influence:
                  </>
                )}
              </p>
              <ul className="text-slate-700 space-y-2 mb-4">
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'As análises publicadas' : 'Published analyses'}
                </li>
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'As avaliações de produtos' : 'Product evaluations'}
                </li>
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'O posicionamento dos artigos' : 'Article positioning'}
                </li>
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'As comparações exibidas' : 'Displayed comparisons'}
                </li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                {locale === 'pt-BR' ? (
                  <>
                    Nosso compromisso é com a transparência, independência e imparcialidade, valores fundamentais do projeto.
                  </>
                ) : (
                  <>
                    Our commitment is to transparency, independence, and impartiality, fundamental values of the project.
                  </>
                )}
              </p>
            </section>

            {/* Section 6: Registration */}
            <section id="registration" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {locale === 'pt-BR' ? '6. Cadastro e Interações' : '6. Registration and Interactions'}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    Ao preencher formulários, você concorda em fornecer informações verdadeiras e atualizadas.
                    Podemos entrar em contato por e-mail ou telefone (somente se você fornecer esses dados voluntariamente).
                  </>
                ) : (
                  <>
                    By filling out forms, you agree to provide true and updated information.
                    We may contact you by email or phone (only if you voluntarily provide this data).
                  </>
                )}
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    Você é responsável por:
                  </>
                ) : (
                  <>
                    You are responsible for:
                  </>
                )}
              </p>
              <ul className="text-slate-700 space-y-2">
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Manter seus dados corretos;' : 'Keeping your data correct;'}
                </li>
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Não enviar informações de terceiros sem consentimento;' : 'Not sending third-party information without consent;'}
                </li>
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Utilizar os recursos da plataforma de forma lícita.' : 'Using platform resources lawfully.'}
                </li>
              </ul>
            </section>

            {/* Section 7: Intellectual Property */}
            <section id="intellectual-property" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {locale === 'pt-BR' ? '7. Propriedade Intelectual' : '7. Intellectual Property'}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    Todo o conteúdo do site — textos, imagens, gráficos, artigos, comparadores, marca e identidade visual — pertence ao GigSafeHub.
                  </>
                ) : (
                  <>
                    All site content — texts, images, graphics, articles, comparators, brand, and visual identity — belongs to GigSafeHub.
                  </>
                )}
              </p>
              <p className="text-slate-700 leading-relaxed mb-4 font-semibold">
                {locale === 'pt-BR' ? 'Proibido:' : 'Prohibited:'}
              </p>
              <ul className="text-slate-700 space-y-2 mb-6">
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Copiar, republicar ou distribuir conteúdo sem autorização;' : 'Copy, republish, or distribute content without authorization;'}
                </li>
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Usar nossa marca comercial indevidamente;' : 'Use our trademark improperly;'}
                </li>
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Criar sites ou serviços derivados usando nossa identidade.' : 'Create sites or derivative services using our identity.'}
                </li>
              </ul>
              <p className="text-slate-700 leading-relaxed mb-4 font-semibold">
                {locale === 'pt-BR' ? 'Permitido:' : 'Permitted:'}
              </p>
              <ul className="text-slate-700 space-y-2">
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Citar trechos com link para a fonte;' : 'Quote excerpts with link to source;'}
                </li>
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Compartilhar conteúdos em redes sociais.' : 'Share content on social networks.'}
                </li>
              </ul>
            </section>

            {/* Section 8: External Links */}
            <section id="external-links" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {locale === 'pt-BR' ? '8. Links Externos' : '8. External Links'}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    Algumas páginas incluem links para sites externos (seguradoras, parceiros ou materiais educativos). O GigSafeHub não se responsabiliza por:
                  </>
                ) : (
                  <>
                    Some pages include links to external sites (insurers, partners, or educational materials). GigSafeHub is not responsible for:
                  </>
                )}
              </p>
              <ul className="text-slate-700 space-y-2 mb-4">
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Conteúdos externos;' : 'External content;'}
                </li>
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Políticas de privacidade desses serviços;' : 'Privacy policies of these services;'}
                </li>
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Informações divergentes apresentadas fora da plataforma.' : 'Divergent information presented outside the platform.'}
                </li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                {locale === 'pt-BR' ? (
                  <>
                    Ao acessar links externos, você estará sujeito aos termos e políticas do site de destino.
                  </>
                ) : (
                  <>
                    By accessing external links, you will be subject to the terms and policies of the destination site.
                  </>
                )}
              </p>
            </section>

            {/* Section 9: User Responsibility */}
            <section id="user-responsibility" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {locale === 'pt-BR' ? '9. Responsabilidade do Usuário' : '9. User Responsibility'}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    Você concorda em:
                  </>
                ) : (
                  <>
                    You agree to:
                  </>
                )}
              </p>
              <ul className="text-slate-700 space-y-2">
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Utilizar as informações de modo responsável;' : 'Use information responsibly;'}
                </li>
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Não prejudicar a experiência de outros usuários;' : 'Not harm the experience of other users;'}
                </li>
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Respeitar leis de proteção de dados (LGPD);' : 'Respect data protection laws (LGPD);'}
                </li>
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Não tentar explorar vulnerabilidades do sistema.' : 'Not attempt to exploit system vulnerabilities.'}
                </li>
              </ul>
            </section>

            {/* Section 10: Limitation of Liability */}
            <section id="limitation-liability" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {locale === 'pt-BR' ? '10. Limitação de Responsabilidade' : '10. Limitation of Liability'}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    O GigSafeHub não se responsabiliza por:
                  </>
                ) : (
                  <>
                    GigSafeHub is not responsible for:
                  </>
                )}
              </p>
              <ul className="text-slate-700 space-y-2 mb-4">
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Decisões tomadas com base nas informações do site;' : 'Decisions made based on site information;'}
                </li>
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Perdas financeiras decorrentes da contratação ou não contratação de seguros;' : 'Financial losses resulting from contracting or not contracting insurance;'}
                </li>
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Dados incorretos fornecidos por seguradoras parceiras;' : 'Incorrect data provided by partner insurers;'}
                </li>
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Interrupções temporárias no site.' : 'Temporary site interruptions.'}
                </li>
              </ul>
              <p className="text-slate-700 leading-relaxed">
                {locale === 'pt-BR' ? (
                  <>
                    Nosso papel é informar, comparar e educar, não garantir resultado financeiro ou cobertura específica.
                  </>
                ) : (
                  <>
                    Our role is to inform, compare, and educate, not to guarantee financial results or specific coverage.
                  </>
                )}
              </p>
            </section>

            {/* Section 11: Cookies and Data */}
            <section id="cookies-data" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {locale === 'pt-BR' ? '11. Cookies e Dados' : '11. Cookies and Data'}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    Ao utilizar o site, você concorda com o uso de cookies e armazenamento de dados conforme nossa Política de Privacidade.
                  </>
                ) : (
                  <>
                    By using the site, you agree to the use of cookies and data storage in accordance with our Privacy Policy.
                  </>
                )}
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    Esses dados são usados para:
                  </>
                ) : (
                  <>
                    This data is used to:
                  </>
                )}
              </p>
              <ul className="text-slate-700 space-y-2 mb-4">
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Melhorar sua experiência;' : 'Improve your experience;'}
                </li>
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Personalizar conteúdo;' : 'Personalize content;'}
                </li>
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Criar recomendações;' : 'Create recommendations;'}
                </li>
                <li className="pl-8">
                  {locale === 'pt-BR' ? 'Análises estatísticas.' : 'Statistical analyses.'}
                </li>
              </ul>
              <p className="text-slate-700 leading-relaxed italic">
                {locale === 'pt-BR' ? (
                  <>
                    (Lembre-se: seus dados nunca são vendidos. Veja detalhes na Política de Privacidade.)
                  </>
                ) : (
                  <>
                    (Remember: your data is never sold. See details in the Privacy Policy.)
                  </>
                )}
              </p>
            </section>

            {/* Section 12: Changes to Terms */}
            <section id="terms-changes" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {locale === 'pt-BR' ? '12. Modificações nos Termos de Uso' : '12. Changes to Terms of Use'}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    O GigSafeHub pode atualizar estes Termos a qualquer momento.
                    A versão mais recente sempre estará disponível nesta página.
                  </>
                ) : (
                  <>
                    GigSafeHub may update these Terms at any time.
                    The most recent version will always be available on this page.
                  </>
                )}
              </p>
              <p className="text-slate-700 leading-relaxed">
                {locale === 'pt-BR' ? (
                  <>
                    Se houver mudanças relevantes, informaremos por e-mail ou aviso no site.
                  </>
                ) : (
                  <>
                    If there are relevant changes, we will notify you by email or notice on the site.
                  </>
                )}
              </p>
            </section>

            {/* Section 13: Contact */}
            <section id="contact" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {locale === 'pt-BR' ? '13. Contato' : '13. Contact'}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    Para dúvidas sobre estes Termos de Uso:
                  </>
                ) : (
                  <>
                    For questions about these Terms of Use:
                  </>
                )}
              </p>
              <div className="space-y-2">
                <p className="text-slate-700">
                  <a href="mailto:contato@gigsafehub.com" className="text-brand-600 hover:text-brand-700 underline">
                    📩 contato@gigsafehub.com
                  </a>
                </p>
                <p className="text-slate-700">
                  <a href="https://gigsafehub.com" className="text-brand-600 hover:text-brand-700 underline">
                    🌐 gigsafehub.com
                  </a>
                </p>
              </div>
            </section>
          </div>

          {/* Related Links */}
          <div className="mt-12 pt-8 border-t border-slate-200">
            <div className="flex items-center gap-2 mb-6">
              <svg
                className="w-5 h-5 text-brand-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-lg font-semibold text-slate-900">
                {locale === 'pt-BR' ? 'Documentos Relacionados' : 'Related Documents'}
              </h3>
            </div>
            <div className="bg-gradient-to-br from-brand-50 to-brand-100 rounded-lg p-4 border border-brand-200">
              <Link
                href={`/${locale}${locale === 'pt-BR' ? '/politicas-e-privacidade' : '/privacy-and-policies'}`}
                className="group flex items-center gap-3 text-brand-700 hover:text-brand-800 transition-colors"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <svg
                    className="w-5 h-5 text-brand-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium group-hover:underline">{t('legal.privacyTitle')}</p>
                  <p className="text-sm text-brand-600">
                    {locale === 'pt-BR'
                      ? 'Leia nossa política de privacidade'
                      : 'Read our privacy policy'}
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-brand-500 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
