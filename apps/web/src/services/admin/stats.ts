import { adminCategories, adminProducts, adminArticles } from './index';
import type { DashboardStats } from './types';

export const adminStats = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const [categories, products, articles] = await Promise.all([
      adminCategories.getAll().catch(() => []),
      adminProducts.getAll().catch(() => []),
      adminArticles.getAll().catch(() => []),
    ]);

    return {
      categories: Array.isArray(categories) ? categories.length : 0,
      products: Array.isArray(products) ? products.length : 0,
      articles: Array.isArray(articles) ? articles.length : 0,
    };
  },
};

