import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import type { ContentLocale } from '@prisma/client';

export const guidesRouter = Router();

/**
 * @swagger
 * /api/guides:
 *   get:
 *     summary: Get all guide pages
 *     tags: [Guides]
 *     parameters:
 *       - in: query
 *         name: locale
 *         schema:
 *           type: string
 *           enum: [en-US, pt-BR]
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of guides
 */
guidesRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { locale = 'en-US', category } = req.query;
    const prismaLocale = locale === 'pt-BR' ? 'pt_BR' : locale === 'en-US' ? 'en_US' : 'Both';

    const where: any = {
      robotsIndex: true,
      OR: [
        { locale: prismaLocale },
        { locale: 'Both' },
      ],
    };

    if (category) {
      where.category = category;
    }

    const guides = await prisma.guidePage.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedGuides = guides.map((guide) => {
      const currentSlug =
        (locale === 'pt-BR' && guide.slugPt) ? guide.slugPt :
        (locale === 'en-US' && guide.slugEn) ? guide.slugEn :
        guide.slug;

      return {
        id: guide.id,
        slug: currentSlug,
        slugEn: guide.slugEn || guide.slug,
        slugPt: guide.slugPt || guide.slug,
        title: guide.title,
        excerpt: guide.excerpt,
        category: guide.category,
        locale: guide.locale,
        metaTitle: guide.metaTitle,
        metaDescription: guide.metaDescription,
        lastModified: guide.lastModified?.toISOString(),
      };
    });

    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.json(formattedGuides);
  } catch (error) {
    console.error('Error fetching guides:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/guides/{slug}:
 *   get:
 *     summary: Get a guide by slug
 *     tags: [Guides]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: locale
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Guide details
 *       404:
 *         description: Guide not found
 */
guidesRouter.get('/:identifier', async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;
    const { locale = 'en-US' } = req.query;

    let guide = await prisma.guidePage.findFirst({
      where: {
        OR: [
          { slug: identifier },
          ...(locale === 'pt-BR' ? [{ slugPt: identifier }] : []),
          ...(locale === 'en-US' ? [{ slugEn: identifier }] : []),
        ],
      },
    });

    if (!guide) {
      guide = await prisma.guidePage.findUnique({
        where: { slug: identifier },
      });
    }

    if (!guide) {
      return res.status(404).json({ error: 'Guide not found' });
    }

    if (!guide.robotsIndex) {
      res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    }

    const currentSlug =
      (locale === 'pt-BR' && guide.slugPt) ? guide.slugPt :
      (locale === 'en-US' && guide.slugEn) ? guide.slugEn :
      guide.slug;

    const formattedGuide = {
      id: guide.id,
      slug: currentSlug,
      slugEn: guide.slugEn || guide.slug,
      slugPt: guide.slugPt || guide.slug,
      title: guide.title,
      excerpt: guide.excerpt,
      content: guide.content,
      category: guide.category,
      locale: guide.locale,
      imageUrl: guide.imageUrl,
      imageAlt: guide.imageAlt,
      metaTitle: guide.metaTitle,
      metaDescription: guide.metaDescription,
      metaKeywords: guide.metaKeywords,
      canonicalUrl: guide.canonicalUrl,
      structuredData: guide.structuredData ? JSON.parse(guide.structuredData) : null,
    };

    res.setHeader('Cache-Control', 'public, max-age=3600');
    if (guide.lastModified) {
      res.setHeader('Last-Modified', guide.lastModified.toUTCString());
    }

    res.json(formattedGuide);
  } catch (error) {
    console.error('Error fetching guide:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

