import { Metadata } from 'next';
import StructuredData, { generateFAQStructuredData, generateBreadcrumbStructuredData, generateOrganizationStructuredData } from '@/components/StructuredData';
import FAQClient from './FAQClient';
import { faqData } from './faqData';

interface FAQPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export async function generateMetadata({ params }: FAQPageProps): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gigsafehub.com';
  const title = locale === 'pt-BR'
    ? 'Perguntas Frequentes | GigSafeHub - FAQ'
    : 'Frequently Asked Questions | GigSafeHub - FAQ';
  const description = locale === 'pt-BR'
    ? 'Encontre respostas para as dúvidas mais comuns sobre seguros para trabalhadores da gig economy. Tire suas dúvidas sobre coberturas, preços e mais.'
    : 'Find answers to the most common questions about insurance for gig economy workers. Get answers about coverage, pricing, and more.';
  const keywords = locale === 'pt-BR'
    ? 'perguntas frequentes, FAQ, dúvidas seguros, gig economy, seguros motoristas'
    : 'frequently asked questions, FAQ, insurance questions, gig economy, driver insurance';

  const pageUrl = `${baseUrl}/${locale}/faq`;
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
        'pt-BR': `${baseUrl}/pt-BR/faq`,
        'en-US': `${baseUrl}/en-US/faq`,
        'x-default': `${baseUrl}/en-US/faq`,
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

export default async function FAQPage({ params }: FAQPageProps) {
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://gigsafehub.com';
  const pageUrl = `${baseUrl}/${locale}/faq`;

  // Get FAQs from static data
  const faqs = faqData[locale] || faqData['en-US'];

  // Generate structured data for FAQs
  const faqStructuredData = generateFAQStructuredData(
    faqs.map(faq => ({
      question: faq.question,
      answer: faq.answer,
    }))
  );

  const breadcrumbItems = [
    { name: locale === 'pt-BR' ? 'Início' : 'Home', url: `${baseUrl}/${locale}` },
    { name: locale === 'pt-BR' ? 'Perguntas Frequentes' : 'FAQ', url: pageUrl },
  ];

  const organizationData = generateOrganizationStructuredData();

  return (
    <>
      <StructuredData data={faqStructuredData} />
      <StructuredData data={generateBreadcrumbStructuredData(breadcrumbItems)} />
      <StructuredData data={organizationData} />
      <FAQClient faqs={faqs} locale={locale} />
    </>
  );
}


