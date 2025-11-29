import React from 'react';
import { notFound } from 'next/navigation';
import { getCategoryBySlugPath, getProductsByCategory, getArticlesByCategory } from '@/services/api';
import ReviewsClient from '../reviews/ReviewsClient';
import ArticlesClient from '../articles/ArticlesClient';

interface CategoryPageProps {
  params: {
    locale: string;
    slug: string[];
  };
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

    // Determine content type based on category level or name
    // Level 0-1: Main categories (Insurance, Banking, etc.) - Show products
    // Level 2+: Subcategories - Show products filtered by category
    // Special cases: "blog", "guides", "comparisons" - Show respective content

    const categoryName = category.name.toLowerCase();
    const isBlog = categoryName.includes('blog') || category.level >= 2 && category.counts.articles > 0;
    const isGuide = categoryName.includes('guide') || category.counts.guides > 0;
    const isComparison = categoryName.includes('compar') || category.counts.comparisons > 0;

    if (isBlog || category.counts.articles > category.counts.products) {
      // Show articles
      const articles = await getArticlesByCategory(category.id, locale);
      return (
        <div>
          <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
          {category.description && (
            <p className="text-xl text-slate-600 mb-8">{category.description}</p>
          )}
          <ArticlesClient articles={articles} locale={locale} />
        </div>
      );
    }

    if (isGuide) {
      // Show guides (to be implemented)
      return (
        <div>
          <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
          {category.description && (
            <p className="text-xl text-slate-600 mb-8">{category.description}</p>
          )}
          <p>Guides coming soon...</p>
        </div>
      );
    }

    // Default: Show products
    const products = await getProductsByCategory(category.id, locale);
    return (
      <div>
        <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
        {category.description && (
          <p className="text-xl text-slate-600 mb-8">{category.description}</p>
        )}
        <ReviewsClient
          products={products}
          locale={locale}
          initialCategory={category.id}
        />
      </div>
    );
  } catch (error) {
    console.error('Error loading category page:', error);
    notFound();
  }
}

export default CategoryPage;

