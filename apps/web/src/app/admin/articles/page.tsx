'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { adminArticles, type Article, type SocialMediaPlatform } from '@/services/admin';

export default function ArticlesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const toast = useToast();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState<{ [key: string]: SocialMediaPlatform[] }>({});
  const [search, setSearch] = useState('');
  const [localeFilter, setLocaleFilter] = useState<'all' | 'en_US' | 'pt_BR' | 'Both'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'scheduled' | 'inactive'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const articlesData = await adminArticles.getAll();
      setArticles(articlesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const getArticleStatus = (article: Article): 'active' | 'scheduled' | 'inactive' => {
    const now = new Date();
    const articleDate = new Date(article.date as any);
    const isActiveFlag = article.robotsIndex ?? true;

    if (!isActiveFlag) {
      return 'inactive';
    }

    if (articleDate.getTime() > now.getTime()) {
      return 'scheduled';
    }

    return 'active';
  };

  const filteredArticles = useMemo(() => {
    let result = [...articles];

    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(term) ||
          a.slug.toLowerCase().includes(term) ||
          (a.category?.name?.toLowerCase().includes(term) ?? false)
      );
    }

    if (localeFilter !== 'all') {
      result = result.filter((a) => a.locale === localeFilter);
    }

    if (categoryFilter !== 'all') {
      result = result.filter((a) => a.categoryId === categoryFilter);
    }

    if (statusFilter !== 'all') {
      result = result.filter((a) => getArticleStatus(a) === statusFilter);
    }

    // Ordena por data (mais recentes primeiro) por padrão
    result.sort((a, b) => {
      const da = new Date(a.date as any).getTime();
      const db = new Date(b.date as any).getTime();
      return db - da;
    });

    return result;
  }, [articles, search, localeFilter, statusFilter, categoryFilter]);

  const categoryOptions = useMemo(() => {
    const map = new Map<string, string>();
    for (const article of articles) {
      if (article.categoryId && article.category?.name) {
        map.set(article.categoryId, article.category.name);
      }
    }
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [articles]);


  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this article?')) return;

    try {
      await adminArticles.delete(id);
      toast.success('Article deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting article:', error);
      toast.error('Failed to delete article');
    }
  };

  const handlePublishToSocialMedia = async (articleId: string, platform: SocialMediaPlatform) => {
    if (!window.confirm(`Publish this article to ${platform.charAt(0).toUpperCase() + platform.slice(1)}?`)) {
      return;
    }

    setPublishing((prev) => ({
      ...prev,
      [articleId]: [...(prev[articleId] || []), platform],
    }));

    try {
      const result = await adminArticles.publishToSocialMedia(articleId, {
        platforms: [platform],
      });

      const platformResult = result.results.find((r) => r.platform === platform);
      if (platformResult?.success) {
        toast.success(`Article published to ${platform.charAt(0).toUpperCase() + platform.slice(1)} successfully!`);
        // Reload articles to update the meta field
        fetchData();
      } else {
        toast.error(
          `Failed to publish to ${platform}: ${platformResult?.error || 'Unknown error'}`
        );
      }
    } catch (error: any) {
      console.error(`Error publishing to ${platform}:`, error);
      toast.error(`Failed to publish to ${platform}: ${error.message || 'Unknown error'}`);
    } finally {
      setPublishing((prev) => {
        const newState = { ...prev };
        if (newState[articleId]) {
          newState[articleId] = newState[articleId].filter((p) => p !== platform);
          if (newState[articleId].length === 0) {
            delete newState[articleId];
          }
        }
        return newState;
      });
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
        <Link
          href="/admin/articles/new"
          className="px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors font-medium"
        >
          + New Article
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Search</label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, slug or category"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Locale</label>
          <select
            value={localeFilter}
            onChange={(e) => setLocaleFilter(e.target.value as any)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          >
            <option value="all">All</option>
            <option value="en_US">English</option>
            <option value="pt_BR">Portuguese</option>
            <option value="Both">Both</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="scheduled">Scheduled</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-brand-500 focus:border-transparent"
          >
            <option value="all">All</option>
            {categoryOptions.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

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
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Social Media</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredArticles.map((article) => {
                const status = getArticleStatus(article);
                const articleDate = new Date(article.date as any);
                return (
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
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : status === 'scheduled'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {status === 'active'
                        ? 'Ativo'
                        : status === 'scheduled'
                        ? 'Agendado'
                        : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {articleDate.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {(() => {
                        const isPosted = article.meta?.socialMedia?.facebook?.postId;
                        const isPublishing = publishing[article.id]?.includes('facebook');
                        return (
                          <button
                            onClick={() => handlePublishToSocialMedia(article.id, 'facebook')}
                            disabled={isPublishing || !!isPosted}
                            className="px-3 py-1.5 text-xs font-medium text-white bg-[#1877F2] rounded-lg hover:bg-[#1565C0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                            title={isPosted ? 'Already posted to Facebook' : 'Publish to Facebook'}
                          >
                            {isPublishing ? (
                              <>
                                <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Publishing...
                              </>
                            ) : isPosted ? (
                              <>
                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                </svg>
                                Posted
                              </>
                            ) : (
                              <>
                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                </svg>
                                Facebook
                              </>
                            )}
                          </button>
                        );
                      })()}
                      {(() => {
                        const isPosted = article.meta?.socialMedia?.instagram?.postId;
                        const isPublishing = publishing[article.id]?.includes('instagram');
                        return (
                          <button
                            onClick={() => handlePublishToSocialMedia(article.id, 'instagram')}
                            disabled={isPublishing || !!isPosted}
                            className="px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg hover:from-purple-700 hover:to-pink-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                            title={isPosted ? 'Already posted to Instagram' : 'Publish to Instagram'}
                          >
                            {isPublishing ? (
                              <>
                                <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Publishing...
                              </>
                            ) : isPosted ? (
                              <>
                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                </svg>
                                Posted
                              </>
                            ) : (
                              <>
                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                                Instagram
                              </>
                            )}
                          </button>
                        );
                      })()}
                      {(() => {
                        const isPosted = article.meta?.socialMedia?.twitter?.postId;
                        const isPublishing = publishing[article.id]?.includes('twitter');
                        return (
                          <button
                            onClick={() => handlePublishToSocialMedia(article.id, 'twitter')}
                            disabled={isPublishing || !!isPosted}
                            className="px-3 py-1.5 text-xs font-medium text-white bg-[#1DA1F2] rounded-lg hover:bg-[#0d8bd9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                            title={isPosted ? 'Already posted to Twitter/X' : 'Publish to Twitter/X'}
                          >
                            {isPublishing ? (
                              <>
                                <svg className="animate-spin h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Publishing...
                              </>
                            ) : isPosted ? (
                              <>
                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                                </svg>
                                Posted
                              </>
                            ) : (
                              <>
                                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                                X
                              </>
                            )}
                          </button>
                        );
                      })()}
                    </div>
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
              );})}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

