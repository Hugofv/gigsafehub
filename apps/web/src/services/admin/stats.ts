import { adminCategories, adminProducts, adminArticles, adminGuides, adminComparisons } from './index';
import type { DashboardStats } from './types';

export const adminStats = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const [categories, products, articles, guides, comparisons] = await Promise.all([
      adminCategories.getAll().catch(() => []),
      adminProducts.getAll().catch(() => []),
      adminArticles.getAll().catch(() => []),
      adminGuides.getAll().catch(() => []),
      adminComparisons.getAll().catch(() => []),
    ]);

    return {
      categories: Array.isArray(categories) ? categories.length : 0,
      products: Array.isArray(products) ? products.length : 0,
      articles: Array.isArray(articles) ? articles.length : 0,
      guides: Array.isArray(guides) ? guides.length : 0,
      comparisons: Array.isArray(comparisons) ? comparisons.length : 0,
    };
  },
};

