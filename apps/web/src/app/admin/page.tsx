'use client';

import React, { useState, useEffect } from 'react';
import { getProducts, updateProduct, deleteProduct, createProduct, getArticles, createArticle, updateArticle, deleteArticle } from '@/services/mockDb';
import type { FinancialProduct, ProductCategory, Article, ContentLocale } from '@gigsafehub/types';
import { TRANSLATIONS } from '@/constants';

type Tab = 'products' | 'articles' | 'translations';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('products');
  
  // Data State
  const [products, setProducts] = useState<FinancialProduct[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Forms State
  const [productForm, setProductForm] = useState<Partial<FinancialProduct>>({});
  const [articleForm, setArticleForm] = useState<Partial<Article>>({});

  useEffect(() => {
    if (isAuthenticated) {
        refreshData();
    }
  }, [isAuthenticated]);

  const refreshData = () => {
      getProducts().then(setProducts);
      getArticles().then(setArticles);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') setIsAuthenticated(true);
    else alert('Wrong password (hint: admin123)');
  };

  // --- Product Handlers ---
  const handleProductEdit = (product: FinancialProduct) => {
      setEditingId(product.id);
      setProductForm(product);
  };
  const handleProductDelete = async (id: string) => {
      if(window.confirm('Delete this product?')) {
          await deleteProduct(id);
          refreshData();
      }
  };
  const handleProductSave = async (e: React.FormEvent) => {
      e.preventDefault();
      if (editingId) {
          await updateProduct(productForm as FinancialProduct);
      } else {
          const newProduct = {
              ...productForm,
              id: Date.now().toString(),
              logoUrl: 'https://picsum.photos/64/64',
              rating: 0,
              reviewsCount: 0,
              safetyScore: 80,
              pros: productForm.pros || [],
              cons: productForm.cons || [],
              features: []
          } as FinancialProduct;
          await createProduct(newProduct);
      }
      setEditingId(null);
      setProductForm({});
      refreshData();
  };

  // --- Article Handlers ---
  const handleArticleEdit = (article: Article) => {
    setEditingId(article.id);
    setArticleForm(article);
  };
  const handleArticleDelete = async (id: string) => {
      if(window.confirm('Delete this article?')) {
          await deleteArticle(id);
          refreshData();
      }
  };
  const handleArticleSave = async (e: React.FormEvent) => {
      e.preventDefault();
      if (editingId) {
          await updateArticle(articleForm as Article);
      } else {
          const newArticle = {
              ...articleForm,
              id: Date.now().toString(),
              date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              imageUrl: 'https://picsum.photos/800/400',
              relatedProductIds: []
          } as Article;
          await createArticle(newArticle);
      }
      setEditingId(null);
      setArticleForm({});
      refreshData();
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg mb-4"
          />
          <button type="submit" className="w-full bg-brand-600 text-white py-2 rounded-lg hover:bg-brand-700">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
        
        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 font-medium ${activeTab === 'products' ? 'border-b-2 border-brand-600 text-brand-600' : 'text-slate-600'}`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-4 py-2 font-medium ${activeTab === 'articles' ? 'border-b-2 border-brand-600 text-brand-600' : 'text-slate-600'}`}
          >
            Articles
          </button>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit' : 'Create'} Product</h2>
              <form onSubmit={handleProductSave} className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={productForm.name || ''}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  required
                />
                <select
                  value={productForm.category || ''}
                  onChange={(e) => setProductForm({...productForm, category: e.target.value as ProductCategory})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  required
                >
                  <option value="">Select Category</option>
                  {Object.values(ProductCategory).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <textarea
                  placeholder="Description"
                  value={productForm.description || ''}
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  required
                />
                <button type="submit" className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">
                  Save
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {setEditingId(null); setProductForm({});}}
                    className="ml-2 px-6 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400"
                  >
                    Cancel
                  </button>
                )}
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product.id} className="border-t border-slate-200">
                      <td className="px-4 py-3">{product.name}</td>
                      <td className="px-4 py-3">{product.category}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleProductEdit(product)}
                          className="text-brand-600 hover:text-brand-700 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleProductDelete(product.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Articles Tab */}
        {activeTab === 'articles' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit' : 'Create'} Article</h2>
              <form onSubmit={handleArticleSave} className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={articleForm.title || ''}
                  onChange={(e) => setArticleForm({...articleForm, title: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  required
                />
                <input
                  type="text"
                  placeholder="Slug"
                  value={articleForm.slug || ''}
                  onChange={(e) => setArticleForm({...articleForm, slug: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  required
                />
                <textarea
                  placeholder="Excerpt"
                  value={articleForm.excerpt || ''}
                  onChange={(e) => setArticleForm({...articleForm, excerpt: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  required
                />
                <textarea
                  placeholder="Content (HTML)"
                  value={articleForm.content || ''}
                  onChange={(e) => setArticleForm({...articleForm, content: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  rows={6}
                  required
                />
                <select
                  value={articleForm.locale || ''}
                  onChange={(e) => setArticleForm({...articleForm, locale: e.target.value as ContentLocale})}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                  required
                >
                  <option value="">Select Locale</option>
                  <option value="en-US">English</option>
                  <option value="pt-BR">Portuguese</option>
                  <option value="Both">Both</option>
                </select>
                <button type="submit" className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700">
                  Save
                </button>
                {editingId && (
                  <button
                    type="button"
                    onClick={() => {setEditingId(null); setArticleForm({});}}
                    className="ml-2 px-6 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400"
                  >
                    Cancel
                  </button>
                )}
              </form>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-4 py-3 text-left">Title</th>
                    <th className="px-4 py-3 text-left">Slug</th>
                    <th className="px-4 py-3 text-left">Locale</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map(article => (
                    <tr key={article.id} className="border-t border-slate-200">
                      <td className="px-4 py-3">{article.title}</td>
                      <td className="px-4 py-3">{article.slug}</td>
                      <td className="px-4 py-3">{article.locale}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleArticleEdit(article)}
                          className="text-brand-600 hover:text-brand-700 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleArticleDelete(article.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;

