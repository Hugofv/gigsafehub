import React from 'react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getCategoryBySlugPath, getProductsByCategory, getArticlesByCategory, getAllCategories } from '@/services/api';
import CategoryPageClient from './CategoryPageClient';
import type { Category } from '@/services/api';

interface CategoryPageProps {
  params: {
    locale: string;
    slug: string[];
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { locale, slug } = params;
  const slugPath = slug.join('/');

  try {
    const category = await getCategoryBySlugPath(slugPath, locale);

    if (!category) {
      return {
        title: 'Category Not Found',
      };
    }

    const metaTitle = category.metaTitle || category.name;
    const metaDescription = category.metaDescription || category.description || '';

    return {
      title: metaTitle,
      description: metaDescription,
      openGraph: {
        title: metaTitle,
        description: metaDescription,
        type: 'website',
      },
      alternates: {
        canonical: `/${locale}/${slugPath}`,
      },
    };
  } catch (error) {
    return {
      title: 'Category',
    };
  }
}

async function CategoryPage({ params }: CategoryPageProps) {
  const { locale, slug } = params;
  const slugPath = slug.join('/');

  try {
    // Fetch category by hierarchical slug path
    const category = await getCategoryBySlugPath(slugPath, locale);

    if (!category) {
      notFound();
    }

    // Get all categories to build breadcrumbs
    const allCategories = await getAllCategories(locale);

    // Build breadcrumb path
    const buildBreadcrumbs = (cat: Category, allCats: Category[]): Category[] => {
      const breadcrumbs: Category[] = [cat];
      let current = cat;

      while (current.parentId) {
        const parent = allCats.find((c) => c.id === current.parentId);
        if (parent) {
          breadcrumbs.unshift(parent);
          current = parent;
        } else {
          break;
        }
      }

      return breadcrumbs;
    };

    const breadcrumbs = buildBreadcrumbs(category, allCategories);

    // Get subcategories (children) - all direct children
    const subcategories = allCategories.filter(
      (c) => c.parentId === category.id
    ).sort((a, b) => (a.order || 0) - (b.order || 0));

    // Get nested subcategories (children of children) for each subcategory
    const subcategoriesWithChildren = subcategories.map((subcat) => {
      const children = allCategories.filter(
        (c) => c.parentId === subcat.id
      ).sort((a, b) => (a.order || 0) - (b.order || 0));
      return {
        ...subcat,
        children,
      };
    });

    // Determine content type based on category level or name
    const categoryName = category.name.toLowerCase();
    const counts = category.counts || { products: 0, articles: 0, guides: 0, comparisons: 0 };
    const isBlog = categoryName.includes('blog') || (category.level >= 2 && counts.articles > 0);
    const isGuide = categoryName.includes('guide') || counts.guides > 0;
    const isComparison = categoryName.includes('compar') || counts.comparisons > 0;

    // Fetch content based on category type
    let products: any[] = [];
    let articles: any[] = [];

    if (isBlog || counts.articles > counts.products) {
      articles = await getArticlesByCategory(category.id, locale);
    } else {
      products = await getProductsByCategory(category.id, locale);
    }

    return (
      <CategoryPageClient
        category={category}
        breadcrumbs={breadcrumbs}
        subcategories={subcategoriesWithChildren}
        products={products}
        articles={articles}
        locale={locale}
        isBlog={isBlog}
        isGuide={isGuide}
        isComparison={isComparison}
      />
    );
  } catch (error) {
    console.error('Error loading category page:', error);
    notFound();
  }
}

export default CategoryPage;
