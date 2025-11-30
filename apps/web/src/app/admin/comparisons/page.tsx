'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import {
  adminComparisons,
  adminCategories,
  adminProducts,
  type Comparison,
  type Category,
  type Product,
} from '@/services/admin';

export default function ComparisonsPage() {
  const { user, loading: authLoading } = useAuth();
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Comparison>>({});
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [comparisonsData, categoriesData, productsData] = await Promise.all([
        adminComparisons.getAll(),
        adminCategories.getAll(),
        adminProducts.getAll(),
      ]);
      setComparisons(comparisonsData);
      setCategories(categoriesData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this comparison?')) return;

    try {
      await adminComparisons.delete(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting comparison:', error);
      alert('Failed to delete comparison');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await adminComparisons.update(editingId, formData);
      } else {
        await adminComparisons.create(formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({});
      fetchData();
    } catch (error) {
      console.error('Error saving comparison:', error);
      alert(error instanceof Error ? error.message : 'Failed to save comparison');
    }
  };

  const toggleProduct = (productId: string) => {
    const currentIds = formData.productIds || [];
    const newIds = currentIds.includes(productId)
      ? currentIds.filter((id) => id !== productId)
      : [...currentIds, productId];
    setFormData({ ...formData, productIds: newIds });
  };

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Comparisons</h1>
          <p className="text-slate-600 mt-2">Manage product comparison pages</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({
              locale: 'Both',
              productIds: [],
            });
          }}
          className="px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium"
        >
          + New Comparison
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit' : 'Create'} Comparison</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Slug *</label>
                <input
                  type="text"
                  value={formData.slug || ''}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
                <select
                  value={formData.categoryId || ''}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  required
                >
                  <option value="">Select Category</option>
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
                  value={formData.locale || 'Both'}
                  onChange={(e) => setFormData({ ...formData, locale: e.target.value as any })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  required
                >
                  <option value="en_US">English</option>
                  <option value="pt_BR">Portuguese</option>
                  <option value="Both">Both</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Products to Compare *</label>
              <div className="border border-slate-300 rounded-lg p-4 max-h-60 overflow-y-auto">
                {products.length === 0 ? (
                  <p className="text-sm text-slate-500">No products available</p>
                ) : (
                  <div className="space-y-2">
                    {products.map((product) => (
                      <label key={product.id} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.productIds?.includes(product.id) || false}
                          onChange={() => toggleProduct(product.id)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-slate-700">{product.name}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Selected: {formData.productIds?.length || 0} products
              </p>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">SEO Fields</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Meta Title</label>
                  <input
                    type="text"
                    value={formData.metaTitle || ''}
                    onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Meta Description</label>
                  <textarea
                    value={formData.metaDescription || ''}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
              >
                {editingId ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({});
                }}
                className="px-6 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Products</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Locale</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {comparisons.map((comparison) => (
                <tr key={comparison.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{comparison.title}</div>
                    <div className="text-sm text-slate-500">{comparison.slug}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {comparison.category?.name || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {comparison.productIds.length} products
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{comparison.locale}</td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <Link
                      href={`/admin/comparisons/${comparison.id}/edit`}
                      className="text-brand-600 hover:text-brand-700 mr-4 font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(comparison.id)}
                      className="text-red-600 hover:text-red-700 ml-4"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

