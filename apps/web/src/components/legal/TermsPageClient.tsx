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
            {t('legal.termsTitle')}
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
                href="#acceptance"
                className="text-sm text-slate-700 hover:text-brand-600 hover:bg-white px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 group"
              >
                <span className="text-brand-400 group-hover:text-brand-600">•</span>
                {t('legal.acceptance')}
              </a>
              <a
                href="#use-of-service"
                className="text-sm text-slate-700 hover:text-brand-600 hover:bg-white px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 group"
              >
                <span className="text-brand-400 group-hover:text-brand-600">•</span>
                {t('legal.useOfService')}
              </a>
              <a
                href="#user-accounts"
                className="text-sm text-slate-700 hover:text-brand-600 hover:bg-white px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 group"
              >
                <span className="text-brand-400 group-hover:text-brand-600">•</span>
                {t('legal.userAccounts')}
              </a>
              <a
                href="#intellectual-property"
                className="text-sm text-slate-700 hover:text-brand-600 hover:bg-white px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 group"
              >
                <span className="text-brand-400 group-hover:text-brand-600">•</span>
                {t('legal.intellectualProperty')}
              </a>
              <a
                href="#disclaimer"
                className="text-sm text-slate-700 hover:text-brand-600 hover:bg-white px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 group"
              >
                <span className="text-brand-400 group-hover:text-brand-600">•</span>
                {t('legal.disclaimer')}
              </a>
              <a
                href="#limitation-liability"
                className="text-sm text-slate-700 hover:text-brand-600 hover:bg-white px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 group"
              >
                <span className="text-brand-400 group-hover:text-brand-600">•</span>
                {t('legal.limitationOfLiability')}
              </a>
              <a
                href="#indemnification"
                className="text-sm text-slate-700 hover:text-brand-600 hover:bg-white px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 group"
              >
                <span className="text-brand-400 group-hover:text-brand-600">•</span>
                {t('legal.indemnification')}
              </a>
              <a
                href="#governing-law"
                className="text-sm text-slate-700 hover:text-brand-600 hover:bg-white px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 group"
              >
                <span className="text-brand-400 group-hover:text-brand-600">•</span>
                {t('legal.governingLaw')}
              </a>
              <a
                href="#terms-changes"
                className="text-sm text-slate-700 hover:text-brand-600 hover:bg-white px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-2 group"
              >
                <span className="text-brand-400 group-hover:text-brand-600">•</span>
                {t('legal.changesToTerms')}
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
            <section id="acceptance" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {t('legal.acceptance')}
              </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              {locale === 'pt-BR' ? (
                <>
                  Ao acessar e usar o GigSafeHub, você aceita e concorda em ficar vinculado aos termos e
                  condições desta política. Se você não concordar com qualquer parte destes termos,
                  não deve usar nosso serviço.
                </>
              ) : (
                <>
                  By accessing and using GigSafeHub, you accept and agree to be bound by the terms and
                  conditions of this policy. If you do not agree to any part of these terms,
                  you should not use our service.
                </>
              )}
            </p>
          </section>

            <section id="use-of-service" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {t('legal.useOfService')}
              </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              {locale === 'pt-BR' ? (
                <>
                  Você concorda em usar nosso serviço apenas para fins legais e de acordo com estes Termos.
                  Você não deve:
                </>
              ) : (
                <>
                  You agree to use our service only for lawful purposes and in accordance with these Terms.
                  You must not:
                </>
              )}
            </p>
            <ul className="text-slate-700 space-y-2 mb-4">
              {locale === 'pt-BR' ? (
                <>
                  <li className="pl-8">Violar qualquer lei ou regulamento aplicável</li>
                  <li className="pl-8">Infringir os direitos de propriedade intelectual de terceiros</li>
                  <li className="pl-8">Transmitir qualquer conteúdo malicioso, vírus ou código prejudicial</li>
                  <li className="pl-8">Tentar obter acesso não autorizado ao nosso sistema</li>
                  <li className="pl-8">Usar o serviço para qualquer propósito fraudulento ou enganoso</li>
                </>
              ) : (
                <>
                  <li className="pl-8">Violate any applicable law or regulation</li>
                  <li className="pl-8">Infringe upon the intellectual property rights of others</li>
                  <li className="pl-8">Transmit any malicious content, viruses, or harmful code</li>
                  <li className="pl-8">Attempt to gain unauthorized access to our system</li>
                  <li className="pl-8">Use the service for any fraudulent or deceptive purpose</li>
                </>
              )}
            </ul>
          </section>

            <section id="user-accounts" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {t('legal.userAccounts')}
              </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              {locale === 'pt-BR' ? (
                <>
                  Se você criar uma conta em nosso site, é responsável por manter a confidencialidade de
                  sua conta e senha. Você concorda em aceitar responsabilidade por todas as atividades que
                  ocorram sob sua conta.
                </>
              ) : (
                <>
                  If you create an account on our website, you are responsible for maintaining the
                  confidentiality of your account and password. You agree to accept responsibility for
                  all activities that occur under your account.
                </>
              )}
            </p>
          </section>

            <section id="intellectual-property" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {t('legal.intellectualProperty')}
              </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              {locale === 'pt-BR' ? (
                <>
                  Todo o conteúdo do site, incluindo textos, gráficos, logos, ícones, imagens, clipes de áudio,
                  downloads digitais e compilações de dados, é propriedade do GigSafeHub ou de seus fornecedores
                  de conteúdo e está protegido por leis de direitos autorais.
                </>
              ) : (
                <>
                  All content on the website, including text, graphics, logos, icons, images, audio clips,
                  digital downloads, and data compilations, is the property of GigSafeHub or its content
                  suppliers and is protected by copyright laws.
                </>
              )}
            </p>
          </section>

            <section id="disclaimer" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {t('legal.disclaimer')}
              </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              {locale === 'pt-BR' ? (
                <>
                  As informações fornecidas no GigSafeHub são apenas para fins informativos gerais.
                  Não fornecemos aconselhamento financeiro, legal ou profissional. Você deve consultar
                  profissionais qualificados antes de tomar decisões financeiras importantes.
                </>
              ) : (
                <>
                  The information provided on GigSafeHub is for general informational purposes only.
                  We do not provide financial, legal, or professional advice. You should consult with
                  qualified professionals before making important financial decisions.
                </>
              )}
            </p>
          </section>

            <section id="limitation-liability" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {t('legal.limitationOfLiability')}
              </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              {locale === 'pt-BR' ? (
                <>
                  Na máxima extensão permitida por lei, o GigSafeHub não será responsável por quaisquer
                  danos diretos, indiretos, incidentais, especiais ou consequenciais resultantes do uso
                  ou incapacidade de usar nosso serviço.
                </>
              ) : (
                <>
                  To the maximum extent permitted by law, GigSafeHub shall not be liable for any direct,
                  indirect, incidental, special, or consequential damages resulting from the use or
                  inability to use our service.
                </>
              )}
            </p>
          </section>

            <section id="indemnification" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {t('legal.indemnification')}
              </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              {locale === 'pt-BR' ? (
                <>
                  Você concorda em indenizar e isentar o GigSafeHub de qualquer reclamação, dano,
                  obrigação, perda, responsabilidade, custo ou dívida, e despesas (incluindo honorários
                  advocatícios) decorrentes de seu uso do serviço ou violação destes Termos.
                </>
              ) : (
                <>
                  You agree to indemnify and hold harmless GigSafeHub from any claim, damage, obligation,
                  loss, liability, cost, or debt, and expenses (including attorney&apos;s fees) arising
                  from your use of the service or violation of these Terms.
                </>
              )}
            </p>
          </section>

            <section id="governing-law" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {t('legal.governingLaw')}
              </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              {locale === 'pt-BR' ? (
                <>
                  Estes Termos serão regidos e interpretados de acordo com as leis do Brasil, sem dar
                  efeito a quaisquer princípios de conflitos de leis.
                </>
              ) : (
                <>
                  These Terms shall be governed and construed in accordance with the laws of the United States,
                  without regard to its conflict of law provisions.
                </>
              )}
            </p>
          </section>

            <section id="terms-changes" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {t('legal.changesToTerms')}
              </h2>
            <p className="text-slate-700 leading-relaxed mb-4">
              {locale === 'pt-BR' ? (
                <>
                  Reservamo-nos o direito de modificar ou substituir estes Termos a qualquer momento.
                  Se uma revisão for material, tentaremos fornecer pelo menos 30 dias de aviso antes
                  de quaisquer novos termos entrarem em vigor.
                </>
              ) : (
                <>
                  We reserve the right to modify or replace these Terms at any time. If a revision is
                  material, we will try to provide at least 30 days notice prior to any new terms taking effect.
                </>
              )}
            </p>
          </section>

            <section id="contact" className="mb-12 scroll-mt-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                {t('legal.contactUs')}
              </h2>
              <p className="text-slate-700 leading-relaxed mb-4">
                {locale === 'pt-BR' ? (
                  <>
                    Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco através
                    da página de contato ou envie um email para{' '}
                    <a href="mailto:contato@gigsafehub.com" className="text-brand-600 hover:text-brand-700 underline">
                      contato@gigsafehub.com
                    </a>
                  </>
                ) : (
                  <>
                    If you have questions about these Terms of Use, please contact us through the contact page
                    or send an email to{' '}
                    <a href="mailto:contato@gigsafehub.com" className="text-brand-600 hover:text-brand-700 underline">
                      contato@gigsafehub.com
                    </a>
                  </>
                )}
              </p>
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

