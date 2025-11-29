import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const comparisonsRouter = Router();

/**
 * @swagger
 * /api/comparisons:
 *   get:
 *     summary: Get all comparison pages
 *     tags: [Comparisons]
 *     parameters:
 *       - in: query
 *         name: locale
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of comparisons
 */
comparisonsRouter.get('/', async (req: Request, res: Response) => {
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

    const comparisons = await prisma.comparisonPage.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedComparisons = comparisons.map((comparison) => {
      const currentSlug =
        (locale === 'pt-BR' && comparison.slugPt) ? comparison.slugPt :
        (locale === 'en-US' && comparison.slugEn) ? comparison.slugEn :
        comparison.slug;

      return {
        id: comparison.id,
        slug: currentSlug,
        slugEn: comparison.slugEn || comparison.slug,
        slugPt: comparison.slugPt || comparison.slug,
        title: comparison.title,
        description: comparison.description,
        category: comparison.category,
        productIds: comparison.productIds,
        locale: comparison.locale,
        metaTitle: comparison.metaTitle,
        metaDescription: comparison.metaDescription,
      };
    });

    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.json(formattedComparisons);
  } catch (error) {
    console.error('Error fetching comparisons:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/comparisons/{slug}:
 *   get:
 *     summary: Get a comparison by slug
 *     tags: [Comparisons]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comparison details
 *       404:
 *         description: Comparison not found
 */
comparisonsRouter.get('/:identifier', async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;
    const { locale = 'en-US' } = req.query;

    let comparison = await prisma.comparisonPage.findFirst({
      where: {
        OR: [
          { slug: identifier },
          ...(locale === 'pt-BR' ? [{ slugPt: identifier }] : []),
          ...(locale === 'en-US' ? [{ slugEn: identifier }] : []),
        ],
      },
    });

    if (!comparison) {
      comparison = await prisma.comparisonPage.findUnique({
        where: { slug: identifier },
      });
    }

    if (!comparison) {
      return res.status(404).json({ error: 'Comparison not found' });
    }

    // Fetch products for comparison
    const products = await prisma.financialProduct.findMany({
      where: {
        id: { in: comparison.productIds },
      },
      include: {
        pros: true,
        cons: true,
        features: true,
      },
    });

    const currentSlug =
      (locale === 'pt-BR' && comparison.slugPt) ? comparison.slugPt :
      (locale === 'en-US' && comparison.slugEn) ? comparison.slugEn :
      comparison.slug;

    const formattedComparison = {
      id: comparison.id,
      slug: currentSlug,
      slugEn: comparison.slugEn || comparison.slug,
      slugPt: comparison.slugPt || comparison.slug,
      title: comparison.title,
      description: comparison.description,
      category: comparison.category,
      products: products.map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        category: p.category,
        rating: p.rating,
        reviewsCount: p.reviewsCount,
        description: p.description,
        pros: p.pros.map((pro: any) => pro.text),
        cons: p.cons.map((con: any) => con.text),
        fees: p.fees,
        features: p.features.map((f: any) => f.text),
        safetyScore: p.safetyScore,
        logoUrl: p.logoUrl,
      })),
      metaTitle: comparison.metaTitle,
      metaDescription: comparison.metaDescription,
    };

    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.json(formattedComparison);
  } catch (error) {
    console.error('Error fetching comparison:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

