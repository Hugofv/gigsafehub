import React from 'react';
import { Metadata } from 'next';
import { unstable_noStore as noStore } from 'next/cache';
import { getProducts } from '@/services/mockDb';
import ComparisonClient from './ComparisonClient';

export async function generateMetadata({ params, searchParams }: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ ids?: string }>;
}): Promise<Metadata> {
  noStore(); // Prevent metadata streaming - ensures metadata is in <head> on reload
  const { locale } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const title = locale === 'pt-BR'
    ? 'Comparador de Seguros - GigSafeHub'
    : 'Insurance Comparator - GigSafeHub';
  const description = locale === 'pt-BR'
    ? 'Compare seguros lado a lado. Veja preços, coberturas, avaliações e escolha o melhor produto para suas necessidades na economia gig.'
    : 'Compare insurance products side by side. See prices, coverage, reviews and choose the best product for your gig economy needs.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `${baseUrl}/${locale}/compare`,
      siteName: 'GigSafeHub',
      locale: locale === 'pt-BR' ? 'pt_BR' : 'en_US',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/compare`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

async function Comparison({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ ids?: string }>;
}) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const allProducts = await getProducts();
  const ids = resolvedSearchParams.ids?.split(',') || [];
  const products = ids.length > 0
    ? allProducts.filter(p => ids.includes(p.id))
    : allProducts.slice(0, 2);

  return <ComparisonClient products={products} allProducts={allProducts} locale={locale} />;
}

// Force dynamic rendering to ensure metadata is always generated on reload
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Always revalidate

export default Comparison;
