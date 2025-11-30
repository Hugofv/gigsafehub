'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { adminProducts, adminCategories, type Product, type Category } from '@/services/admin';
import ProductForm from '../../ProductForm';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { user, loading: authLoading } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (user && id) {
      fetchData();
    }
  }, [user, id]);

  const fetchData = async () => {
    try {
      const [productData, categoriesData] = await Promise.all([
        adminProducts.getById(id),
        adminCategories.getAll(),
      ]);
      setProduct(productData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
      router.push('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    router.push('/admin/products');
  };

  const handleCancel = () => {
    router.back();
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-slate-600">Product not found</p>
          <button
            onClick={() => router.push('/admin/products')}
            className="mt-4 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-slate-600 hover:text-slate-900 mb-4 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </button>
        <h1 className="text-3xl font-bold text-slate-900">Edit Product</h1>
      </div>

      <ProductForm
        product={product}
        categories={categories}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
}
