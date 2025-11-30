'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, LayoutDashboard, Folder, ShoppingBag, FileText } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Public routes that don't need authentication
  const publicRoutes = ['/admin/login', '/admin/register'];
  const isPublicRoute = pathname && publicRoutes.includes(pathname);

  // If it's a public route, render children without layout
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // For protected routes, show loading or redirect
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // AuthContext will redirect
  }

  const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/categories', label: 'Categories', icon: Folder },
    { href: '/admin/products', label: 'Products', icon: ShoppingBag },
    { href: '/admin/articles', label: 'Articles', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-white border-r border-slate-200 shadow-sm z-40 transition-all duration-300 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className={`p-6 border-b border-slate-200 ${sidebarCollapsed ? 'flex items-center justify-center' : 'flex items-center justify-between'}`}>
          {!sidebarCollapsed && (
            <div>
              <img src="/logo.png" alt="GigSafeHub" className="h-8 w-auto mb-2" />
              <p className="text-sm text-slate-500">Admin Panel</p>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            // For Dashboard, check exact match or just /admin
            // For other items, check if pathname starts with the href (but not just /admin)
            let isActive = false;
            if (item.href === '/admin') {
              isActive = pathname === '/admin' || pathname === '/admin/';
            } else {
              isActive = pathname === item.href || (pathname?.startsWith(`${item.href}/`) ?? false);
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
                title={sidebarCollapsed ? item.label : ''}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200">
          {!sidebarCollapsed && (
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-slate-900">{user.name || user.email}</p>
                <p className="text-xs text-slate-500">{user.role}</p>
              </div>
            </div>
          )}
          <button
            onClick={async () => {
              await logout();
            }}
            className={`w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors ${
              sidebarCollapsed ? 'flex items-center justify-center' : ''
            }`}
            title={sidebarCollapsed ? 'Logout' : ''}
          >
            {sidebarCollapsed ? <X className="w-5 h-5" /> : 'Logout'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}

