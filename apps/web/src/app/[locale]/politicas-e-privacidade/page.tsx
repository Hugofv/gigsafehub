import { Metadata } from 'next';
import { unstable_noStore as noStore } from 'next/cache';
import StructuredData, { generateBreadcrumbStructuredData, generateLegalDocumentStructuredData } from '@/components/StructuredData';
import PrivacyPageClient from '@/components/legal/PrivacyPageClient';

interface PrivacyPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  noStore();
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const title = locale === 'pt-BR'
    ? 'Política de Privacidade | GigSafeHub - Proteção de Dados e Privacidade'
    : 'Privacy Policy | GigSafeHub - Data Protection & Privacy';
  const description = locale === 'pt-BR'
    ? 'Política de privacidade completa do GigSafeHub. Saiba como coletamos, usamos, armazenamos e protegemos suas informações pessoais. Conheça seus direitos de privacidade e proteção de dados.'
    : 'Complete GigSafeHub privacy policy. Learn how we collect, use, store, and protect your personal information. Understand your privacy rights and data protection.';
  const keywords = locale === 'pt-BR'
    ? 'política de privacidade, proteção de dados, LGPD, privacidade online, segurança de dados, informações pessoais, direitos de privacidade'
    : 'privacy policy, data protection, GDPR, online privacy, data security, personal information, privacy rights';

  const pageUrl = `${baseUrl}/${locale}/politicas-e-privacidade`;
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
        'pt-BR': `${baseUrl}/pt-BR/politicas-e-privacidade`,
        'en-US': `${baseUrl}/en-US/privacy-and-policies`,
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

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const pageUrl = `${baseUrl}/${locale}/politicas-e-privacidade`;
  const currentDate = new Date().toISOString();

  const breadcrumbItems = [
    { name: locale === 'pt-BR' ? 'Início' : 'Home', url: `${baseUrl}/${locale}` },
    { name: locale === 'pt-BR' ? 'Política de Privacidade' : 'Privacy Policy', url: pageUrl },
  ];

  const legalDocumentData = generateLegalDocumentStructuredData({
    name: locale === 'pt-BR' ? 'Política de Privacidade' : 'Privacy Policy',
    description: locale === 'pt-BR'
      ? 'Política de privacidade do GigSafeHub explicando como coletamos, usamos e protegemos suas informações pessoais.'
      : 'GigSafeHub privacy policy explaining how we collect, use, and protect your personal information.',
    url: pageUrl,
    datePublished: currentDate,
    dateModified: currentDate,
    locale,
  });

  return (
    <>
      <StructuredData data={generateBreadcrumbStructuredData(breadcrumbItems)} />
      <StructuredData data={legalDocumentData} />
      <PrivacyPageClient locale={locale} />
    </>
  );
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

