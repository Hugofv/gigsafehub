import { Router, type Request, type Response } from 'express';
import { prisma } from '../lib/prisma';
import type { ContentLocale } from '@prisma/client';

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
    const { locale = 'en-US', category, limit, sortBy = 'date', sortOrder = 'desc' } = req.query;
    const prismaLocale = locale === 'pt-BR' ? 'pt_BR' : locale === 'en-US' ? 'en_US' : 'Both';

    const where: any = {
      robotsIndex: true,
      articleType: 'blog', // Only blog articles, not guides
      OR: [
        { locale: prismaLocale as ContentLocale },
        { locale: 'Both' },
      ],
    };

    if (category) {
      where.categoryId = category as string;
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

    const formattedArticles = articles.map((article: any) => {
      const currentSlug =
        (locale === 'pt-BR' && article.slugPt) ? article.slugPt :
        (locale === 'en-US' && article.slugEn) ? article.slugEn :
        article.slug;

      return {
        id: article.id,
        slug: currentSlug,
        slugEn: article.slugEn || article.slug,
        slugPt: article.slugPt || article.slug,
        title: article.title,
        excerpt: article.excerpt,
        content: article.content,
        partnerTag: article.partnerTag,
        imageUrl: article.imageUrl,
        imageAlt: article.imageAlt,
        date: article.date.toISOString(),
        locale: article.locale,
        categoryId: article.categoryId,
        category: article.category ? {
          id: article.category.id,
          name: article.category.name,
          slug: article.category.slug,
          slugEn: article.category.slugEn,
          slugPt: article.category.slugPt,
        } : null,
        relatedProductIds: article.relatedProducts.map((rp: any) => rp.product.id),
        // SEO fields
        metaTitle: article.metaTitle,
        metaDescription: article.metaDescription,
        canonicalUrl: article.canonicalUrl,
        readingTime: article.readingTime,
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
    const { locale = 'en-US' } = req.query;

    // Try to find by localized slug first, then default slug
    let article = await prisma.article.findFirst({
      where: {
        OR: [
          { slug: identifier },
          ...(locale === 'pt-BR' ? [{ slugPt: identifier }] : []),
          ...(locale === 'en-US' ? [{ slugEn: identifier }] : []),
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

    // Fallback: try default slug if not found
    if (!article) {
      article = await prisma.article.findUnique({
        where: { slug: identifier },
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
      (locale === 'pt-BR' && article.slugPt) ? article.slugPt :
      (locale === 'en-US' && article.slugEn) ? article.slugEn :
      article.slug;

    const formattedArticle = {
      id: article.id,
      slug: currentSlug,
      slugEn: article.slugEn || article.slug,
      slugPt: article.slugPt || article.slug,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      partnerTag: article.partnerTag,
      imageUrl: article.imageUrl,
      imageAlt: article.imageAlt,
      date: article.date.toISOString(),
      locale: article.locale,
      categoryId: article.categoryId,
      category: article.category ? {
        id: article.category.id,
        name: article.category.name,
        slug: article.category.slug,
        slugEn: article.category.slugEn,
        slugPt: article.category.slugPt,
      } : null,
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

