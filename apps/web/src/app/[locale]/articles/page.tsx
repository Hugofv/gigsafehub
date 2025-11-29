import React from 'react';
import { getArticles } from '@/services/mockDb';
import ArticlesClient from './ArticlesClient';
import type { Locale } from '@gigsafehub/types';

async function Articles({ params }: { params: { locale: string } }) {
  const articles = await getArticles();
  const locale = params.locale as Locale;
  
  // Filter articles by locale
  const filteredArticles = articles.filter(
    (a) => a.locale === 'Both' || a.locale === locale
  );

  return <ArticlesClient articles={filteredArticles} locale={params.locale} />;
}

export default Articles;

