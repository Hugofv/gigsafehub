'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useToast } from '@/contexts/ToastContext';
import { adminArticles, type Article, type Category } from '@/services/admin';

const articleSchema = yup.object({
  title: yup.string().required('Title is required'),
  titleMenu: yup.string().optional(),
  slug: yup.string().required('Slug is required'),
  excerpt: yup.string().required('Excerpt is required'),
  content: yup.string().required('Content is required'),
  categoryId: yup.string().nullable().optional(),
  locale: yup.string().oneOf(['en_US', 'pt_BR', 'Both']).required('Locale is required'),
  date: yup.string().required('Date is required'),
  partnerTag: yup.string().required('Partner tag is required'),
  imageUrl: yup.string().required('Image URL is required'),
  metaTitle: yup.string().optional(),
  metaDescription: yup.string().optional(),
  showInMenu: yup.boolean().optional().default(false),
});

type ArticleFormData = yup.InferType<typeof articleSchema>;

interface ArticleFormProps {
  article?: Article;
  categories: Category[];
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ArticleForm({ article, categories, onSuccess, onCancel }: ArticleFormProps) {
  const toast = useToast();
  const isEditing = !!article;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ArticleFormData>({
    resolver: yupResolver(articleSchema) as any,
    defaultValues: article
      ? {
          title: article.title || '',
          titleMenu: article.titleMenu || '',
          slug: article.slug || '',
          excerpt: article.excerpt || '',
          content: article.content || '',
          categoryId: article.categoryId || null,
          locale: article.locale || 'Both',
          date: typeof article.date === 'string' ? article.date.split('T')[0] : new Date(article.date).toISOString().split('T')[0],
          partnerTag: article.partnerTag || '',
          imageUrl: article.imageUrl || '',
          metaTitle: article.metaTitle || '',
          metaDescription: article.metaDescription || '',
          showInMenu: article.showInMenu || false,
        }
      : {
          locale: 'Both',
          date: new Date().toISOString().split('T')[0],
          showInMenu: false,
        },
  });

  const onSubmit = async (data: ArticleFormData) => {
    try {
      const formData: Partial<Article> = {
        ...data,
        locale: data.locale as 'en_US' | 'pt_BR' | 'Both',
      };
      if (isEditing && article) {
        await adminArticles.update(article.id, formData);
        toast.success('Article updated successfully');
      } else {
        await adminArticles.create(formData);
        toast.success('Article created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving article:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save article');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
      <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit' : 'Create'} Article</h2>
      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
            <input
              {...register('title')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                errors.title ? 'border-red-300' : 'border-slate-300'
              }`}
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
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

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Title (Menu)
            <span className="text-slate-400 font-normal ml-2">(Optional)</span>
          </label>
          <input
            {...register('titleMenu')}
            placeholder="Different title to display in navigation menu"
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
              errors.titleMenu ? 'border-red-300' : 'border-slate-300'
            }`}
          />
          {errors.titleMenu && <p className="mt-1 text-sm text-red-600">{errors.titleMenu.message}</p>}
          <p className="text-xs text-slate-500 mt-1">
            If provided, this title will be used in navigation menus instead of the main title
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Excerpt *</label>
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
          <label className="block text-sm font-medium text-slate-700 mb-1">Content *</label>
          <textarea
            {...register('content')}
            className={`w-full px-4 py-2 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
              errors.content ? 'border-red-300' : 'border-slate-300'
            }`}
            rows={10}
          />
          {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
            <select
              {...register('categoryId')}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            >
              <option value="">None</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Locale *</label>
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Date *</label>
            <input
              type="date"
              {...register('date')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                errors.date ? 'border-red-300' : 'border-slate-300'
              }`}
            />
            {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Partner Tag *</label>
            <input
              {...register('partnerTag')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                errors.partnerTag ? 'border-red-300' : 'border-slate-300'
              }`}
            />
            {errors.partnerTag && <p className="mt-1 text-sm text-red-600">{errors.partnerTag.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Image URL *</label>
            <input
              {...register('imageUrl')}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                errors.imageUrl ? 'border-red-300' : 'border-slate-300'
              }`}
            />
            {errors.imageUrl && <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>}
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3">SEO Fields</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Meta Title</label>
              <input
                {...register('metaTitle')}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description</label>
              <textarea
                {...register('metaDescription')}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                rows={2}
              />
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-semibold mb-3">Menu Settings</h3>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register('showInMenu')}
              className="w-4 h-4 text-brand-600 border-slate-300 rounded focus:ring-brand-500"
            />
            <label className="text-sm font-medium text-slate-700">
              Show in Navigation Menu
            </label>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            When enabled, this article will appear in the navigation menu (e.g., Guides menu)
          </p>
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

