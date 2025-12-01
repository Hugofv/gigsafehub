'use client';

import React from 'react';
import Link from 'next/link';
import { TRANSLATIONS } from '@/constants';

interface PrivacyPageClientProps {
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

export default function PrivacyPageClient({ locale }: PrivacyPageClientProps) {
  const t = (path: string) => translate(path, locale);
  const lastUpdated = new Date().toISOString();
  const formattedDate = new Date().toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm">
            <Link
              href={`/${locale}`}
              className="text-slate-500 hover:text-brand-600 transition-colors"
            >
              {t('common.home')}
            </Link>
            <span className="text-slate-400" aria-hidden="true">
              /
            </span>
            <span className="text-slate-900 font-medium" aria-current="page">
              {t('legal.privacyTitle')}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            {t('legal.privacyTitle')}
          </h1>
          <p className="text-slate-600">
            <time dateTime={lastUpdated} className="font-medium">
              {t('legal.lastUpdated')}: {formattedDate}
            </time>
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 md:p-12">
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
                href="#introduction"
                className="text-sm text-slate-700 hover:text-brand-600 hover:bg-white px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 group"
              >
                <span className="text-brand-400 group-hover:text-brand-600">•</span>
                {t('legal.introduction')}
              </a>
              <a
                href="#information-collection"
                className="text-sm text-slate-700 hover:text-brand-600 hover:bg-white px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 group"
              >
                <span className="text-brand-400 group-hover:text-brand-600">•</span>
                {t('legal.informationWeCollect')}
              </a>
              <a
                href="#data-usage"
                className="text-sm text-slate-700 hover:text-brand-600 hover:bg-white px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 group"
              >
                <span className="text-brand-400 group-hover:text-brand-600">•</span>
                {t('legal.howWeUseInformation')}
              </a>
              <a
                href="#legal-basis"
                className="text-sm text-slate-700 hover:text-brand-600 hover:bg-white px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 group"
              >
                <span className="text-brand-400 group-hover:text-brand-600">•</span>
                {locale === 'pt-BR'
                  ? 'Base Legal para o Tratamento (LGPD)'
                  : 'Legal Basis for Processing'}
              </a>
              <a
                href="#data-protection"
                className="text-sm text-slate-700 hover:text-brand-600 hover:bg-white px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 group"
              >
                <span className="text-brand-400 group-hover:text-brand-600">•</span>
                {t('legal.dataProtection')}
              </a>
              <a
                href="#data-sharing"
                className="text-sm text-slate-700 hover:text-brand-600 hover:bg-white px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 group"
              >
                <span className="text-brand-400 group-hover:text-brand-600">•</span>
                {locale === 'pt-BR' ? 'Compartilhamento de Dados' : 'Data Sharing'}
              </a>
              <a
                href="#cookies"
                className="text-sm text-slate-700 hover:text-brand-600 hover:bg-white px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 group"
              >
                <span className="text-brand-400 group-hover:text-brand-600">•</span>
                {t('legal.cookies')}
              </a>
              <a
                href="#user-rights"
                className="text-sm text-slate-700 hover:text-brand-600 hover:bg-white px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 group"
              >
                <span className="text-brand-400 group-hover:text-brand-600">•</span>
                {t('legal.yourRights')}
              </a>
              <a
                href="#data-retention"
                className="text-sm text-slate-700 hover:text-brand-600 hover:bg-white px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 group"
              >
                <span className="text-brand-400 group-hover:text-brand-600">•</span>
                {locale === 'pt-BR'
                  ? 'Retenção e Exclusão de Dados'
                  : 'Data Retention and Deletion'}
              </a>
              <a
                href="#content-policy"
                className="text-sm text-slate-700 hover:text-brand-600 hover:bg-white px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 group"
              >
                <span className="text-brand-400 group-hover:text-brand-600">•</span>
                {locale === 'pt-BR'
                  ? 'Política de Conteúdo e Imparcialidade'
                  : 'Content Policy and Impartiality'}
              </a>
              <a
                href="#policy-changes"
                className="text-sm text-slate-700 hover:text-brand-600 hover:bg-white px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 group"
              >
                <span className="text-brand-400 group-hover:text-brand-600">•</span>
                {t('legal.changesToPolicy')}
              </a>
              <a
                href="#contact"
                className="text-sm text-slate-700 hover:text-brand-600 hover:bg-white px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 group"
              >
                <span className="text-brand-400 group-hover:text-brand-600">•</span>
                {t('legal.contactUs')}
              </a>
            </div>
          </nav>

          <div className="prose prose-lg max-w-none prose-slate">
            <section id="introduction" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('legal.introduction')}</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    A sua privacidade é importante para nós. Esta Política de Privacidade explica
                    como o GigSafeHub coleta, utiliza, armazena e protege seus dados pessoais ao
                    navegar em nosso site, utilizar nossos comparadores de seguros ou interagir com
                    nossos conteúdos. Seguimos as diretrizes da{' '}
                    <strong>LGPD (Lei Geral de Proteção de Dados – Lei 13.709/2018)</strong>.
                  </>
                ) : (
                  <>
                    Your privacy is important to us. This Privacy Policy explains how GigSafeHub
                    collects, uses, stores, and protects your personal data when browsing our
                    website, using our insurance comparators, or interacting with our content. We
                    follow the guidelines of applicable data protection laws.
                  </>
                )}
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    Somos uma plataforma especializada em comparação, educação e recomendação de
                    seguros para trabalhadores da Gig Economy, conforme nossos objetivos oficiais.
                  </>
                ) : (
                  <>
                    We are a platform specialized in comparison, education, and recommendation of
                    insurance for Gig Economy workers, in accordance with our official objectives.
                  </>
                )}
              </p>
            </section>

            <section id="information-collection" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {t('legal.informationWeCollect')}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    Coletamos dados para melhorar sua experiência e oferecer recomendações
                    personalizadas. As categorias incluem:
                  </>
                ) : (
                  <>
                    We collect data to improve your experience and offer personalized
                    recommendations. Categories include:
                  </>
                )}
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">
                {locale === 'pt-BR' ? '1.1. Dados fornecidos por você' : '1.1. Data You Provide'}
              </h3>
              <ul className="text-slate-700 space-y-2 mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    <li className="pl-8">Nome</li>
                    <li className="pl-8">E-mail</li>
                    <li className="pl-8">Telefone (se fornecido para contato)</li>
                    <li className="pl-8">
                      Informações inseridas no comparador (ex.: perfil de motorista, tipo de
                      trabalho, necessidades de seguro)
                    </li>
                    <li className="pl-8">Mensagens enviadas via formulários</li>
                  </>
                ) : (
                  <>
                    <li className="pl-8">Name</li>
                    <li className="pl-8">Email</li>
                    <li className="pl-8">Phone (if provided for contact)</li>
                    <li className="pl-8">
                      Information entered in the comparator (e.g., driver profile, type of work,
                      insurance needs)
                    </li>
                    <li className="pl-8">Messages sent via forms</li>
                  </>
                )}
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">
                {locale === 'pt-BR'
                  ? '1.2. Dados coletados automaticamente'
                  : '1.2. Automatically Collected Data'}
              </h3>
              <ul className="text-slate-700 space-y-2 mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    <li className="pl-8">Endereço IP</li>
                    <li className="pl-8">Localização aproximada</li>
                    <li className="pl-8">Tipo de dispositivo e navegador</li>
                    <li className="pl-8">Páginas acessadas, tempo no site e interações</li>
                    <li className="pl-8">Cookies essenciais, analíticos e de desempenho</li>
                  </>
                ) : (
                  <>
                    <li className="pl-8">IP address</li>
                    <li className="pl-8">Approximate location</li>
                    <li className="pl-8">Device type and browser</li>
                    <li className="pl-8">Pages accessed, time on site, and interactions</li>
                    <li className="pl-8">Essential, analytical, and performance cookies</li>
                  </>
                )}
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">
                {locale === 'pt-BR' ? '1.3. Dados de parceiros' : '1.3. Partner Data'}
              </h3>
              <p className="text-slate-700 leading-relaxed mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    Recebemos informações anonimizadas de campanhas de marketing para medir
                    performance (ex.: cliques, origem de tráfego).
                  </>
                ) : (
                  <>
                    We receive anonymized information from marketing campaigns to measure
                    performance (e.g., clicks, traffic source).
                  </>
                )}
              </p>
            </section>

            <section id="data-usage" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {t('legal.howWeUseInformation')}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                {locale === 'pt-BR' ? <>Usamos seus dados para:</> : <>We use your data to:</>}
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">
                {locale === 'pt-BR'
                  ? '2.1. Melhorar sua experiência'
                  : '2.1. Improve Your Experience'}
              </h3>
              <ul className="text-slate-700 space-y-2 mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    <li className="pl-8">Tornar o site mais rápido e personalizado</li>
                    <li className="pl-8">Lembrar suas preferências e configurações</li>
                  </>
                ) : (
                  <>
                    <li className="pl-8">Make the site faster and personalized</li>
                    <li className="pl-8">Remember your preferences and settings</li>
                  </>
                )}
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">
                {locale === 'pt-BR'
                  ? '2.2. Oferecer recomendações melhores'
                  : '2.2. Offer Better Recommendations'}
              </h3>
              <ul className="text-slate-700 space-y-2 mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    <li className="pl-8">Comparar ofertas de seguros com mais assertividade</li>
                    <li className="pl-8">
                      Exibir conteúdos relevantes ao seu tipo de trabalho na Gig Economy
                    </li>
                  </>
                ) : (
                  <>
                    <li className="pl-8">Compare insurance offers with greater accuracy</li>
                    <li className="pl-8">
                      Display content relevant to your type of work in the Gig Economy
                    </li>
                  </>
                )}
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">
                {locale === 'pt-BR' ? '2.3. Comunicação' : '2.3. Communication'}
              </h3>
              <ul className="text-slate-700 space-y-2 mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    <li className="pl-8">Enviar e-mails informativos (com sua permissão)</li>
                    <li className="pl-8">Responder dúvidas enviadas via formulário</li>
                  </>
                ) : (
                  <>
                    <li className="pl-8">Send informational emails (with your permission)</li>
                    <li className="pl-8">Respond to questions sent via form</li>
                  </>
                )}
              </ul>

              <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">
                {locale === 'pt-BR' ? '2.4. Segurança' : '2.4. Security'}
              </h3>
              <p className="text-slate-700 leading-relaxed mb-4 ml-4">
                {locale === 'pt-BR' ? (
                  <>Prevenir fraudes e garantir uso correto dos serviços.</>
                ) : (
                  <>Prevent fraud and ensure proper use of services.</>
                )}
              </p>
            </section>

            <section id="legal-basis" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {locale === 'pt-BR'
                  ? '3. Base Legal para o Tratamento (LGPD)'
                  : '3. Legal Basis for Processing'}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                {locale === 'pt-BR' ? (
                  <>Trabalhamos com as seguintes bases legais:</>
                ) : (
                  <>We work with the following legal bases:</>
                )}
              </p>
              <ul className="text-slate-700 space-y-3 mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    <li className="pl-8">
                      <strong>Consentimento:</strong> quando você aceita cookies ou preenche
                      formulários.
                    </li>
                    <li className="pl-8">
                      <strong>Execução de contrato:</strong> quando usamos dados para entregar
                      comparações solicitadas por você.
                    </li>
                    <li className="pl-8">
                      <strong>Legítimo interesse:</strong> para melhorar funcionalidades, desde que
                      não comprometa seus direitos.
                    </li>
                    <li className="pl-8">
                      <strong>Obrigação legal:</strong> quando precisamos armazenar dados por
                      exigência normativa.
                    </li>
                  </>
                ) : (
                  <>
                    <li className="pl-8">
                      <strong>Consent:</strong> when you accept cookies or fill out forms.
                    </li>
                    <li className="pl-8">
                      <strong>Contract execution:</strong> when we use data to deliver comparisons
                      requested by you.
                    </li>
                    <li className="pl-8">
                      <strong>Legitimate interest:</strong> to improve functionality, as long as it
                      does not compromise your rights.
                    </li>
                    <li className="pl-8">
                      <strong>Legal obligation:</strong> when we need to store data due to
                      regulatory requirements.
                    </li>
                  </>
                )}
              </ul>
            </section>

            <section id="data-protection" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {t('legal.dataProtection')}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                {locale === 'pt-BR' ? (
                  <>Implementamos medidas de segurança como:</>
                ) : (
                  <>We implement security measures such as:</>
                )}
              </p>
              <ul className="text-slate-700 space-y-2 mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    <li className="pl-8">Criptografia</li>
                    <li className="pl-8">Firewalls</li>
                    <li className="pl-8">Acesso restrito a dados</li>
                    <li className="pl-8">Monitoramento antiviolação</li>
                    <li className="pl-8">Servidores seguros em empresas certificadas</li>
                  </>
                ) : (
                  <>
                    <li className="pl-8">Encryption</li>
                    <li className="pl-8">Firewalls</li>
                    <li className="pl-8">Restricted data access</li>
                    <li className="pl-8">Anti-breach monitoring</li>
                    <li className="pl-8">Secure servers in certified companies</li>
                  </>
                )}
              </ul>
              <p className="text-slate-700 leading-relaxed mb-4 font-semibold">
                {locale === 'pt-BR' ? (
                  <>Seus dados nunca são vendidos ou compartilhados sem autorização.</>
                ) : (
                  <>Your data is never sold or shared without authorization.</>
                )}
              </p>
            </section>

            <section id="data-sharing" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {locale === 'pt-BR' ? '5. Compartilhamento de Dados' : '5. Data Sharing'}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                {locale === 'pt-BR' ? (
                  <>Podemos compartilhar informações com:</>
                ) : (
                  <>We may share information with:</>
                )}
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">
                {locale === 'pt-BR' ? '5.1. Parceiros de seguros' : '5.1. Insurance Partners'}
              </h3>
              <p className="text-slate-700 leading-relaxed mb-4 ml-4">
                {locale === 'pt-BR' ? (
                  <>Apenas quando você solicita uma cotação ou simulação voluntariamente.</>
                ) : (
                  <>Only when you voluntarily request a quote or simulation.</>
                )}
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">
                {locale === 'pt-BR' ? '5.2. Serviços de terceiros' : '5.2. Third-Party Services'}
              </h3>
              <ul className="text-slate-700 space-y-2 mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    <li className="pl-8">Ferramentas de análise (ex.: Google Analytics)</li>
                    <li className="pl-8">Sistemas de e-mail marketing</li>
                    <li className="pl-8">Plataformas de hospedagem</li>
                  </>
                ) : (
                  <>
                    <li className="pl-8">Analytics tools (e.g., Google Analytics)</li>
                    <li className="pl-8">Email marketing systems</li>
                    <li className="pl-8">Hosting platforms</li>
                  </>
                )}
              </ul>
              <p className="text-slate-700 leading-relaxed mb-4 ml-4">
                {locale === 'pt-BR' ? (
                  <>Todos seguem padrões de segurança compatíveis com a LGPD.</>
                ) : (
                  <>All follow security standards compatible with data protection laws.</>
                )}
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-3 mt-6">
                {locale === 'pt-BR' ? 'Nunca compartilhamos:' : 'We never share:'}
              </h3>
              <ul className="text-slate-700 space-y-2 mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    <li className="pl-8">Dados pessoais sensíveis sem autorização</li>
                    <li className="pl-8">Informações para fins comerciais sem consentimento</li>
                    <li className="pl-8">
                      Dados que permitam sua identificação sem necessidade operacional
                    </li>
                  </>
                ) : (
                  <>
                    <li className="pl-8">Sensitive personal data without authorization</li>
                    <li className="pl-8">Information for commercial purposes without consent</li>
                    <li className="pl-8">
                      Data that allows your identification without operational need
                    </li>
                  </>
                )}
              </ul>
            </section>

            <section id="user-rights" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {locale === 'pt-BR'
                  ? '7. Seus Direitos Como Titular (LGPD)'
                  : '7. Your Rights as Data Subject'}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                {locale === 'pt-BR' ? (
                  <>A qualquer momento, você pode solicitar:</>
                ) : (
                  <>At any time, you can request:</>
                )}
              </p>
              <ul className="text-slate-700 space-y-2 mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    <li className="pl-8">✔ Acesso aos dados</li>
                    <li className="pl-8">✔ Correção de informações</li>
                    <li className="pl-8">✔ Exclusão dos dados</li>
                    <li className="pl-8">✔ Portabilidade</li>
                    <li className="pl-8">✔ Revogação do consentimento</li>
                    <li className="pl-8">✔ Explicação sobre como seus dados são tratados</li>
                  </>
                ) : (
                  <>
                    <li className="pl-8">✔ Access to data</li>
                    <li className="pl-8">✔ Correction of information</li>
                    <li className="pl-8">✔ Deletion of data</li>
                    <li className="pl-8">✔ Portability</li>
                    <li className="pl-8">✔ Revocation of consent</li>
                    <li className="pl-8">✔ Explanation of how your data is processed</li>
                  </>
                )}
              </ul>
              <p className="text-slate-700 leading-relaxed mb-4 mt-6">
                {locale === 'pt-BR' ? (
                  <p>
                    Entre em contato:{' '}
                    <a
                      href="mailto:contato@gigsafehub.com"
                      className="text-brand-600 hover:text-brand-700 underline font-semibold"
                    >
                      contato@gigsafehub.com
                    </a>
                  </p>
                ) : (
                  <p>
                    Contact us:{' '}
                    <a
                      href="mailto:contato@gigsafehub.com"
                      className="text-brand-600 hover:text-brand-700 underline font-semibold"
                    >
                      contato@gigsafehub.com
                    </a>
                  </p>
                )}
              </p>
            </section>

            <section id="data-retention" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {locale === 'pt-BR'
                  ? '8. Retenção e Exclusão de Dados'
                  : '8. Data Retention and Deletion'}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                {locale === 'pt-BR' ? (
                  <>Retemos dados apenas pelo tempo necessário para:</>
                ) : (
                  <>We retain data only for the time necessary to:</>
                )}
              </p>
              <ul className="text-slate-700 space-y-2 mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    <li className="pl-8">Cumprir obrigações legais</li>
                    <li className="pl-8">Realizar comparações solicitadas</li>
                    <li className="pl-8">Garantir suporte ao usuário</li>
                  </>
                ) : (
                  <>
                    <li className="pl-8">Comply with legal obligations</li>
                    <li className="pl-8">Perform requested comparisons</li>
                    <li className="pl-8">Ensure user support</li>
                  </>
                )}
              </ul>
              <p className="text-slate-700 leading-relaxed mb-4">
                {locale === 'pt-BR' ? (
                  <>Após esse período, são anonimizados ou excluídos de forma segura.</>
                ) : (
                  <>After this period, they are anonymized or securely deleted.</>
                )}
              </p>
            </section>

            <section id="content-policy" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {locale === 'pt-BR'
                  ? '9. Política de Conteúdo e Imparcialidade'
                  : '9. Content Policy and Impartiality'}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                {locale === 'pt-BR' ? <>Nosso conteúdo é:</> : <>Our content is:</>}
              </p>
              <ul className="text-slate-700 space-y-2 mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    <li className="pl-8">Independente</li>
                    <li className="pl-8">Baseado em dados e análises técnicas</li>
                    <li className="pl-8">Não influenciado por comissões</li>
                  </>
                ) : (
                  <>
                    <li className="pl-8">Independent</li>
                    <li className="pl-8">Based on data and technical analysis</li>
                    <li className="pl-8">Not influenced by commissions</li>
                  </>
                )}
              </ul>
              <p className="text-slate-700 leading-relaxed mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    Isso reforça nosso compromisso com trabalhadores da Gig Economy, conforme
                    indicado em nossa missão oficial.
                  </>
                ) : (
                  <>
                    This reinforces our commitment to Gig Economy workers, as indicated in our
                    official mission.
                  </>
                )}
              </p>
            </section>

            <section id="cookies" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('legal.cookies')}</h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                {locale === 'pt-BR' ? <>Utilizamos cookies para:</> : <>We use cookies to:</>}
              </p>
              <ul className="text-slate-700 space-y-2 mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    <li className="pl-8">Melhorar performance</li>
                    <li className="pl-8">Entender comportamento de navegação</li>
                    <li className="pl-8">Personalizar conteúdos</li>
                    <li className="pl-8">Medir resultados de campanhas</li>
                  </>
                ) : (
                  <>
                    <li className="pl-8">Improve performance</li>
                    <li className="pl-8">Understand browsing behavior</li>
                    <li className="pl-8">Personalize content</li>
                    <li className="pl-8">Measure campaign results</li>
                  </>
                )}
              </ul>
              <p className="text-slate-700 leading-relaxed mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    Você pode desabilitar cookies no navegador, mas partes do site podem deixar de
                    funcionar corretamente.
                  </>
                ) : (
                  <>
                    You can disable cookies in your browser, but parts of the site may stop working
                    correctly.
                  </>
                )}
              </p>
            </section>

            <section id="policy-changes" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {locale === 'pt-BR' ? '10. Alterações na Política' : '10. Changes to This Policy'}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    Podemos atualizar esta Política periodicamente. A data de última atualização
                    estará sempre no topo da página.
                  </>
                ) : (
                  <>
                    We may update this Policy periodically. The last update date will always be at
                    the top of the page.
                  </>
                )}
              </p>
              <p className="text-slate-700 leading-relaxed mb-4">
                {locale === 'pt-BR' ? (
                  <>Se a mudança for significativa, notificaremos por e-mail ou banner no site.</>
                ) : (
                  <>
                    If the change is significant, we will notify you by email or banner on the site.
                  </>
                )}
              </p>
            </section>

            <section id="contact" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {locale === 'pt-BR' ? '11. Como Entrar em Contato' : '11. How to Contact Us'}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                {locale === 'pt-BR' ? (
                  <>Para dúvidas sobre privacidade ou tratamento de dados pessoais:</>
                ) : (
                  <>For questions about privacy or personal data processing:</>
                )}
              </p>
              <ul className="list-none text-slate-700 space-y-2 mb-4">
                {locale === 'pt-BR' ? (
                  <p>
                    📩{' '}
                    <a
                      href="mailto:contato@gigsafehub.com"
                      className="text-brand-600 hover:text-brand-700 underline font-semibold"
                    >
                      contato@gigsafehub.com
                    </a>
                    <br />
                    🌐{' '}
                    <a
                      href="https://gigsafehub.com"
                      className="text-brand-600 hover:text-brand-700 underline"
                    >
                      gigsafehub.com
                    </a>
                  </p>
                ) : (
                  <>
                    <p>
                      📩{' '}
                      <a
                        href="mailto:contato@gigsafehub.com"
                        className="text-brand-600 hover:text-brand-700 underline font-semibold"
                      >
                        contato@gigsafehub.com
                      </a>
                      <br />
                    </p>
                    <p>
                      🌐{' '}
                      <a
                        href="https://gigsafehub.com"
                        className="text-brand-600 hover:text-brand-700 underline"
                      >
                        gigsafehub.com
                      </a>
                    </p>
                  </>
                )}
              </ul>
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
                href={`/${locale}${locale === 'pt-BR' ? '/termos-de-uso' : '/terms-of-use'}`}
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
                  <p className="font-medium group-hover:underline">{t('legal.termsTitle')}</p>
                  <p className="text-sm text-brand-600">
                    {locale === 'pt-BR'
                      ? 'Leia os termos e condições de uso'
                      : 'Read the terms and conditions'}
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
