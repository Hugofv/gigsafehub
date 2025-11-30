'use client';

import React from 'react';
import Link from 'next/link';
import { useCategories } from '@/contexts/CategoriesContext';
import ProductCard from '@/components/ProductCard';
import type { Category } from '@/services/api';
import type { FinancialProduct, Article } from '@gigsafehub/types';
import { getLocalizedSlug } from '@/lib/slug';

interface CategoryWithChildren extends Category {
  children?: Category[];
}

interface CategoryPageClientProps {
  category: Category;
  breadcrumbs: Category[];
  subcategories: CategoryWithChildren[];
  products: FinancialProduct[];
  articles: Article[];
  locale: string;
  isBlog: boolean;
  isGuide: boolean;
  isComparison: boolean;
}

export default function CategoryPageClient({
  category,
  breadcrumbs,
  subcategories,
  products,
  articles,
  locale,
  isBlog,
  isGuide,
  isComparison,
}: CategoryPageClientProps) {
  const { buildPath } = useCategories();
  const [compareList, setCompareList] = React.useState<string[]>([]);

  const handleCompareToggle = (id: string) => {
    setCompareList((prev) => {
      if (prev.includes(id)) return prev.filter((pid) => pid !== id);
      if (prev.length >= 3) {
        alert('You can only compare up to 3 products.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const getLink = (path: string) => {
    return `/${locale}${path}`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href={`/${locale}`} className="text-slate-500 hover:text-brand-600">
              Home
            </Link>
            {breadcrumbs.map((crumb, idx) => {
              const crumbPath = buildPath(crumb, locale);
              const isLast = idx === breadcrumbs.length - 1;
              return (
                <React.Fragment key={crumb.id}>
                  <span className="text-slate-400">/</span>
                  {isLast ? (
                    <span className="text-slate-900 font-medium">{crumb.name}</span>
                  ) : (
                    <Link
                      href={getLink(`/${crumbPath}`)}
                      className="text-slate-500 hover:text-brand-600"
                    >
                      {crumb.name}
                    </Link>
                  )}
                </React.Fragment>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Header Section */}
      <div className="bg-gradient-to-br from-brand-600 to-brand-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6">{category.name}</h1>
            {category.description && (
              <p className="text-xl text-brand-100 mb-8 leading-relaxed">{category.description}</p>
            )}

            {/* Stats */}
            <div className="flex flex-wrap gap-6 text-sm">
              {products.length > 0 && (
                <div>
                  <span className="font-bold text-2xl">{products.length}</span>
                  <span className="ml-2 text-brand-100">Products</span>
                </div>
              )}
              {articles.length > 0 && (
                <div>
                  <span className="font-bold text-2xl">{articles.length}</span>
                  <span className="ml-2 text-brand-100">Articles</span>
                </div>
              )}
              {subcategories.length > 0 && (
                <div>
                  <span className="font-bold text-2xl">{subcategories.length}</span>
                  <span className="ml-2 text-brand-100">Subcategories</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Subcategories Section */}
      {subcategories.length > 0 && (
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              {category.level === 0 ? 'Browse Categories' : 'Browse Subcategories'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subcategories.map((subcat) => {
                const subcatPath = buildPath(subcat, locale);
                const hasChildren = subcat.children && subcat.children.length > 0;
                const subcatCounts = subcat.counts || { products: 0, articles: 0 };

                return (
                  <div
                    key={subcat.id}
                    className="group p-5 bg-slate-50 rounded-lg border border-slate-200 hover:border-brand-500 hover:bg-brand-50 transition-all"
                  >
                    <Link
                      href={getLink(`/${subcatPath}`)}
                      className="block"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-slate-900 group-hover:text-brand-600 text-lg flex-1">
                          {subcat.name}
                        </h3>
                        {hasChildren && (
                          <span className="ml-2 text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded-full">
                            {subcat.children!.length}
                          </span>
                        )}
                      </div>
                      {subcat.description && (
                        <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                          {subcat.description}
                        </p>
                      )}
                      {/* Stats */}
                      <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                        {subcatCounts.products > 0 && (
                          <span>{subcatCounts.products} products</span>
                        )}
                        {subcatCounts.articles > 0 && (
                          <span>{subcatCounts.articles} articles</span>
                        )}
                      </div>
                    </Link>

                    {/* Nested Subcategories */}
                    {hasChildren && (
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3">
                          Subcategories
                        </h4>
                        <div className="space-y-2">
                          {subcat.children!.map((child) => {
                            const childPath = buildPath(child, locale);
                            return (
                              <Link
                                key={child.id}
                                href={getLink(`/${childPath}`)}
                                className="block text-sm text-slate-600 hover:text-brand-600 py-1.5 px-2 rounded hover:bg-white transition-colors"
                              >
                                <span className="flex items-center">
                                  <svg
                                    className="w-3 h-3 mr-2 text-slate-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 5l7 7-7 7"
                                    />
                                  </svg>
                                  {child.name}
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Compare Button */}
        {compareList.length > 0 && (
          <div className="mb-6 flex justify-end">
            <Link
              href={`/${locale}/compare?ids=${compareList.join(',')}`}
              className="inline-flex items-center px-6 py-3 bg-brand-600 text-white rounded-lg shadow-lg hover:bg-brand-700 transition-colors font-semibold"
            >
              Compare Selected ({compareList.length})
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        )}

        {/* Articles Section */}
        {isBlog && articles.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => {
                const articleSlug =
                  getLocalizedSlug(
                    article.slug,
                    (article as any).slugEn,
                    (article as any).slugPt,
                    locale
                  ) || article.slug;

                // Build article path using current category path
                const categoryPath = buildPath(category, locale);
                const articlePath = `/${locale}/${categoryPath}/${articleSlug}`;

                return (
                  <Link
                    key={article.id}
                    href={articlePath}
                    className="group flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {article.partnerTag && (
                        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                          {article.partnerTag.split(',').map((tag, index) => (
                            <span key={index} className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-900 uppercase tracking-wide">
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="text-xs text-slate-400 mb-2">{article.date}</div>
                      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-1">
                        {article.excerpt}
                      </p>
                      <span className="text-brand-600 font-semibold text-sm flex items-center">
                        Read More
                        <svg
                          className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Products Section */}
        {!isBlog && products.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
                  onCompareToggle={handleCompareToggle}
                  isSelectedForCompare={compareList.includes(product.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {products.length === 0 && articles.length === 0 && (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <svg
                className="w-24 h-24 mx-auto text-slate-300 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No content yet</h3>
              <p className="text-slate-600 mb-6">
                This category doesn't have any {isBlog ? 'articles' : 'products'} yet. Check back soon!
              </p>
              <Link
                href={`/${locale}`}
                className="inline-flex items-center px-6 py-3 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
              >
                Go to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

