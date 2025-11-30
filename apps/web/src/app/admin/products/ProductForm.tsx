'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useToast } from '@/contexts/ToastContext';
import { adminProducts, type Product, type Category } from '@/services/admin';

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

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProductForm({ product, categories, onSuccess, onCancel }: ProductFormProps) {
  const toast = useToast();
  const isEditing = !!product;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: yupResolver(productSchema) as any,
    defaultValues: product
      ? {
          name: product.name || '',
          slug: product.slug || '',
          categoryId: product.categoryId || '',
          country: product.country || null,
          description: product.description || '',
          rating: product.rating || 0,
          reviewsCount: product.reviewsCount || 0,
          safetyScore: product.safetyScore || 0,
          fees: product.fees || '',
          affiliateLink: product.affiliateLink || '',
          logoUrl: product.logoUrl || '',
          logoAlt: product.logoAlt || '',
          slugEn: product.slugEn || '',
          slugPt: product.slugPt || '',
          robotsIndex: product.robotsIndex ?? true,
          robotsFollow: product.robotsFollow ?? true,
        }
      : {
          rating: 0,
          reviewsCount: 0,
          safetyScore: 0,
          robotsIndex: true,
          robotsFollow: true,
        },
  });

  const onSubmit = async (data: ProductFormData) => {
    try {
      const formData: Partial<Product> = {
        ...data,
      };
      if (isEditing && product) {
        await adminProducts.update(product.id, formData);
        toast.success('Product updated successfully');
      } else {
        await adminProducts.create(formData);
        toast.success('Product created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save product');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
      <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit' : 'Create'} Product</h2>
      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
            <input
              {...register('name')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                errors.name ? 'border-red-300' : 'border-slate-300'
              }`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Slug *</label>
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Country</label>
            <input
              {...register('country')}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              placeholder="BR, US, etc."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Reviews Count</label>
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Safety Score</label>
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Fees *</label>
            <input
              {...register('fees')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                errors.fees ? 'border-red-300' : 'border-slate-300'
              }`}
            />
            {errors.fees && <p className="mt-1 text-sm text-red-600">{errors.fees.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Affiliate Link *</label>
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Logo URL *</label>
            <input
              {...register('logoUrl')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                errors.logoUrl ? 'border-red-300' : 'border-slate-300'
              }`}
            />
            {errors.logoUrl && <p className="mt-1 text-sm text-red-600">{errors.logoUrl.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Logo Alt Text</label>
            <input
              {...register('logoAlt')}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Slug (English)</label>
            <input
              {...register('slugEn')}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Slug (Portuguese)</label>
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

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Update' : 'Create'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

