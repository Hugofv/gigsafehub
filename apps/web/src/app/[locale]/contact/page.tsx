import { Metadata } from 'next';
import { unstable_noStore as noStore } from 'next/cache';
import StructuredData, { generateBreadcrumbStructuredData, generateOrganizationStructuredData } from '@/components/StructuredData';
import ContactPageClient from './ContactPageClient';

interface ContactPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  noStore();
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gigsafehub.com';
  const title = locale === 'pt-BR'
    ? 'Contato | GigSafeHub - Entre em Contato Conosco'
    : 'Contact | GigSafeHub - Get in Touch';
  const description = locale === 'pt-BR'
    ? 'Entre em contato com o GigSafeHub. Tire suas dúvidas, envie sugestões ou solicite informações sobre seguros para trabalhadores da Gig Economy.'
    : 'Get in touch with GigSafeHub. Ask questions, send suggestions, or request information about insurance for Gig Economy workers.';
  const keywords = locale === 'pt-BR'
    ? 'contato gigsafehub, fale conosco, suporte, dúvidas, seguros gig economy'
    : 'contact gigsafehub, get in touch, support, questions, gig economy insurance';

  const pageUrl = `${baseUrl}/${locale}/contact`;
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
        'pt-BR': `${baseUrl}/pt-BR/contato`,
        'en-US': `${baseUrl}/en-US/contact`,
        'x-default': `${baseUrl}/en-US/contact`,
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

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gigsafehub.com';
  const pageUrl = `${baseUrl}/${locale}/contact`;

  const breadcrumbItems = [
    { name: locale === 'pt-BR' ? 'Início' : 'Home', url: `${baseUrl}/${locale}` },
    { name: locale === 'pt-BR' ? 'Contato' : 'Contact', url: pageUrl },
  ];

  const organizationData = generateOrganizationStructuredData();

  return (
    <>
      <StructuredData data={generateBreadcrumbStructuredData(breadcrumbItems)} />
      <StructuredData data={organizationData} />
      <ContactPageClient locale={locale} />
    </>
  );
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;
