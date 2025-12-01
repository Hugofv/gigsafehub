import { Metadata } from 'next';
import { unstable_noStore as noStore } from 'next/cache';
import StructuredData, { generateBreadcrumbStructuredData, generateLegalDocumentStructuredData } from '@/components/StructuredData';
import TermsPageClient from '@/components/legal/TermsPageClient';

interface TermsPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  noStore();
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const title = locale === 'pt-BR'
    ? 'Termos de Uso | GigSafeHub - Termos e Condições de Uso'
    : 'Terms of Use | GigSafeHub - Terms and Conditions';
  const description = locale === 'pt-BR'
    ? 'Termos de uso completos do GigSafeHub. Leia os termos e condições que regem o uso de nossa plataforma, seus direitos e obrigações como usuário.'
    : 'Complete GigSafeHub terms of use. Read the terms and conditions governing the use of our platform, your rights and obligations as a user.';
  const keywords = locale === 'pt-BR'
    ? 'termos de uso, termos e condições, condições de uso, política de uso, regras de uso, contrato de usuário'
    : 'terms of use, terms and conditions, conditions of use, usage policy, user agreement, service terms';

  const pageUrl = `${baseUrl}/${locale}/terms-of-use`;
  const currentDate = new Date().toISOString();

  return {
    title,
    description,
    keywords,
    authors: [{ name: 'GigSafeHub' }],
    openGraph: {
      title,
      description,
      type: 'website',
      url: pageUrl,
      siteName: 'GigSafeHub',
      locale: locale === 'pt-BR' ? 'pt_BR' : 'en_US',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: pageUrl,
      languages: {
        'pt-BR': `${baseUrl}/pt-BR/termos-de-uso`,
        'en-US': `${baseUrl}/en-US/terms-of-use`,
      },
    },
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
    other: {
      'article:published_time': currentDate,
      'article:modified_time': currentDate,
    },
  };
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const pageUrl = `${baseUrl}/${locale}/terms-of-use`;
  const currentDate = new Date().toISOString();

  const breadcrumbItems = [
    { name: locale === 'pt-BR' ? 'Início' : 'Home', url: `${baseUrl}/${locale}` },
    { name: locale === 'pt-BR' ? 'Termos de Uso' : 'Terms of Use', url: pageUrl },
  ];

  const legalDocumentData = generateLegalDocumentStructuredData({
    name: locale === 'pt-BR' ? 'Termos de Uso' : 'Terms of Use',
    description: locale === 'pt-BR'
      ? 'Termos de uso do GigSafeHub explicando as condições que regem o uso da plataforma.'
      : 'GigSafeHub terms of use explaining the conditions governing the use of the platform.',
    url: pageUrl,
    datePublished: currentDate,
    dateModified: currentDate,
    locale,
  });

  return (
    <>
      <StructuredData data={generateBreadcrumbStructuredData(breadcrumbItems)} />
      <StructuredData data={legalDocumentData} />
      <TermsPageClient locale={locale} />
    </>
  );
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

