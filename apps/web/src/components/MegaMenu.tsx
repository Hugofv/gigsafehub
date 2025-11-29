'use client';

import React from 'react';
import Link from 'next/link';
import { useCategories } from '@/contexts/CategoriesContext';
import type { Category } from '@/services/api';

interface MegaMenuProps {
  locale: string;
  getLink: (path: string) => string;
  onClose: () => void;
}

export const InsuranceMegaMenu: React.FC<MegaMenuProps> = ({ locale, getLink, onClose }) => {
  const { categories, loading, getByParent, findBySlug, buildPath } = useCategories();

  // Find insurance root category
  const insuranceRoot = findBySlug(locale === 'pt-BR' ? 'seguros' : 'insurance', locale);

  if (!insuranceRoot) {
    if (!loading) {
      console.warn('Insurance root category not found');
    }
    return null;
  }

  // Filter level 1 categories (Insurance for Drivers, Delivery, etc.)
  const level1Cats = getByParent(insuranceRoot.id);

  // Sort level 1 categories by order
  const sortedLevel1Cats = [...level1Cats].sort((a, b) => (a.order || 0) - (b.order || 0));

  // Build sections with children
  const sections = sortedLevel1Cats.map((level1Cat) => {
    // Get children that have this level1Cat as parent
    const children = getByParent(level1Cat.id);

    // Sort children by order
    const sortedChildren = [...children].sort((a, b) => (a.order || 0) - (b.order || 0));

    const childrenWithPaths = sortedChildren.map((child) => ({
      ...child,
      fullPath: buildPath(child, locale),
    }));

    return {
      title: level1Cat.name,
      items: childrenWithPaths,
    };
  }).filter((s) => s.items.length > 0);

  if (loading) {
    return (
      <div className="absolute left-0 mt-2 w-full max-w-6xl bg-white rounded-lg shadow-xl border border-slate-200 z-50 p-6">
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    );
  }

  if (sections.length === 0) {
    return null;
  }

  return (
    <div className="absolute left-0 mt-2 w-full max-w-6xl bg-white rounded-lg shadow-xl border border-slate-200 z-50">
      <div className="p-6">
        <div className="grid grid-cols-4 gap-6">
          {sections.map((section, idx) => (
            <div key={section.title || idx} className="flex flex-col min-w-0">
              <h3 className="font-bold text-slate-900 mb-4 text-xs uppercase tracking-wider border-b border-slate-200 pb-2 whitespace-nowrap">
                {section.title}
              </h3>
              <ul className="space-y-1.5 flex-1">
                {section.items.length > 0 ? (
                  section.items.map((item) => (
                    <li key={item.id}>
                      <Link
                        href={getLink(`/${item.fullPath || item.slug}`)}
                        onClick={onClose}
                        className="text-sm text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition-colors block py-2 px-2 rounded-md"
                        title={item.name}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="text-xs text-slate-400 italic py-2">No items available</li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ComparisonMegaMenu: React.FC<MegaMenuProps> = ({ locale, getLink, onClose }) => {
  const { categories: allCategories, loading, getByParent, findBySlug, buildPath } = useCategories();

  // Find comparison root category
  const comparisonRoot = findBySlug(locale === 'pt-BR' ? 'comparador' : 'comparisons', locale);

  // Filter comparison categories (level 1)
  const comparisonCats = comparisonRoot ? getByParent(comparisonRoot.id) : [];

  // Build full paths
  const categories = comparisonCats.map((cat) => ({
    ...cat,
    fullPath: buildPath(cat, locale),
  }));

  if (loading) {
    return (
      <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50 p-4">
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden">
      <div className="p-4">
        <ul className="space-y-1">
          {categories.map((item) => (
            <li key={item.id}>
              <Link
                href={getLink(`/${item.fullPath || item.slug}`)}
                onClick={onClose}
                className="text-sm text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition-colors block py-2.5 px-3 rounded-md"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const GuidesMegaMenu: React.FC<MegaMenuProps> = ({ locale, getLink, onClose }) => {
  const { categories: allCategories, loading, getByParent, findBySlug, buildPath } = useCategories();

  // Find guides root category
  const guidesRoot = findBySlug(locale === 'pt-BR' ? 'guias' : 'guides', locale);

  // Filter guide categories (level 1)
  const guideCats = guidesRoot ? getByParent(guidesRoot.id) : [];

  // Build full paths
  const categories = guideCats.map((cat) => ({
    ...cat,
    fullPath: buildPath(cat, locale),
  }));

  if (loading) {
    return (
      <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50 p-4">
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden">
      <div className="p-4">
        <ul className="space-y-1">
          {categories.map((item) => (
            <li key={item.id}>
              <Link
                href={getLink(`/${item.fullPath || item.slug}`)}
                onClick={onClose}
                className="text-sm text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition-colors block py-2.5 px-3 rounded-md"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export const BlogMegaMenu: React.FC<MegaMenuProps> = ({ locale, getLink, onClose }) => {
  const { categories: allCategories, loading, getByParent, findBySlug } = useCategories();

  // Find blog root category
  const blogRoot = findBySlug('blog', locale);

  // Filter blog categories (level 1)
  const categories = blogRoot ? getByParent(blogRoot.id) : [];

  if (loading) {
    return (
      <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50 p-4">
        <p className="text-sm text-slate-500">Loading...</p>
      </div>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 z-50 overflow-hidden">
      <div className="p-4">
        <ul className="space-y-1">
          {categories.map((item) => (
            <li key={item.id}>
              <Link
                href={getLink(`/articles/${item.slug}`)}
                onClick={onClose}
                className="text-sm text-slate-600 hover:text-brand-600 hover:bg-slate-50 transition-colors block py-2.5 px-3 rounded-md"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

