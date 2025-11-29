import React from 'react';
import { notFound } from 'next/navigation';

// This will be replaced with API call
async function getProductBySlug(slug: string, locale: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const response = await fetch(`${apiUrl}/api/products/${slug}?locale=${locale}`, {
    next: { revalidate: 3600 }, // Revalidate every hour
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

async function ProductDetail({ params }: { params: { locale: string; slug: string } }) {
  const product = await getProductBySlug(params.slug, params.locale);

  if (!product) {
    notFound();
  }

  // Redirect to the correct localized slug if needed
  const correctSlug = params.locale === 'pt-BR' ? product.slugPt : product.slugEn || product.slug;
  if (correctSlug !== params.slug) {
    // This will be handled by middleware or redirect
  }

  // Import and use ProductDetailClient
  const { default: ProductDetailClient } = await import('./ProductDetailClient');
  return <ProductDetailClient product={product} locale={params.locale} />;
}

export default ProductDetail;

