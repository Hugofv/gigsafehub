import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import { sanitizeArticleContent, sanitizeText } from '../utils/sanitize';
import { addInternalLinksSafe } from '../utils/articleLinks';

export const adminRouter: Router = Router();

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
    // Convert null parentId to undefined for Prisma
    const createData: any = {
      ...data,
      parentId: data.parentId === null ? undefined : data.parentId,
    };
    const category = await prisma.category.create({ data: createData });
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
    // Convert null parentId to undefined for Prisma
    const updateData: any = {
      ...data,
      parentId: data.parentId === null ? undefined : data.parentId,
    };
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: updateData,
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
  country: z.enum(['BR', 'US', 'UK', 'CA', 'AU', 'DE', 'FR', 'ES', 'PT', 'MX', 'AR', 'CL', 'CO', 'Other']).optional().nullable(),
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
    // Convert null country to undefined for Prisma
    const createData: any = {
      ...data,
      country: data.country === null ? undefined : data.country,
    };
    const product = await prisma.financialProduct.create({ data: createData });
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
    // Convert null country to undefined and handle categoryId
    const updateData: any = {
      ...data,
      country: data.country === null ? undefined : data.country,
      categoryId: data.categoryId === null ? undefined : data.categoryId,
    };
    const product = await prisma.financialProduct.update({
      where: { id: req.params.id },
      data: updateData,
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
  relatedArticleIds: z.array(z.string()).optional(), // Array of related article IDs
});

adminRouter.get('/articles', async (req: Request, res: Response) => {
  try {
    const articles = await prisma.article.findMany({
      include: {
        category: true,
        relatedArticles: {
          include: {
            relatedArticle: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: [
        { date: 'desc' },
        { createdAt: 'desc' },
      ],
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
      include: {
        category: true,
        relatedArticles: {
          include: {
            relatedArticle: {
              select: {
                id: true,
                title: true,
                slug: true,
                slugEn: true,
                slugPt: true,
              },
            },
          },
          orderBy: { order: 'asc' },
        } as any,
      },
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

    // Sanitize content fields
    const sanitizedData = {
      ...data,
      content: sanitizeArticleContent(data.content),
      excerpt: sanitizeText(data.excerpt),
      title: sanitizeText(data.title),
      titleMenu: data.titleMenu ? sanitizeText(data.titleMenu) : undefined,
      metaTitle: data.metaTitle ? sanitizeText(data.metaTitle) : undefined,
      metaDescription: data.metaDescription ? sanitizeText(data.metaDescription) : undefined,
    };

    // Extract relatedArticleIds before creating article
    const relatedArticleIds = data.relatedArticleIds || [];

    // Normalize categoryId: convert empty string to null
    let categoryId = sanitizedData.categoryId;
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

    // Remove relatedArticleIds from data before creating (it's not a field in Article model)
    const { relatedArticleIds: _, ...articleData } = sanitizedData;

    const article = await prisma.article.create({
      data: {
        ...articleData,
        categoryId: categoryId,
        date: typeof sanitizedData.date === 'string' ? new Date(sanitizedData.date) : sanitizedData.date,
      },
    });

    // Process related articles if provided
    if (relatedArticleIds.length > 0) {
      // Validate that all related article IDs exist
      const existingArticles = await prisma.article.findMany({
        where: { id: { in: relatedArticleIds } },
        select: { id: true, title: true, slug: true, slugEn: true, slugPt: true },
      });

      if (existingArticles.length !== relatedArticleIds.length) {
        return res.status(400).json({
          error: 'Invalid related articles',
          message: 'Some related article IDs do not exist'
        });
      }

      // Get related articles for link processing
      const relatedArticles = existingArticles.map(a => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        slugEn: a.slugEn || undefined,
        slugPt: a.slugPt || undefined,
      }));

      // Process content to add internal links
      const locale = sanitizedData.locale === 'pt_BR' ? 'pt-BR' : sanitizedData.locale === 'en_US' ? 'en-US' : 'pt-BR';
      const processedContent = addInternalLinksSafe(
        article.content,
        relatedArticles,
        locale,
        1 // Max 1 link per article in content
      );

      // Update article with processed content
      if (processedContent !== article.content) {
        await prisma.article.update({
          where: { id: article.id },
          data: { content: processedContent },
        });
        article.content = processedContent;
      }

      // Create ArticleArticle relationships
      await (prisma as any).articleArticle.createMany({
        data: relatedArticleIds.map((relatedId, index) => ({
          articleId: article.id,
          relatedArticleId: relatedId,
          order: index,
        })),
        skipDuplicates: true,
      });
    }

    // Fetch article with relations for response
    const articleWithRelations = await prisma.article.findUnique({
      where: { id: article.id },
      include: {
        category: true,
        relatedArticles: {
          include: {
            relatedArticle: {
              select: {
                id: true,
                title: true,
                slug: true,
                slugEn: true,
                slugPt: true,
              },
            },
          },
          orderBy: { order: 'asc' },
        } as any,
      },
    });

    res.status(201).json(articleWithRelations);
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

    // Sanitize content fields if they are being updated
    if (updateData.content) {
      updateData.content = sanitizeArticleContent(updateData.content);
    }
    if (updateData.excerpt) {
      updateData.excerpt = sanitizeText(updateData.excerpt);
    }
    if (updateData.title) {
      updateData.title = sanitizeText(updateData.title);
    }
    if (updateData.titleMenu) {
      updateData.titleMenu = sanitizeText(updateData.titleMenu);
    }
    if (updateData.metaTitle) {
      updateData.metaTitle = sanitizeText(updateData.metaTitle);
    }
    if (updateData.metaDescription) {
      updateData.metaDescription = sanitizeText(updateData.metaDescription);
    }

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

    // Extract relatedArticleIds if provided
    const relatedArticleIds = data.relatedArticleIds;
    const { relatedArticleIds: _, ...articleUpdateData } = updateData;

    const article = await prisma.article.update({
      where: { id: req.params.id },
      data: articleUpdateData,
    });

    // Handle related articles if provided
    if (relatedArticleIds !== undefined) {
      // Delete existing relationships
      await prisma.articleArticle.deleteMany({
        where: { articleId: article.id },
      });

      // Create new relationships if provided
      if (relatedArticleIds.length > 0) {
        // Validate that all related article IDs exist
        const existingArticles = await prisma.article.findMany({
          where: { id: { in: relatedArticleIds } },
          select: { id: true, title: true, slug: true, slugEn: true, slugPt: true },
        });

        if (existingArticles.length !== relatedArticleIds.length) {
          return res.status(400).json({
            error: 'Invalid related articles',
            message: 'Some related article IDs do not exist'
          });
        }

        // Get related articles for link processing
        const relatedArticles = existingArticles.map(a => ({
          id: a.id,
          title: a.title,
          slug: a.slug,
          slugEn: a.slugEn || undefined,
          slugPt: a.slugPt || undefined,
        }));

        // Process content to add internal links (if content was updated)
        if (updateData.content) {
          const locale = article.locale === 'pt_BR' ? 'pt-BR' : article.locale === 'en_US' ? 'en-US' : 'pt-BR';
          const processedContent = addInternalLinksSafe(
            article.content,
            relatedArticles,
            locale,
            1 // Max 1 link per article in content
          );

          // Update article with processed content if changed
          if (processedContent !== article.content) {
            await prisma.article.update({
              where: { id: article.id },
              data: { content: processedContent },
            });
            article.content = processedContent;
          }
        }

        // Create ArticleArticle relationships
        await prisma.articleArticle.createMany({
          data: relatedArticleIds.map((relatedId, index) => ({
            articleId: article.id,
            relatedArticleId: relatedId,
            order: index,
          })),
          skipDuplicates: true,
        });
      }
    }

    // Fetch article with relations for response
    const articleWithRelations = await prisma.article.findUnique({
      where: { id: article.id },
      include: {
        category: true,
        relatedArticles: {
          include: {
            relatedArticle: {
              select: {
                id: true,
                title: true,
                slug: true,
                slugEn: true,
                slugPt: true,
              },
            },
          },
          orderBy: { order: 'asc' },
        } as any,
      },
    });

    res.json(articleWithRelations);
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

// ============================================
// IMAGE UPLOAD
// ============================================

import { upload } from '../middleware/upload';
import { uploadImageToS3 } from '../services/s3/upload';

adminRouter.post('/upload/image', upload.single('image'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const folder = (req.body.folder as string) || 'articles';

    const result = await uploadImageToS3({
      file: req.file,
      folder,
      fileName: req.body.fileName,
    });

    res.json({
      success: true,
      url: result.url,
      key: result.key,
      bucket: result.bucket,
    });
  } catch (error: any) {
    console.error('Error uploading image:', error);
    res.status(500).json({
      error: error.message || 'Failed to upload image',
    });
  }
});

// ============================================
// SOCIAL MEDIA PUBLISHING
// ============================================

import { postArticleToSocialMedia, type SocialMediaPlatform } from '../services/socialMedia';

const socialMediaPostSchema = z.object({
  platforms: z.array(z.enum(['facebook', 'instagram', 'twitter'])),
  customMessage: z.string().optional(),
});

adminRouter.post('/articles/:id/publish-social', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = socialMediaPostSchema.parse(req.body);

    const results = await postArticleToSocialMedia({
      articleId: id,
      platforms: data.platforms as SocialMediaPlatform[],
      customMessage: data.customMessage,
    });

    res.json({
      success: results.every((r) => r.success),
      results,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Error publishing to social media:', error);
    res.status(500).json({ error: error.message || 'Failed to publish to social media' });
  }
});

