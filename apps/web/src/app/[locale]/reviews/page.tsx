import React from 'react';
import { Metadata } from 'next';
import { unstable_noStore as noStore } from 'next/cache';
import { getProducts } from '@/services/mockDb';
import ReviewsClient from './ReviewsClient';

export async function generateMetadata({ params, searchParams }: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; type?: string; subcategory?: string }>;
}): Promise<Metadata> {
  noStore(); // Prevent metadata streaming - ensures metadata is in <head> on reload
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const title = locale === 'pt-BR'
    ? 'Avaliações de Seguros - GigSafeHub'
    : 'Insurance Reviews - GigSafeHub';
  const description = locale === 'pt-BR'
    ? 'Compare e avalie os melhores seguros para motoristas, entregadores e freelancers. Análises detalhadas, preços e recomendações especializadas.'
    : 'Compare and review the best insurance products for drivers, delivery workers and freelancers. Detailed reviews, pricing and specialized recommendations.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${baseUrl}/${locale}/reviews`,
      siteName: 'GigSafeHub',
      locale: locale === 'pt-BR' ? 'pt_BR' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/reviews`,
    },
  };
}

async function Reviews({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; type?: string; subcategory?: string }>;
}) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const products = await getProducts();
  return (
    <ReviewsClient
      products={products}
      locale={locale}
      initialCategory={resolvedSearchParams.category}
      initialType={resolvedSearchParams.type}
      initialSubcategory={resolvedSearchParams.subcategory}
    />
  );
}

// Force dynamic rendering to ensure metadata is always generated on reload
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Always revalidate

export default Reviews;

