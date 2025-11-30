'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '@/contexts/AuthContext';
import { adminGuides, adminCategories, type Guide, type Category } from '@/services/admin';

const guideSchema = yup.object({
  title: yup.string().required('Title is required'),
  slug: yup.string().required('Slug is required'),
  excerpt: yup.string().required('Excerpt is required'),
  content: yup.string().required('Content is required'),
  categoryId: yup.string().required('Category is required'),
  locale: yup.string().oneOf(['en_US', 'pt_BR', 'Both']).required('Locale is required'),
  imageUrl: yup.string().url('Must be a valid URL').nullable().optional(),
  imageAlt: yup.string().optional(),
  slugEn: yup.string().optional(),
  slugPt: yup.string().optional(),
  metaTitle: yup.string().optional(),
  metaDescription: yup.string().optional(),
});

type GuideFormData = yup.InferType<typeof guideSchema>;

export default function EditGuidePage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(guideSchema) as any,
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      categoryId: '',
      locale: 'Both',
      imageUrl: null,
      imageAlt: '',
      slugEn: '',
      slugPt: '',
      metaTitle: '',
      metaDescription: '',
    },
  });

  useEffect(() => {
    if (user && id) {
      fetchData();
    }
  }, [user, id]);

  const fetchData = async () => {
    try {
      const [guideData, categoriesData] = await Promise.all([
        adminGuides.getById(id),
        adminCategories.getAll(),
      ]);
      setCategories(categoriesData);
      reset({
        title: guideData.title || '',
        slug: guideData.slug || '',
        excerpt: guideData.excerpt || '',
        content: guideData.content || '',
        categoryId: guideData.categoryId || '',
        locale: guideData.locale || 'Both',
        imageUrl: guideData.imageUrl || null,
        imageAlt: guideData.imageAlt || '',
        slugEn: guideData.slugEn || '',
        slugPt: guideData.slugPt || '',
        metaTitle: guideData.metaTitle || '',
        metaDescription: guideData.metaDescription || '',
      } as any);
    } catch (error) {
      console.error('Error fetching guide:', error);
      alert('Failed to load guide');
      router.push('/admin/guides');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setSaving(true);

    try {
      await adminGuides.update(id, data);
      router.push('/admin/guides');
    } catch (error) {
      console.error('Error updating guide:', error);
      alert('Failed to update guide');
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
          Back to Guides
        </button>
        <h1 className="text-3xl font-bold text-slate-900">Edit Guide</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Title *</label>
              <input
                {...register('title')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                  errors.title ? 'border-red-300' : 'border-slate-300'
                }`}
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
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

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Excerpt *</label>
            <textarea
              {...register('excerpt')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                errors.excerpt ? 'border-red-300' : 'border-slate-300'
              }`}
              rows={3}
            />
            {errors.excerpt && <p className="mt-1 text-sm text-red-600">{errors.excerpt.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Content *</label>
            <textarea
              {...register('content')}
              className={`w-full px-4 py-2 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                errors.content ? 'border-red-300' : 'border-slate-300'
              }`}
              rows={15}
            />
            {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
          </div>

          <div className="grid grid-cols-3 gap-4">
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
              <label className="block text-sm font-medium text-slate-700 mb-2">Locale *</label>
              <select
                {...register('locale')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                  errors.locale ? 'border-red-300' : 'border-slate-300'
                }`}
              >
                <option value="en_US">English</option>
                <option value="pt_BR">Portuguese</option>
                <option value="Both">Both</option>
              </select>
              {errors.locale && <p className="mt-1 text-sm text-red-600">{errors.locale.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Image URL</label>
              <input
                type="url"
                {...register('imageUrl')}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                  errors.imageUrl ? 'border-red-300' : 'border-slate-300'
                }`}
              />
              {errors.imageUrl && <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>}
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

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3 text-slate-900">SEO Fields</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Meta Title</label>
                <input
                  {...register('metaTitle')}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Meta Description</label>
                <textarea
                  {...register('metaDescription')}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                  rows={2}
                />
              </div>
            </div>
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
