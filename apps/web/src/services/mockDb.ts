import type { FinancialProduct, Article } from '@gigsafehub/types';
import { INITIAL_PRODUCTS, INITIAL_ARTICLES } from '../constants';

const DB_KEY_PRODUCTS = 'gigsafehub_products_db';
const DB_KEY_ARTICLES = 'gigsafehub_articles_db';

// Initialize DBs if empty
const initDb = () => {
  if (typeof window === 'undefined') return; // Server-side check

  if (!localStorage.getItem(DB_KEY_PRODUCTS)) {
    localStorage.setItem(DB_KEY_PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem(DB_KEY_ARTICLES)) {
    localStorage.setItem(DB_KEY_ARTICLES, JSON.stringify(INITIAL_ARTICLES));
  }
};

// --- Products ---

export const getProducts = async (): Promise<FinancialProduct[]> => {
  if (typeof window === 'undefined') return INITIAL_PRODUCTS; // Server-side fallback

  initDb();
  await new Promise(resolve => setTimeout(resolve, 300));
  const data = localStorage.getItem(DB_KEY_PRODUCTS);
  return data ? JSON.parse(data) : [];
};

export const getProductById = async (id: string): Promise<FinancialProduct | undefined> => {
  const products = await getProducts();
  return products.find(p => p.id === id);
};

export const updateProduct = async (updatedProduct: FinancialProduct): Promise<void> => {
  if (typeof window === 'undefined') return;

  const products = await getProducts();
  const index = products.findIndex(p => p.id === updatedProduct.id);
  if (index !== -1) {
    products[index] = updatedProduct;
    localStorage.setItem(DB_KEY_PRODUCTS, JSON.stringify(products));
  }
};

export const deleteProduct = async (id: string): Promise<void> => {
  if (typeof window === 'undefined') return;

  const products = await getProducts();
  const newProducts = products.filter(p => p.id !== id);
  localStorage.setItem(DB_KEY_PRODUCTS, JSON.stringify(newProducts));
};

export const createProduct = async (product: FinancialProduct): Promise<void> => {
  if (typeof window === 'undefined') return;

  const products = await getProducts();
  products.push(product);
  localStorage.setItem(DB_KEY_PRODUCTS, JSON.stringify(products));
};

// --- Articles ---

export const getArticles = async (): Promise<Article[]> => {
  if (typeof window === 'undefined') return INITIAL_ARTICLES; // Server-side fallback

  initDb();
  await new Promise(resolve => setTimeout(resolve, 300));
  const data = localStorage.getItem(DB_KEY_ARTICLES);
  return data ? JSON.parse(data) : [];
};

export const getArticleBySlug = async (slug: string): Promise<Article | undefined> => {
  const articles = await getArticles();
  return articles.find(a => a.slug === slug);
};

export const createArticle = async (article: Article): Promise<void> => {
  if (typeof window === 'undefined') return;

  const articles = await getArticles();
  articles.push(article);
  localStorage.setItem(DB_KEY_ARTICLES, JSON.stringify(articles));
};

export const updateArticle = async (updatedArticle: Article): Promise<void> => {
  if (typeof window === 'undefined') return;

  const articles = await getArticles();
  const index = articles.findIndex(a => a.id === updatedArticle.id);
  if (index !== -1) {
    articles[index] = updatedArticle;
    localStorage.setItem(DB_KEY_ARTICLES, JSON.stringify(articles));
  }
};

export const deleteArticle = async (id: string): Promise<void> => {
  if (typeof window === 'undefined') return;

  const articles = await getArticles();
  const newArticles = articles.filter(a => a.id !== id);
  localStorage.setItem(DB_KEY_ARTICLES, JSON.stringify(newArticles));
};

