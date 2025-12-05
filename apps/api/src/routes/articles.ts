import { Router, type Request, type Response } from 'express';
import { prisma } from '../lib/prisma';
import type { ContentLocale } from '@prisma/client';
import { sanitizeText } from '../utils/sanitize';

export const articlesRouter: Router = Router();

/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Get all articles
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: locale
 *         schema:
 *           type: string
 *           enum: [en-US, pt-BR]
 *     responses:
 *       200:
 *         description: List of articles
 */
articlesRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { locale = 'pt-BR', category, categoryId, limit, sortBy = 'date', sortOrder = 'desc' } = req.query;
    const prismaLocale = locale === 'pt-BR' ? 'pt_BR' : locale === 'en-US' ? 'en_US' : 'Both';

    const where: any = {
      robotsIndex: true,
      articleType: 'blog', // Only blog articles, not guides
      OR: [{ locale: prismaLocale as ContentLocale }, { locale: 'Both' }],
    };

    // Support both 'category' and 'categoryId' query parameters
    const categoryFilter = categoryId || category;
    if (categoryFilter) {
      where.categoryId = categoryFilter as string;
    }

    // Build orderBy clause
    const orderBy: any = {};
    if (sortBy === 'date') {
      orderBy.date = sortOrder === 'asc' ? 'asc' : 'desc';
    } else if (sortBy === 'title') {
      orderBy.title = sortOrder === 'asc' ? 'asc' : 'desc';
    } else {
      orderBy.date = 'desc'; // Default
    }

    const articles = await prisma.article.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            slugEn: true,
            slugPt: true,
          },
        },
        relatedProducts: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                logoUrl: true,
              },
            },
          },
        },
      },
      orderBy,
      ...(limit && { take: parseInt(limit as string, 10) }),
    });

    // Sort articles to prioritize the requested locale over 'Both'
    // This ensures pt-BR articles appear first when locale is pt-BR
    const sortedArticles = articles.sort((a, b) => {
      if (a.locale === prismaLocale && b.locale !== prismaLocale) return -1;
      if (a.locale !== prismaLocale && b.locale === prismaLocale) return 1;
      return 0;
    });

    const formattedArticles = sortedArticles.map((article: any) => {
      const currentSlug =
        locale === 'pt-BR' && article.slugPt
          ? article.slugPt
          : locale === 'en-US' && article.slugEn
            ? article.slugEn
            : article.slug;

      return {
        id: article.id,
        slug: currentSlug,
        slugEn: article.slugEn || article.slug,
        slugPt: article.slugPt || article.slug,
        title: article.title,
        titleMenu: article.titleMenu || article.title,
        excerpt: article.excerpt,
        content: article.content,
        partnerTag: article.partnerTag,
        imageUrl: article.imageUrl,
        imageAlt: article.imageAlt,
        date: article.date.toISOString(),
        locale: article.locale,
        categoryId: article.categoryId,
        category: article.category
          ? {
              id: article.category.id,
              name: article.category.name,
              slug: article.category.slug,
              slugEn: article.category.slugEn,
              slugPt: article.category.slugPt,
            }
          : null,
        relatedProductIds: article.relatedProducts.map((rp: any) => rp.product.id),
        // SEO fields
        metaTitle: article.metaTitle,
        metaDescription: article.metaDescription,
        canonicalUrl: article.canonicalUrl,
        readingTime: article.readingTime,
        showInMenu: article.showInMenu || false,
      };
    });

    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.json(formattedArticles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/articles/{articleId}/comments:
 *   get:
 *     summary: Get comments for an article
 *     tags: [Articles, Comments]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of approved comments
 *       404:
 *         description: Article not found
 */
articlesRouter.get('/:articleId/comments', async (req: Request, res: Response) => {
  try {
    const { articleId } = req.params;

    // Verify article exists
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Get only approved comments, ordered by creation date (newest first)
    const comments = await prisma.comment.findMany({
      where: {
        articleId,
        isApproved: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/articles/{slug}:
 *   get:
 *     summary: Get an article by slug
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article details
 *       404:
 *         description: Article not found
 */
articlesRouter.get('/:identifier', async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;
    const { locale = 'pt-BR' } = req.query;

    // Convert locale format from 'pt-BR'/'en-US' to 'pt_BR'/'en_US'/'Both'
    // Filter to only return articles that match the requested locale
    const prismaLocale: ContentLocale = locale === 'pt-BR' ? 'pt_BR' : 'en_US';

    // Try to find by localized slug first, then default slug
    // Filter by article locale to ensure we get the correct language version
    let article = await prisma.article.findFirst({
      where: {
        AND: [
          {
            OR: [
              { slug: identifier },
              ...(locale === 'pt-BR' ? [{ slugPt: identifier }] : []),
              ...(locale === 'en-US' ? [{ slugEn: identifier }] : []),
            ],
          },
          {
            OR: [
              { locale: prismaLocale },
              { locale: 'Both' },
            ],
          },
        ],
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            slugEn: true,
            slugPt: true,
          },
        },
        relatedProducts: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                slugEn: true,
                slugPt: true,
                logoUrl: true,
                category: true,
                rating: true,
                safetyScore: true,
              },
            },
          },
        },
      },
    });

    // Fallback: try default slug if not found, but still filter by locale
    if (!article) {
      article = await prisma.article.findFirst({
        where: {
          AND: [
            { slug: identifier },
            {
              OR: [
                { locale: prismaLocale },
                { locale: 'Both' },
              ],
            },
          ],
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
              slugEn: true,
              slugPt: true,
            },
          },
          relatedProducts: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  slugEn: true,
                  slugPt: true,
                  logoUrl: true,
                  category: true,
                  rating: true,
                  safetyScore: true,
                },
              },
            },
          },
        },
      });
    }

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    if (!article.robotsIndex) {
      res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    }

    // Get the correct slug for the locale
    const currentSlug =
      locale === 'pt-BR' && article.slugPt
        ? article.slugPt
        : locale === 'en-US' && article.slugEn
          ? article.slugEn
          : article.slug;

    const formattedArticle = {
      id: article.id,
      slug: currentSlug,
      slugEn: article.slugEn || article.slug,
      slugPt: article.slugPt || article.slug,
      title: article.title,
      titleMenu: article.titleMenu || article.title,
      excerpt: article.excerpt,
      content: article.content,
      partnerTag: article.partnerTag,
      imageUrl: article.imageUrl,
      imageAlt: article.imageAlt,
      date: article.date.toISOString(),
      locale: article.locale,
      categoryId: article.categoryId,
      category: article.category
        ? {
            id: article.category.id,
            name: article.category.name,
            slug: article.category.slug,
            slugEn: article.category.slugEn,
            slugPt: article.category.slugPt,
          }
        : null,
      relatedProductIds: article.relatedProducts.map((rp: any) => rp.product.id),
      // SEO fields
      metaTitle: article.metaTitle,
      metaDescription: article.metaDescription,
      metaKeywords: article.metaKeywords,
      ogTitle: article.ogTitle,
      ogDescription: article.ogDescription,
      ogImage: article.ogImage,
      canonicalUrl: article.canonicalUrl,
      structuredData: article.structuredData ? JSON.parse(article.structuredData) : null,
      readingTime: article.readingTime,
      showInMenu: article.showInMenu || false,
    };

    res.setHeader('Cache-Control', 'public, max-age=3600');
    if (article.lastModified) {
      res.setHeader('Last-Modified', article.lastModified.toUTCString());
    }

    res.json(formattedArticle);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/articles/menu:
 *   get:
 *     summary: Get articles that should appear in navigation menu
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: locale
 *         schema:
 *           type: string
 *           enum: [en-US, pt-BR]
 *     responses:
 *       200:
 *         description: List of menu articles
 */
articlesRouter.get('/menu', async (req: Request, res: Response) => {
  try {
    const { locale = 'pt-BR' } = req.query;
    const prismaLocale = locale === 'pt-BR' ? 'pt_BR' : locale === 'en-US' ? 'en_US' : 'Both';

    const articles = await prisma.article.findMany({
      where: {
        showInMenu: true,
        robotsIndex: true,
        OR: [{ locale: prismaLocale as ContentLocale }, { locale: 'Both' }],
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            slugEn: true,
            slugPt: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    const formattedArticles = articles.map((article: any) => {
      const currentSlug =
        locale === 'pt-BR' && article.slugPt
          ? article.slugPt
          : locale === 'en-US' && article.slugEn
            ? article.slugEn
            : article.slug;

      return {
        id: article.id,
        title: article.title,
        titleMenu: article.titleMenu || article.title,
        slug: currentSlug,
        slugEn: article.slugEn || article.slug,
        slugPt: article.slugPt || article.slug,
        category: article.category
          ? {
              id: article.category.id,
              name: article.category.name,
              slug: article.category.slug,
              slugEn: article.category.slugEn,
              slugPt: article.category.slugPt,
            }
          : null,
      };
    });

    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.json(formattedArticles);
  } catch (error) {
    console.error('Error fetching menu articles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/articles/{articleId}/comments:
 *   get:
 *     summary: Get comments for an article
 *     tags: [Articles, Comments]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of approved comments
 *       404:
 *         description: Article not found
 */
articlesRouter.get('/:articleId/comments', async (req: Request, res: Response) => {
  try {
    const { articleId } = req.params;

    // Verify article exists
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Get only approved comments, ordered by creation date (newest first)
    const comments = await prisma.comment.findMany({
      where: {
        articleId,
        isApproved: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/articles/{articleId}/comments:
 *   post:
 *     summary: Create a new comment for an article
 *     tags: [Articles, Comments]
 *     parameters:
 *       - in: path
 *         name: articleId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Article not found
 */
articlesRouter.post('/:articleId/comments', async (req: Request, res: Response) => {
  try {
    const { articleId } = req.params;
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Verify article exists
    const article = await prisma.article.findUnique({
      where: { id: articleId },
    });

    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }

    // Sanitize comment data
    const sanitizedName = sanitizeText(name.trim());
    const sanitizedMessage = sanitizeText(message.trim());

    // Create comment (approved by default)
    const comment = await prisma.comment.create({
      data: {
        articleId,
        name: sanitizedName,
        email: email.trim().toLowerCase(),
        message: sanitizedMessage,
        isApproved: true, // Comments are approved by default
      },
    });

    // Return success message with comment data
    res.status(201).json({
      success: true,
      message: 'Comment submitted successfully.',
      comment: {
        id: comment.id,
        name: comment.name,
        message: comment.message,
        createdAt: comment.createdAt.toISOString(),
        isApproved: comment.isApproved,
      },
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
