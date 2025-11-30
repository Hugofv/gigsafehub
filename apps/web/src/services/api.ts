const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface Category {
  id: string;
  name: string;
  nameEn?: string;
  namePt?: string;
  slug: string;
  slugEn?: string;
  slugPt?: string;
  fullPath?: string;
  description?: string;
  level: number;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  country?: string;
  icon?: string;
  order?: number;
  metaTitle?: string;
  metaDescription?: string;
  counts?: {
    products: number;
    articles: number;
    guides: number;
    comparisons: number;
  };
}

// Cache for categories (in-memory cache)
let categoriesCache: {
  data: Category[];
  timestamp: number;
  locale: string;
} | null = null;

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Get all categories (with cache)
 */
export async function getAllCategories(
  locale: string = 'pt-BR',
  country?: string
): Promise<Category[]> {
  try {
    // Check cache
    if (
      categoriesCache &&
      categoriesCache.locale === locale &&
      Date.now() - categoriesCache.timestamp < CACHE_DURATION
    ) {
      return categoriesCache.data;
    }

    const params = new URLSearchParams({
      locale,
      ...(country && { country }),
    });

    const response = await fetch(`${API_URL}/api/categories?${params}`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch categories:', response.status, response.statusText);
      return categoriesCache?.data || [];
    }

    const data = await response.json();

    // Flatten the categories structure (extract children into flat array)
    // The API returns categories with nested children, but we need a flat array
    const flattenCategories = (categories: Category[]): Category[] => {
      const flat: Category[] = [];
      const seenIds = new Set<string>();

      const traverse = (cat: Category) => {
        // Only add if we haven't seen this ID before (avoid duplicates)
        if (!seenIds.has(cat.id)) {
          seenIds.add(cat.id);
          // Add the category itself without children
          flat.push({
            ...cat,
            children: undefined, // Remove children from the flat structure
          });
        }

        // Traverse children if they exist
        if (cat.children && cat.children.length > 0) {
          cat.children.forEach((child) => {
            traverse(child as Category);
          });
        }
      };

      categories.forEach(traverse);
      return flat;
    };

    const flattenedData = flattenCategories(data);

    // Update cache
    categoriesCache = {
      data: flattenedData,
      timestamp: Date.now(),
      locale,
    };

    return flattenedData;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return categoriesCache?.data || [];
  }
}

/**
 * Filter categories by level
 */
export function filterCategoriesByLevel(
  categories: Category[],
  level: number
): Category[] {
  return categories.filter((cat) => cat.level === level);
}

/**
 * Filter categories by parentId
 */
export function filterCategoriesByParent(
  categories: Category[],
  parentId: string | null
): Category[] {
  if (parentId === null) {
    return categories.filter((cat) => cat.parentId === null || !cat.parentId);
  }
  // Filter by exact parentId match
  const filtered = categories.filter((cat) => cat.parentId === parentId);
  return filtered;
}

/**
 * Find category by slug
 */
export function findCategoryBySlug(
  categories: Category[],
  slug: string,
  locale: string = 'pt-BR'
): Category | undefined {
  return categories.find((cat) => {
    if (locale === 'pt-BR' && cat.slugPt) {
      return cat.slugPt === slug;
    }
    if (locale === 'en-US' && cat.slugEn) {
      return cat.slugEn === slug;
    }
    return cat.slug === slug;
  });
}

/**
 * Build full path for a category
 */
export function buildCategoryPath(
  category: Category,
  categories: Category[],
  locale: string = 'pt-BR'
): string {
  const path: string[] = [];
  let current: Category | undefined = category;

  while (current) {
    const slug =
      locale === 'pt-BR' && current.slugPt
        ? current.slugPt
        : locale === 'en-US' && current.slugEn
        ? current.slugEn
        : current.slug;
    path.unshift(slug);

    if (current.parentId) {
      current = categories.find((c) => c.id === current?.parentId);
    } else {
      current = undefined;
    }
  }

  return path.join('/');
}

/**
 * Get categories with filters (deprecated - use getAllCategories + filter functions)
 */
export async function getCategories(
  locale: string = 'en-US',
  options?: {
    country?: string;
    level?: number;
    parentId?: string | null;
  }
): Promise<Category[]> {
  // Get all categories from cache or API
  const allCategories = await getAllCategories(locale, options?.country);

  let filtered = allCategories;

  // Apply filters
  if (options?.level !== undefined) {
    filtered = filterCategoriesByLevel(filtered, options.level);
  }

  if (options?.parentId !== undefined) {
    filtered = filterCategoriesByParent(filtered, options.parentId);
  }

  return filtered;
}

export async function getCategoryBySlugPath(
  slugPath: string,
  locale: string = 'pt-BR'
): Promise<Category | null> {
  try {
    const response = await fetch(
      `${API_URL}/api/categories/${slugPath}?locale=${locale}`,
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch category');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching category:', error);
    return null;
  }
}

export async function getProductsByCategory(
  categoryId: string,
  locale: string = 'pt-BR'
): Promise<any[]> {
  const params = new URLSearchParams({
    categoryId,
    ...(locale && { locale }),
  });

  const response = await fetch(`${API_URL}/api/products?${params}`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  return response.json();
}

export async function getArticlesByCategory(
  categoryId: string,
  locale: string = 'pt-BR'
): Promise<any[]> {
  const params = new URLSearchParams({
    categoryId,
    locale,
  });

  const response = await fetch(`${API_URL}/api/articles?${params}`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch articles');
  }

  return response.json();
}

/**
 * Get latest articles
 */
export async function getLatestArticles(
  limit: number = 6,
  locale: string = 'pt-BR'
): Promise<any[]> {
  try {
    const params = new URLSearchParams({
      limit: limit.toString(),
      locale,
      sortBy: 'date',
      sortOrder: 'desc',
    });

    const response = await fetch(`${API_URL}/api/articles?${params}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      console.error('Failed to fetch latest articles:', response.status);
      return [];
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching latest articles:', error);
    return [];
  }
}

/**
 * Get article by slug
 */
export async function getArticleBySlug(
  slug: string,
  locale: string = 'pt-BR'
): Promise<any | null> {
  try {
    const response = await fetch(`${API_URL}/api/articles/${slug}?locale=${locale}`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch article');
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

