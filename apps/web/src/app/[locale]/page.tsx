import React from 'react';
import { getProducts } from '@/services/mockDb';
import HomeClient from './HomeClient';

async function Home({ params }: { params: { locale: string } }) {
  const products = await getProducts();
  const featuredProducts = products.filter((p) => p.safetyScore > 95).slice(0, 3);

  return <HomeClient locale={params.locale} featuredProducts={featuredProducts} />;
}

export default Home;
