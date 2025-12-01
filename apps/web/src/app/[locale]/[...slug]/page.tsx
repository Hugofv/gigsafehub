import React from 'react';
import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import { unstable_noStore as noStore } from 'next/cache';
import { getCategoryBySlugPath, getProductsByCategory, getArticlesByCategory, getAllCategories, getArticleBySlug } from '@/services/api';
import CategoryPageClient from './CategoryPageClient';
import ArticleDetailClient from '../articles/[slug]/ArticleDetailClient';
import StructuredData, { generateBreadcrumbStructuredData, generateArticleStructuredData, generateCategoryStructuredData } from '@/components/StructuredData';
import type { Category } from '@/services/api';

interface CategoryPageProps {
  params: Promise<{
    locale: string;
    slug: string[];
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  noStore(); // Prevent metadata streaming - ensures metadata is in <head> on reload
  const { locale, slug } = await params;
  const slugPath = slug.join('/');

  try {
    const category = await getCategoryBySlugPath(slugPath, locale);

    if (!category) {
      // Try to find article by slug
      if (slug.length > 0) {
        const lastSegment = slug[slug.length - 1];
        const article = await getArticleBySlug(lastSegment, locale);

        if (article) {
          let articleTitle = article.metaTitle || article.title;
          // Remove suffix if already present (to avoid duplication with template)
          articleTitle = articleTitle.replace(/\s*[-–—]\s*GigSafeHub\s*$/i, '').trim();
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
          const canonicalUrl = `${baseUrl}/${locale}/${slugPath}`;
          const articleDescription = article.metaDescription || article.excerpt || `Read ${article.title} on GigSafeHub. Expert guides and information for gig economy workers.`;

          return {
            title: articleTitle, // Template from root layout will add suffix
            description: articleDescription,
            keywords: article.metaKeywords?.split(',').map((k: string) => k.trim()) || [],
            openGraph: {
              title: articleTitle, // Use title without suffix for OG
              description: articleDescription,
              type: 'article',
              url: canonicalUrl,
              siteName: 'GigSafeHub',
              locale: locale === 'pt-BR' ? 'pt_BR' : 'en_US',
              publishedTime: article.date,
              images: article.imageUrl ? [
                {
                  url: article.imageUrl,
                  alt: article.imageAlt || article.title,
                },
              ] : [],
            },
            twitter: {
              card: 'summary_large_image',
              title: articleTitle, // Use title without suffix for Twitter
              description: articleDescription,
              images: article.imageUrl ? [article.imageUrl] : [],
            },
            alternates: {
              canonical: canonicalUrl,
            },
            robots: {
              index: article.robotsIndex ?? true,
              follow: article.robotsFollow ?? true,
            },
          };
        }
      }

      return {
        title: 'Category Not Found - GigSafeHub',
        description: 'The requested category or page could not be found. Explore our insurance products and guides for gig economy workers.',
      };
    }

    const metaTitle = category.metaTitle || category.name;
    const metaDescription = category.metaDescription || category.description || `Explore ${category.name} and find the best insurance products and guides for gig economy workers.`;
    // Don't add suffix, template from root layout will add it
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const canonicalUrl = `${baseUrl}/${locale}/${slugPath}`;

    return {
      title: metaTitle, // Template from root layout will add suffix
      description: metaDescription,
      keywords: category.metaKeywords ? category.metaKeywords.split(',').map((k: string) => k.trim()) : [],
      openGraph: {
        title: metaTitle, // Use title without suffix for OG
        description: metaDescription,
        type: 'website',
        url: canonicalUrl,
        siteName: 'GigSafeHub',
        locale: locale === 'pt-BR' ? 'pt_BR' : 'en_US',
        images: category.icon ? [
          {
            url: category.icon,
            alt: category.name,
          },
        ] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title: metaTitle, // Use title without suffix for Twitter
        description: metaDescription,
        images: category.icon ? [category.icon] : [],
      },
      alternates: {
        canonical: canonicalUrl,
        languages: {
          'pt-BR': `${baseUrl}/pt-BR/${slugPath}`,
          'en-US': `${baseUrl}/en-US/${slugPath}`,
        },
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large',
          'max-snippet': -1,
        },
      },
    };
  } catch {
    return {
      title: 'Category - GigSafeHub',
      description: 'Explore our categories and find the best insurance products for gig workers.',
    };
  }
}

async function CategoryPage({ params }: CategoryPageProps) {
  noStore(); // Prevent streaming for page content too
  const { locale, slug } = await params;
  const slugPath = slug.join('/');

  try {
    // First, try to fetch category by hierarchical slug path
    const category = await getCategoryBySlugPath(slugPath, locale);

    // If category not found, try to find an article by the last slug segment
    if (!category && slug.length > 0) {
      const lastSegment = slug[slug.length - 1];
      const article = await getArticleBySlug(lastSegment, locale);

      if (article && article.category) {
        // Found an article, get the category to build the correct path
        const allCategories = await getAllCategories(locale);
        const articleCategory = allCategories.find(c => c.id === article.category?.id);

        if (articleCategory) {
          // Build the full category path (including parent categories)
          const buildCategoryPath = (cat: Category, allCats: Category[]): string[] => {
            const path: string[] = [];
            let current: Category | undefined = cat;

            while (current) {
              const slug = locale === 'pt-BR'
                ? (current.slugPt || current.slug)
                : (current.slugEn || current.slug);
              path.unshift(slug);

              if (current.parentId) {
                current = allCats.find(c => c.id === current!.parentId);
              } else {
                break;
              }
            }

            return path;
          };

          const categoryPath = buildCategoryPath(articleCategory, allCategories);

          // Determine the correct article slug for the current locale
          const correctArticleSlug = locale === 'pt-BR' && article.slugPt
            ? article.slugPt
            : locale === 'en-US' && article.slugEn
              ? article.slugEn
              : article.slug;

          const expectedPath = [...categoryPath, correctArticleSlug];
          const currentPath = slug;

          // Check if current path matches expected path
          const pathsMatch = expectedPath.length === currentPath.length &&
            expectedPath.every((segment, index) => segment.toLowerCase() === currentPath[index]?.toLowerCase());

          if (pathsMatch) {
            // Path is correct, render the article
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
            const articleUrl = `${baseUrl}/${locale}/${expectedPath.join('/')}`;
            const breadcrumbItems = [
              { name: 'Home', url: `${baseUrl}/${locale}` },
              ...categoryPath.map((slug, idx) => {
                const cat = allCategories.find(c => {
                  const catSlug = locale === 'pt-BR' ? (c.slugPt || c.slug) : (c.slugEn || c.slug);
                  return catSlug === slug;
                });
                return {
                  name: cat?.name || slug,
                  url: `${baseUrl}/${locale}/${categoryPath.slice(0, idx + 1).join('/')}`,
                };
              }),
              { name: article.title, url: articleUrl },
            ];

            return (
              <>
                <StructuredData data={generateBreadcrumbStructuredData(breadcrumbItems)} />
                <StructuredData data={generateArticleStructuredData({
                  title: article.title,
                  description: article.metaDescription || article.excerpt,
                  imageUrl: article.imageUrl,
                  date: article.date,
                  url: articleUrl,
                  locale,
                })} />
                <ArticleDetailClient article={article} locale={locale} isComparison={article.category.name?.toLowerCase().includes('compar') ?? false} />
              </>
            );
          } else {
            // Path doesn't match, redirect to correct path with the correct slug for the locale
            const correctPath = `/${locale}/${expectedPath.join('/')}`;
            redirect(correctPath);
          }
        }
      }
    }

    // If still no category found, return 404
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

    // Determine content type based on category level or name
    const categoryName = category.name.toLowerCase();
    const counts = category.counts || { products: 0, articles: 0 };
    const isBlog = categoryName.includes('blog') || (category.level >= 2 && counts.articles > 0);
    const isGuide = categoryName.includes('guide');
    const isComparison = categoryName.includes('compar');

    // Fetch content - fetch both products and articles if they exist
    let products: any[] = [];
    let articles: any[] = [];

    // Fetch products if category has products
    if (counts.products > 0) {
      products = await getProductsByCategory(category.id, locale);
    }

    // Fetch articles if category has articles (for blog categories or any category with articles)
    if (counts.articles > 0) {
      const allArticles = await getArticlesByCategory(category.id, locale);
      // Filter to only show articles that belong directly to this category (not subcategories)
      articles = allArticles.filter((article: any) => article.categoryId === category.id);
    }

    // Get subcategories (children) - but only if category doesn't have articles directly assigned
    // If a category has articles, it's a content category and shouldn't show subcategories
    let subcategories = allCategories.filter(
      (c) => c.parentId === category.id
    ).sort((a, b) => (a.order || 0) - (b.order || 0));

    // Hide subcategories if this category has articles directly assigned to it
    if (articles.length > 0) {
      subcategories = [];
    }

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

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const categoryUrl = `${baseUrl}/${locale}/${slugPath}`;
    const breadcrumbItems = [
      { name: 'Home', url: `${baseUrl}/${locale}` },
      ...breadcrumbs.map((cat, idx) => {
        const path = breadcrumbs.slice(0, idx + 1).map(c => {
          const s = locale === 'pt-BR' ? (c.slugPt || c.slug) : (c.slugEn || c.slug);
          return s;
        }).join('/');
        return {
          name: cat.name,
          url: `${baseUrl}/${locale}/${path}`,
        };
      }),
    ];

    return (
      <>
        <StructuredData data={generateBreadcrumbStructuredData(breadcrumbItems)} />
        <StructuredData data={generateCategoryStructuredData({
          name: category.name,
          description: category.metaDescription || category.description,
          url: categoryUrl,
          locale,
        })} />
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
      </>
    );
  } catch (error) {
    console.error('Error loading category page:', error);
    notFound();
  }
}

// Force dynamic rendering to ensure metadata is always generated on reload
export const dynamic = 'force-dynamic';
export const revalidate = 0; // Always revalidate
export const runtime = 'nodejs'; // Disable streaming to ensure metadata is always in head

export default CategoryPage;
