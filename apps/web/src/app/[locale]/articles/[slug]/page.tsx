import React from 'react';
import { getArticleBySlug, getProducts } from '@/services/mockDb';
import ArticleDetailClient from './ArticleDetailClient';
import { notFound } from 'next/navigation';

async function ArticleDetail({ params }: { params: { locale: string; slug: string } }) {
  const article = await getArticleBySlug(params.slug);
  
  if (!article) {
    notFound();
  }

  let comparisonProducts: typeof article.relatedProductIds = [];
  if (article.relatedProductIds && article.relatedProductIds.length > 0) {
    const allProducts = await getProducts();
    comparisonProducts = allProducts.filter(p => article.relatedProductIds?.includes(p.id));
  }

  return <ArticleDetailClient article={article} comparisonProducts={comparisonProducts} />;
}

export default ArticleDetail;

