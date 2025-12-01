import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';

export const adminRouter = Router();

// Apply authentication and admin middleware to all routes
adminRouter.use(authenticate);
adminRouter.use(requireAdmin);

// ============================================
// CATEGORIES CRUD
// ============================================

const categorySchema = z.object({
  name: z.string().min(1),
  nameEn: z.string().optional(),
  namePt: z.string().optional(),
  slug: z.string().min(1),
  slugEn: z.string().optional(),
  slugPt: z.string().optional(),
  description: z.string().optional(),
  descriptionEn: z.string().optional(),
  descriptionPt: z.string().optional(),
  level: z.number().int().min(0),
  parentId: z.string().nullable().optional(),
  country: z.string().optional().nullable(),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
  icon: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
});

adminRouter.get('/categories', async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: [{ level: 'asc' }, { order: 'asc' }],
      include: {
        parent: true,
        children: true,
        _count: {
          select: {
            products: true,
            articles: true,
          },
        },
      },
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

adminRouter.get('/categories/:id', async (req: Request, res: Response) => {
  try {
    const category = await prisma.category.findUnique({
      where: { id: req.params.id },
      include: {
        parent: true,
        children: true,
      },
    });
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

adminRouter.post('/categories', async (req: Request, res: Response) => {
  try {
    const data = categorySchema.parse(req.body);
    const category = await prisma.category.create({ data });
    res.status(201).json(category);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create category' });
  }
});

adminRouter.put('/categories/:id', async (req: Request, res: Response) => {
  try {
    const data = categorySchema.partial().parse(req.body);
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data,
    });
    res.json(category);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    // Prisma error code P2025 means record not found
    if (error?.code === 'P2025') {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(500).json({ error: 'Failed to update category' });
  }
});

adminRouter.delete('/categories/:id', async (req: Request, res: Response) => {
  try {
    await prisma.category.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error: any) {
    // Prisma error code P2025 means record not found
    if (error?.code === 'P2025') {
      return res.status(404).json({ error: 'Category not found' });
    }
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// ============================================
// PRODUCTS CRUD
// ============================================

const productSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  slugEn: z.string().optional(),
  slugPt: z.string().optional(),
  categoryId: z.string(),
  country: z.string().optional().nullable(),
  rating: z.number().default(0),
  reviewsCount: z.number().int().default(0),
  description: z.string(),
  fees: z.string(),
  affiliateLink: z.string(),
  safetyScore: z.number().int().default(0),
  logoUrl: z.string(),
  logoAlt: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
  canonicalUrl: z.string().optional(),
  structuredData: z.string().optional(),
  sitemapPriority: z.number().optional(),
  sitemapChangefreq: z.string().optional(),
  robotsIndex: z.boolean().default(true),
  robotsFollow: z.boolean().default(true),
});

adminRouter.get('/products', async (req: Request, res: Response) => {
  try {
    const products = await prisma.financialProduct.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

adminRouter.get('/products/:id', async (req: Request, res: Response) => {
  try {
    const product = await prisma.financialProduct.findUnique({
      where: { id: req.params.id },
      include: {
        category: true,
        pros: true,
        cons: true,
        features: true,
      },
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

adminRouter.post('/products', async (req: Request, res: Response) => {
  try {
    const data = productSchema.parse(req.body);
    const product = await prisma.financialProduct.create({ data });
    res.status(201).json(product);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    res.status(500).json({ error: 'Failed to create product' });
  }
});

adminRouter.put('/products/:id', async (req: Request, res: Response) => {
  try {
    const data = productSchema.partial().parse(req.body);
    const product = await prisma.financialProduct.update({
      where: { id: req.params.id },
      data,
    });
    res.json(product);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    // Prisma error code P2025 means record not found
    if (error?.code === 'P2025') {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(500).json({ error: 'Failed to update product' });
  }
});

adminRouter.delete('/products/:id', async (req: Request, res: Response) => {
  try {
    await prisma.financialProduct.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error: any) {
    // Prisma error code P2025 means record not found
    if (error?.code === 'P2025') {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// ============================================
// ARTICLES CRUD
// ============================================

const articleSchema = z.object({
  slug: z.string().min(1),
  slugEn: z.string().optional(),
  slugPt: z.string().optional(),
  title: z.string().min(1),
  titleMenu: z.string().optional(),
  excerpt: z.string(),
  content: z.string(),
  partnerTag: z.string(),
  imageUrl: z.string(),
  imageAlt: z.string().optional(),
  showInMenu: z.boolean().optional().default(false),
  date: z.string().or(z.date()),
  locale: z.enum(['en_US', 'pt_BR', 'Both']),
  articleType: z.string().default('blog'),
  categoryId: z.string().optional().nullable(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  ogTitle: z.string().optional(),
  ogDescription: z.string().optional(),
  ogImage: z.string().optional(),
  canonicalUrl: z.string().optional(),
  structuredData: z.string().optional(),
  readingTime: z.number().int().optional(),
});

adminRouter.get('/articles', async (req: Request, res: Response) => {
  try {
    const articles = await prisma.article.findMany({
      include: { category: true },
      orderBy: { date: 'desc' },
    });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch articles' });
  }
});

adminRouter.get('/articles/:id', async (req: Request, res: Response) => {
  try {
    const article = await prisma.article.findUnique({
      where: { id: req.params.id },
      include: { category: true },
    });
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

adminRouter.post('/articles', async (req: Request, res: Response) => {
  try {
    const data = articleSchema.parse(req.body);

    // Normalize categoryId: convert empty string to null
    let categoryId = data.categoryId;
    if (categoryId === '' || categoryId === null || categoryId === undefined) {
      categoryId = null;
    } else {
      // Validate that the category exists if categoryId is provided
      const categoryExists = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!categoryExists) {
        return res.status(400).json({
          error: 'Invalid category',
          message: `Category with id "${categoryId}" does not exist`
        });
      }
    }

    const article = await prisma.article.create({
      data: {
        ...data,
        categoryId: categoryId,
        date: typeof data.date === 'string' ? new Date(data.date) : data.date,
      },
    });
    res.status(201).json(article);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    // Handle Prisma foreign key constraint errors
    if (error?.code === 'P2003') {
      return res.status(400).json({
        error: 'Invalid category',
        message: 'The provided category does not exist'
      });
    }
    console.error('Error creating article:', error);
    res.status(500).json({ error: 'Failed to create article', message: error?.message });
  }
});

adminRouter.put('/articles/:id', async (req: Request, res: Response) => {
  try {
    const data = articleSchema.partial().parse(req.body);
    const updateData: any = { ...data };

    // Normalize categoryId: convert empty string to null
    if ('categoryId' in updateData) {
      if (updateData.categoryId === '' || updateData.categoryId === null || updateData.categoryId === undefined) {
        updateData.categoryId = null;
      } else {
        // Validate that the category exists if categoryId is provided
        const categoryExists = await prisma.category.findUnique({
          where: { id: updateData.categoryId },
        });
        if (!categoryExists) {
          return res.status(400).json({
            error: 'Invalid category',
            message: `Category with id "${updateData.categoryId}" does not exist`
          });
        }
      }
    }

    if (data.date) {
      updateData.date = typeof data.date === 'string' ? new Date(data.date) : data.date;
    }
    const article = await prisma.article.update({
      where: { id: req.params.id },
      data: updateData,
    });
    res.json(article);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    // Prisma error code P2025 means record not found
    if (error?.code === 'P2025') {
      return res.status(404).json({ error: 'Article not found' });
    }
    // Handle Prisma foreign key constraint errors
    if (error?.code === 'P2003') {
      return res.status(400).json({
        error: 'Invalid category',
        message: 'The provided category does not exist'
      });
    }
    console.error('Error updating article:', error);
    res.status(500).json({ error: 'Failed to update article', message: error?.message });
  }
});

adminRouter.delete('/articles/:id', async (req: Request, res: Response) => {
  try {
    await prisma.article.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (error: any) {
    // Prisma error code P2025 means record not found
    if (error?.code === 'P2025') {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

