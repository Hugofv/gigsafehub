import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllCategories } from '@/services/api';
import ArticlesPageClient from './ArticlesPageClient';

interface ArticlesPageProps {
  params: Promise<{
    locale: string;
  }>;
  searchParams: Promise<{
    category?: string;
  }>;
}

export async function generateMetadata({ params }: ArticlesPageProps): Promise<Metadata> {
  const { locale } = await params;
  // Note: We can't use translations here as this is server-side, but we can use locale-based strings
  const title = locale === 'pt-BR' ? 'Artigos | GigSafeHub' : 'Articles | GigSafeHub';
  const description =
    locale === 'pt-BR'
      ? 'Explore todos os artigos sobre seguros para trabalhadores da economia gig'
      : 'Explore all articles about insurance for gig economy workers';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

export default async function ArticlesPage({ params, searchParams }: ArticlesPageProps) {
  const { locale } = await params;
  const { category: selectedCategory } = await searchParams;

  try {
    // Fetch all articles
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const articlesResponse = await fetch(`${API_URL}/api/articles?locale=${locale}`, {
      next: { revalidate: 3600 },
    });

    if (!articlesResponse.ok) {
      throw new Error('Failed to fetch articles');
    }

    const articles = await articlesResponse.json();

    // Get all categories to find root categories
    const allCategories = await getAllCategories(locale);

    // Find root categories (level 0) that have articles
    const rootCategories = allCategories
      .filter((cat) => cat.level === 0)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    // Get root category IDs (including all children)
    const getRootCategoryIds = (rootCategoryId: string): string[] => {
      const ids = [rootCategoryId];
      const getChildrenIds = (parentId: string) => {
        const children = allCategories.filter((c) => c.parentId === parentId);
        children.forEach((child) => {
          ids.push(child.id);
          getChildrenIds(child.id);
        });
      };
      getChildrenIds(rootCategoryId);
      return ids;
    };

    // Filter articles by selected root category if provided
    let filteredArticles = articles;
    if (selectedCategory) {
      const rootCategory = rootCategories.find(
        (cat) =>
          cat.slug === selectedCategory ||
          cat.slugPt === selectedCategory ||
          cat.slugEn === selectedCategory
      );

      if (rootCategory) {
        const rootCategoryIds = getRootCategoryIds(rootCategory.id);
        filteredArticles = articles.filter((article: any) => {
          if (!article.category || !article.category.id) return false;
          return rootCategoryIds.includes(article.category.id);
        });
      }
    }

    return (
      <ArticlesPageClient
        articles={filteredArticles}
        rootCategories={rootCategories}
        selectedCategory={selectedCategory || null}
        locale={locale}
      />
    );
  } catch (error) {
    console.error('Error loading articles page:', error);
    notFound();
  }
}

