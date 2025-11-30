'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useToast } from '@/contexts/ToastContext';
import { adminCategories, type Category } from '@/services/admin';

const categorySchema = yup.object({
  name: yup.string().required('Name is required'),
  slug: yup.string().required('Slug is required'),
  nameEn: yup.string().optional(),
  namePt: yup.string().optional(),
  slugEn: yup.string().optional(),
  slugPt: yup.string().optional(),
  description: yup.string().optional(),
  level: yup.number().required('Level is required').min(0, 'Level must be 0 or greater'),
  parentId: yup.string().nullable().optional(),
  order: yup.number().optional().min(0, 'Order must be 0 or greater'),
  country: yup.string().nullable().optional(),
  isActive: yup.boolean().optional(),
  icon: yup.string().optional(),
});

type CategoryFormData = yup.InferType<typeof categorySchema>;

interface CategoryFormProps {
  category?: Category;
  categories: Category[];
  onSuccess: () => void;
  onCancel: () => void;
}

export default function CategoryForm({ category, categories, onSuccess, onCancel }: CategoryFormProps) {
  const toast = useToast();
  const isEditing = !!category;

  // Filter out current category from parent options
  const availableParents = categories.filter((c) => !category || c.id !== category.id);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: yupResolver(categorySchema) as any,
    defaultValues: category
      ? {
          name: category.name || '',
          slug: category.slug || '',
          nameEn: category.nameEn || '',
          namePt: category.namePt || '',
          slugEn: category.slugEn || '',
          slugPt: category.slugPt || '',
          description: category.description || '',
          level: category.level || 0,
          parentId: category.parentId || null,
          order: category.order || 0,
          country: category.country || null,
          isActive: category.isActive ?? true,
          icon: category.icon || '',
        }
      : {
          level: 0,
          order: 0,
          isActive: true,
        },
  });

  const currentLevel = watch('level');
  const parentCategories = availableParents.filter((c) => c.level < (currentLevel || 0));

  const onSubmit = async (data: CategoryFormData) => {
    try {
      const formData: Partial<Category> = {
        ...data,
      };
      if (isEditing && category) {
        await adminCategories.update(category.id, formData);
        toast.success('Category updated successfully');
      } else {
        await adminCategories.create(formData);
        toast.success('Category created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save category');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
      <h2 className="text-xl font-bold mb-4">{isEditing ? 'Edit' : 'Create'} Category</h2>
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Name (English)</label>
            <input
              {...register('nameEn')}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name (Portuguese)</label>
            <input
              {...register('namePt')}
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

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea
            {...register('description')}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Level *</label>
            <input
              type="number"
              {...register('level', { valueAsNumber: true })}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
                errors.level ? 'border-red-300' : 'border-slate-300'
              }`}
              min={0}
            />
            {errors.level && <p className="mt-1 text-sm text-red-600">{errors.level.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Parent Category</label>
            <select
              {...register('parentId')}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            >
              <option value="">None (Root Category)</option>
              {parentCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} (Level {cat.level})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Order</label>
            <input
              type="number"
              {...register('order', { valueAsNumber: true })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              min={0}
            />
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

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register('isActive')}
              className="w-4 h-4 text-brand-600 border-slate-300 rounded focus:ring-brand-500"
            />
            <span className="text-sm font-medium text-slate-700">Active</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Icon</label>
          <input
            {...register('icon')}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            placeholder="📁 or icon class"
          />
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

