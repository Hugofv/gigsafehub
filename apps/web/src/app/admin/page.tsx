'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { adminStats, type DashboardStats } from '@/services/admin';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    categories: 0,
    products: 0,
    articles: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const data = await adminStats.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Categories',
      value: stats.categories,
      icon: '📁',
      href: '/admin/categories',
      color: 'bg-blue-500',
    },
    {
      title: 'Products',
      value: stats.products,
      icon: '🛍️',
      href: '/admin/products',
      color: 'bg-green-500',
    },
    {
      title: 'Articles',
      value: stats.articles,
      icon: '📝',
      href: '/admin/articles',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-2">Welcome back, {user.name || user.email}!</p>
      </div>

      {loadingStats ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat) => (
            <Link
              key={stat.title}
              href={stat.href}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-2xl`}>
                  {stat.icon}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/admin/categories/new"
            className="px-4 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-center font-medium"
          >
            + New Category
          </Link>
          <Link
            href="/admin/products/new"
            className="px-4 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-center font-medium"
          >
            + New Product
          </Link>
          <Link
            href="/admin/articles/new"
            className="px-4 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-center font-medium"
          >
            + New Article
          </Link>
        </div>
      </div>
    </div>
  );
}
