import React from 'react';
import { getProducts } from '@/services/mockDb';
import ComparisonClient from './ComparisonClient';

async function Comparison({ 
  params, 
  searchParams 
}: { 
  params: { locale: string };
  searchParams: { ids?: string };
}) {
  const allProducts = await getProducts();
  const ids = searchParams.ids?.split(',') || [];
  const products = ids.length > 0 
    ? allProducts.filter(p => ids.includes(p.id))
    : allProducts.slice(0, 2);

  return <ComparisonClient products={products} allProducts={allProducts} locale={params.locale} />;
}

export default Comparison;

