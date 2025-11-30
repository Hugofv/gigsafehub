'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { adminArticles, adminCategories, type Article, type Category } from '@/services/admin';

export default function ArticlesPage() {
  const { user, loading: authLoading } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Article>>({});
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [articlesData, categoriesData] = await Promise.all([
        adminArticles.getAll(),
        adminCategories.getAll(),
      ]);
      setArticles(articlesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;

    try {
      await adminArticles.delete(id);
      fetchData();
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('Failed to delete article');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await adminArticles.update(editingId, formData);
      } else {
        await adminArticles.create(formData);
      }
      setShowForm(false);
      setEditingId(null);
      setFormData({});
      fetchData();
    } catch (error) {
      console.error('Error saving article:', error);
      alert(error instanceof Error ? error.message : 'Failed to save article');
    }
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
          <h1 className="text-3xl font-bold text-slate-900">Articles</h1>
          <p className="text-slate-600 mt-2">Manage blog articles and content</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
            setFormData({
              locale: 'Both',
              articleType: 'blog',
              date: new Date().toISOString().split('T')[0],
            });
          }}
          className="px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium"
        >
          + New Article
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit' : 'Create'} Article</h2>
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
              <label className="block text-sm font-medium text-slate-700 mb-1">Excerpt *</label>
              <textarea
                value={formData.excerpt || ''}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Content *</label>
              <textarea
                value={formData.content || ''}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg font-mono text-sm"
                rows={10}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select
                  value={formData.categoryId || ''}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value || null })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
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
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date *</label>
                <input
                  type="date"
                  value={formData.date as string || ''}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Partner Tag *</label>
                <input
                  type="text"
                  value={formData.partnerTag || ''}
                  onChange={(e) => setFormData({ ...formData, partnerTag: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Image URL *</label>
                <input
                  type="text"
                  value={formData.imageUrl || ''}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>
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

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Menu Settings</h3>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.showInMenu || false}
                  onChange={(e) => setFormData({ ...formData, showInMenu: e.target.checked })}
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
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Locale</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-slate-900">{article.title}</div>
                    <div className="text-sm text-slate-500">{article.slug}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {article.category?.name || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{article.locale}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {typeof article.date === 'string' ? article.date : new Date(article.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <Link
                      href={`/admin/articles/${article.id}/edit`}
                      className="text-brand-600 hover:text-brand-700 mr-4 font-medium"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(article.id)}
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

