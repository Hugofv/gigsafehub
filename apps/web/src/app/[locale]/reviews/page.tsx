import React from 'react';
import { getProducts } from '@/services/mockDb';
import ReviewsClient from './ReviewsClient';

async function Reviews({ params }: { params: { locale: string } }) {
  const products = await getProducts();
  return <ReviewsClient products={products} locale={params.locale} />;
}

export default Reviews;

