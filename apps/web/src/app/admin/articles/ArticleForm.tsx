'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useToast } from '@/contexts/ToastContext';
import { adminArticles, type Article, type Category } from '@/services/admin';
import ArticleDetailClient from '@/app/[locale]/articles/[slug]/ArticleDetailClient';
import { I18nProvider } from '@/contexts/I18nContext';

const articleSchema = yup.object({
  title: yup.string().required('Title is required'),
  titleMenu: yup.string().optional(),
  slug: yup.string().required('Slug is required'),
  slugEn: yup.string().optional(),
  slugPt: yup.string().optional(),
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
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ArticleFormData>({
    resolver: yupResolver(articleSchema) as any,
    defaultValues: article
      ? {
          title: article.title || '',
          titleMenu: article.titleMenu || '',
          slug: article.slug || '',
          slugEn: article.slugEn || '',
          slugPt: article.slugPt || '',
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

  // Watch form values for preview - using watch() directly from useForm
  const watchedValues = watch();

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

  // Get category name for preview
  const selectedCategory = categories.find((cat) => cat.id === watchedValues.categoryId);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit' : 'Create'} Article</h2>
      <div className="grid grid-cols-2 gap-6">
        {/* Form Column */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
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
            <p className="text-xs text-slate-500 mt-1">
              Default/English slug (for backward compatibility)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Slug (English)
              <span className="text-slate-400 font-normal ml-2">(Optional)</span>
            </label>
            <input
              {...register('slugEn')}
              placeholder="English-specific slug"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                errors.slugEn ? 'border-red-300' : 'border-slate-300'
              }`}
            />
            {errors.slugEn && <p className="mt-1 text-sm text-red-600">{errors.slugEn.message}</p>}
            <p className="text-xs text-slate-500 mt-1">
              If provided, this slug will be used for English locale URLs
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Slug (Portuguese)
              <span className="text-slate-400 font-normal ml-2">(Optional)</span>
            </label>
            <input
              {...register('slugPt')}
              placeholder="Portuguese-specific slug"
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                errors.slugPt ? 'border-red-300' : 'border-slate-300'
              }`}
            />
            {errors.slugPt && <p className="mt-1 text-sm text-red-600">{errors.slugPt.message}</p>}
            <p className="text-xs text-slate-500 mt-1">
              If provided, this slug will be used for Portuguese locale URLs
            </p>
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

        {/* Preview Column */}
        <div className="space-y-6 sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
          {/* Article Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-900">Live Preview</h3>
              <p className="text-xs text-slate-500 mt-1">Real-time preview of how the article will appear</p>
            </div>

            <div className="overflow-y-auto bg-slate-50 max-h-[60vh]">
              {watchedValues.title ? (
                <I18nProvider>
                  <div className="transform scale-[0.65] origin-top-left w-[153.85%]">
                    <ArticleDetailClient
                      article={{
                        id: article?.id || 'preview',
                        title: watchedValues.title || '',
                        slug: watchedValues.slug || '',
                        excerpt: watchedValues.excerpt || '',
                        content: watchedValues.content || '',
                        imageUrl: watchedValues.imageUrl || undefined,
                        imageAlt: watchedValues.title || undefined,
                        date: watchedValues.date || new Date().toISOString(),
                        partnerTag: watchedValues.partnerTag || undefined,
                        locale: watchedValues.locale === 'pt_BR' ? 'pt-BR' : watchedValues.locale === 'en_US' ? 'en-US' : 'pt-BR',
                        category: selectedCategory ? {
                          id: selectedCategory.id,
                          name: selectedCategory.name,
                          slug: selectedCategory.slug,
                          slugEn: selectedCategory.slugEn,
                          slugPt: selectedCategory.slugPt,
                        } : undefined,
                      }}
                      locale={watchedValues.locale === 'pt_BR' ? 'pt-BR' : watchedValues.locale === 'en_US' ? 'en-US' : 'pt-BR'}
                      isComparison={selectedCategory?.name?.toLowerCase().includes('compar') ?? false}
                    />
                  </div>
                </I18nProvider>
              ) : (
                <div className="p-8 text-center text-slate-400">
                  <p className="text-sm">Start typing to see the preview</p>
                </div>
              )}
            </div>
          </div>

          {/* SEO Metadata Preview */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <h4 className="text-sm font-semibold text-slate-900 mb-3">SEO Metadata</h4>

            {/* Google Search Result Preview */}
            <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="text-xs text-slate-500 mb-1">
                {watchedValues.slug ? `https://example.com/${watchedValues.slug}` : 'https://example.com/article-slug'}
              </div>
              <div className="text-lg text-blue-600 hover:underline mb-1">
                {watchedValues.metaTitle || watchedValues.title || 'Article Title - GigSafeHub'}
              </div>
              <div className="text-sm text-slate-600 line-clamp-2">
                {watchedValues.metaDescription || watchedValues.excerpt || 'Article description will appear here...'}
              </div>
            </div>

            {/* Open Graph Preview */}
            <div className="mb-4">
              <h5 className="text-xs font-semibold text-slate-700 mb-2">Open Graph (Social Media)</h5>
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                {watchedValues.imageUrl && (
                  <div className="relative w-full h-32 bg-slate-100">
                    <img
                      src={watchedValues.imageUrl}
                      alt={watchedValues.metaTitle || watchedValues.title || 'Article'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="p-3 bg-white">
                  <div className="text-xs text-slate-500 mb-1">GigSafeHub</div>
                  <div className="text-sm font-semibold text-slate-900 mb-1">
                    {watchedValues.metaTitle || watchedValues.title || 'Article Title'}
                  </div>
                  <div className="text-xs text-slate-600 line-clamp-2">
                    {watchedValues.metaDescription || watchedValues.excerpt || 'Article description...'}
                  </div>
                </div>
              </div>
            </div>

            {/* Metadata Info */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Meta Title:</span>
                <span className="text-slate-700 font-medium">
                  {watchedValues.metaTitle ? '✓ Set' : '⚠ Missing'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Meta Description:</span>
                <span className="text-slate-700 font-medium">
                  {watchedValues.metaDescription ? '✓ Set' : '⚠ Missing'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Image:</span>
                <span className="text-slate-700 font-medium">
                  {watchedValues.imageUrl ? '✓ Set' : '⚠ Missing'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Category:</span>
                <span className="text-slate-700 font-medium">
                  {selectedCategory ? selectedCategory.name : '⚠ Not selected'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Locale:</span>
                <span className="text-slate-700 font-medium">{watchedValues.locale || 'Not set'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

