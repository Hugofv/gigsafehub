import React from 'react';
import { getProductById, getProducts } from '@/services/mockDb';
import ProductDetailClient from './ProductDetailClient';
import { notFound } from 'next/navigation';

async function ProductDetail({ params }: { params: { locale: string; id: string } }) {
  const product = await getProductById(params.id);
  
  if (!product) {
    notFound();
  }

  return <ProductDetailClient product={product} />;
}

export default ProductDetail;

