import React from 'react';
import { getProducts } from '@/services/mockDb';
import { getLatestArticles } from '@/services/api';
import HomeClient from './HomeClient';

async function Home({ params }: { params: { locale: string } }) {
  const products = await getProducts();
  const featuredProducts = products.filter(p => p.safetyScore > 95).slice(0, 3);

  // Fetch latest articles for carousel and blog section
  const latestArticles = await getLatestArticles(6, params.locale);
  const carouselArticles = latestArticles.slice(0, 3); // First 3 for carousel
  const blogArticles = latestArticles.slice(0, 6); // All 6 for blog list

  return (
    <HomeClient
      locale={params.locale}
      featuredProducts={featuredProducts}
      carouselArticles={carouselArticles}
      blogArticles={blogArticles}
    />
  );
}

// Enable static generation for better performance
export const revalidate = 3600; // Revalidate every hour

export default Home;
