import { Metadata } from 'next';
import { unstable_noStore as noStore } from 'next/cache';
import StructuredData, { generateBreadcrumbStructuredData, generateOrganizationStructuredData } from '@/components/StructuredData';
import AboutPageClient from '@/components/about/AboutPageClient';

interface AboutPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  noStore();
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const title = locale === 'pt-BR'
    ? 'Sobre Nós | GigSafeHub - Nossa Missão e Valores'
    : 'About Us | GigSafeHub - Our Mission and Values';
  const description = locale === 'pt-BR'
    ? 'Conheça o GigSafeHub: nossa missão de capacitar e proteger trabalhadores da Gig Economy através de informação clara, comparações imparciais e recomendações práticas de seguros.'
    : 'Learn about GigSafeHub: our mission to empower and protect Gig Economy workers through clear information, impartial comparisons, and practical insurance recommendations.';
  const keywords = locale === 'pt-BR'
    ? 'sobre gigsafehub, missão, valores, gig economy, seguros para freelancers, comparação de seguros, insurtech'
    : 'about gigsafehub, mission, values, gig economy, insurance for freelancers, insurance comparison, insurtech';

  const pageUrl = `${baseUrl}/${locale}/sobre-nos`;
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
        'pt-BR': `${baseUrl}/pt-BR/sobre-nos`,
        'en-US': `${baseUrl}/en-US/about`,
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

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const pageUrl = `${baseUrl}/${locale}/sobre-nos`;
  const currentDate = new Date().toISOString();

  const breadcrumbItems = [
    { name: locale === 'pt-BR' ? 'Início' : 'Home', url: `${baseUrl}/${locale}` },
    { name: locale === 'pt-BR' ? 'Sobre Nós' : 'About Us', url: pageUrl },
  ];

  const organizationData = generateOrganizationStructuredData();

  return (
    <>
      <StructuredData data={generateBreadcrumbStructuredData(breadcrumbItems)} />
      <StructuredData data={organizationData} />
      <AboutPageClient locale={locale} />
    </>
  );
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

