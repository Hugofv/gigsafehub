'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { adminProducts, adminCategories, type Product, type Category } from '@/services/admin';

const productSchema = yup.object({
  name: yup.string().required('Name is required'),
  slug: yup.string().required('Slug is required'),
  categoryId: yup.string().required('Category is required'),
  country: yup.string().nullable().optional(),
  description: yup.string().required('Description is required'),
  rating: yup.number().optional().min(0, 'Rating must be 0 or greater').max(5, 'Rating must be 5 or less'),
  reviewsCount: yup.number().optional().min(0, 'Reviews count must be 0 or greater'),
  safetyScore: yup.number().optional().min(0, 'Safety score must be 0 or greater').max(100, 'Safety score must be 100 or less'),
  fees: yup.string().required('Fees is required'),
  affiliateLink: yup.string().url('Must be a valid URL').required('Affiliate link is required'),
  logoUrl: yup
    .string()
    .required('Logo URL is required')
    .test('is-url-or-path', 'Must be a valid URL or relative path (starting with /)', (value) => {
      if (!value) return false;
      // Accept full URLs (http://, https://)
      if (value.startsWith('http://') || value.startsWith('https://')) {
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      }
      // Accept relative paths starting with /
      if (value.startsWith('/')) {
        return true;
      }
      return false;
    }),
  logoAlt: yup.string().optional(),
  slugEn: yup.string().optional(),
  slugPt: yup.string().optional(),
  robotsIndex: yup.boolean().optional(),
  robotsFollow: yup.boolean().optional(),
});

type ProductFormData = yup.InferType<typeof productSchema>;

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { user, loading: authLoading } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(productSchema) as any,
    defaultValues: {
      name: '',
      slug: '',
      categoryId: '',
      country: null,
      description: '',
      rating: 0,
      reviewsCount: 0,
      safetyScore: 0,
      fees: '',
      affiliateLink: '',
      logoUrl: '',
      logoAlt: '',
      slugEn: '',
      slugPt: '',
      robotsIndex: true,
      robotsFollow: true,
    },
  });

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
      setCategories(categoriesData);
      reset({
        name: productData.name || '',
        slug: productData.slug || '',
        categoryId: productData.categoryId || '',
        country: productData.country || null,
        description: productData.description || '',
        rating: productData.rating || 0,
        reviewsCount: productData.reviewsCount || 0,
        safetyScore: productData.safetyScore || 0,
        fees: productData.fees || '',
        affiliateLink: productData.affiliateLink || '',
        logoUrl: productData.logoUrl || '',
        logoAlt: productData.logoAlt || '',
        slugEn: productData.slugEn || '',
        slugPt: productData.slugPt || '',
        robotsIndex: productData.robotsIndex ?? true,
        robotsFollow: productData.robotsFollow ?? true,
      } as any);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Failed to load product');
      router.push('/admin/products');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setSaving(true);

    try {
      await adminProducts.update(id, data);
      router.push('/admin/products');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product');
    } finally {
      setSaving(false);
    }
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

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Name *</label>
              <input
                {...register('name')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-slate-300'
                }`}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Slug *</label>
              <input
                {...register('slug')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                  errors.slug ? 'border-red-300' : 'border-slate-300'
                }`}
              />
              {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category *</label>
              <select
                {...register('categoryId')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                  errors.categoryId ? 'border-red-300' : 'border-slate-300'
                }`}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Country</label>
              <input
                {...register('country')}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                placeholder="BR, US, etc."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
            <textarea
              {...register('description')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                errors.description ? 'border-red-300' : 'border-slate-300'
              }`}
              rows={4}
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
              <input
                type="number"
                step="0.1"
                {...register('rating', { valueAsNumber: true })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                  errors.rating ? 'border-red-300' : 'border-slate-300'
                }`}
                min={0}
                max={5}
              />
              {errors.rating && <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Reviews Count</label>
              <input
                type="number"
                {...register('reviewsCount', { valueAsNumber: true })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                  errors.reviewsCount ? 'border-red-300' : 'border-slate-300'
                }`}
                min={0}
              />
              {errors.reviewsCount && <p className="mt-1 text-sm text-red-600">{errors.reviewsCount.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Safety Score</label>
              <input
                type="number"
                {...register('safetyScore', { valueAsNumber: true })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                  errors.safetyScore ? 'border-red-300' : 'border-slate-300'
                }`}
                min={0}
                max={100}
              />
              {errors.safetyScore && <p className="mt-1 text-sm text-red-600">{errors.safetyScore.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Fees *</label>
              <input
                {...register('fees')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                  errors.fees ? 'border-red-300' : 'border-slate-300'
                }`}
              />
              {errors.fees && <p className="mt-1 text-sm text-red-600">{errors.fees.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Affiliate Link *</label>
              <input
                type="url"
                {...register('affiliateLink')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                  errors.affiliateLink ? 'border-red-300' : 'border-slate-300'
                }`}
              />
              {errors.affiliateLink && <p className="mt-1 text-sm text-red-600">{errors.affiliateLink.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Logo URL *</label>
              <input
                type="url"
                {...register('logoUrl')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                  errors.logoUrl ? 'border-red-300' : 'border-slate-300'
                }`}
              />
              {errors.logoUrl && <p className="mt-1 text-sm text-red-600">{errors.logoUrl.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Logo Alt Text</label>
              <input
                {...register('logoAlt')}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Slug (English)</label>
              <input
                {...register('slugEn')}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Slug (Portuguese)</label>
              <input
                {...register('slugPt')}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register('robotsIndex')}
                className="w-4 h-4 text-brand-600 border-slate-300 rounded focus:ring-brand-500"
              />
              <span className="text-sm font-medium text-slate-700">Robots Index</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register('robotsFollow')}
                className="w-4 h-4 text-brand-600 border-slate-300 rounded focus:ring-brand-500"
              />
              <span className="text-sm font-medium text-slate-700">Robots Follow</span>
            </label>
          </div>

          <div className="flex gap-4 pt-4 border-t border-slate-200">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-brand-600 text-white rounded-lg font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
