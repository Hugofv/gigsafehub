import React from 'react';
import { notFound } from 'next/navigation';

async function getArticleBySlug(slug: string, locale: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const response = await fetch(`${apiUrl}/api/articles/${slug}?locale=${locale}`, {
    next: { revalidate: 3600 }, // Revalidate every hour
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

async function getProducts() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
  const response = await fetch(`${apiUrl}/api/products`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    return [];
  }

  return response.json();
}

async function ArticleDetail({ params }: { params: { locale: string; slug: string } }) {
  const article = await getArticleBySlug(params.slug, params.locale);

  if (!article) {
    notFound();
  }

  // Redirect to the correct localized slug if needed
  const correctSlug = params.locale === 'pt-BR' ? article.slugPt : article.slugEn || article.slug;
  if (correctSlug !== params.slug) {
    // This will be handled by middleware or redirect
  }

  let comparisonProducts: any[] = [];
  if (article.relatedProductIds && article.relatedProductIds.length > 0) {
    const allProducts = await getProducts();
    comparisonProducts = allProducts.filter((p: any) => article.relatedProductIds?.includes(p.id));
  }

  const { default: ArticleDetailClient } = await import('./ArticleDetailClient');
  return <ArticleDetailClient article={article} comparisonProducts={comparisonProducts} locale={params.locale} />;
}

export default ArticleDetail;

