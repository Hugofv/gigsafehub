import React from 'react';
import { getProducts } from '@/services/mockDb';
import ReviewsClient from './ReviewsClient';

async function Reviews({
  params,
  searchParams
}: {
  params: { locale: string };
  searchParams: { category?: string; type?: string; subcategory?: string };
}) {
  const products = await getProducts();
  return (
    <ReviewsClient
      products={products}
      locale={params.locale}
      initialCategory={searchParams.category}
      initialType={searchParams.type}
      initialSubcategory={searchParams.subcategory}
    />
  );
}

export default Reviews;

