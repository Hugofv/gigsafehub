import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';

export const productsRouter = Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all financial products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 */
productsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { categoryId, country } = req.query;

    // Build where clause
    const where: any = {
      robotsIndex: true, // Only return indexable products
    };

    if (categoryId) {
      where.categoryId = categoryId as string;
    }

    if (country) {
      where.country = country;
    }

    const products = await prisma.financialProduct.findMany({
      where,
      include: {
        category: {
          include: {
            parent: true,
          },
        },
        pros: true,
        cons: true,
        features: true,
      },
      orderBy: {
        safetyScore: 'desc',
      },
    });

        // Transform to match the expected format
        const formattedProducts = products.map((product: any) => ({
      id: product.id,
      slug: product.slug,
      slugEn: product.slugEn,
      slugPt: product.slugPt,
      name: product.name,
      category: {
        id: product.category.id,
        name: product.category.name,
        slug: product.category.slug,
        level: product.category.level,
        parent: product.category.parent ? {
          id: product.category.parent.id,
          name: product.category.parent.name,
          slug: product.category.parent.slug,
        } : null,
      },
      country: product.country,
      rating: product.rating,
      reviewsCount: product.reviewsCount,
      description: product.description,
      pros: product.pros.map((p: any) => p.text),
      cons: product.cons.map((c: any) => c.text),
      fees: product.fees,
      features: product.features.map((f: any) => f.text),
      affiliateLink: product.affiliateLink,
      safetyScore: product.safetyScore,
      logoUrl: product.logoUrl,
      logoAlt: product.logoAlt,
    }));

    // SEO headers
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
    res.setHeader('X-Content-Type-Options', 'nosniff');

    res.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 */
productsRouter.get('/:identifier', async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;
    const { locale = 'en-US' } = req.query;

    // Try to find by ID first, then by slug (localized or default)
    let product = await prisma.financialProduct.findFirst({
      where: {
        OR: [
          { id: identifier },
          { slug: identifier },
          ...(locale === 'pt-BR' ? [{ slugPt: identifier }] : []),
          ...(locale === 'en-US' ? [{ slugEn: identifier }] : []),
        ],
      },
      include: {
        pros: true,
        cons: true,
        features: true,
      },
    });

    // Fallback: try default slug if not found
    if (!product) {
      product = await prisma.financialProduct.findUnique({
        where: { slug: identifier },
        include: {
          pros: true,
          cons: true,
          features: true,
        },
      });
    }

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if product should be indexed
    if (!product.robotsIndex) {
      res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    }

    // Get the correct slug for the locale
    const currentSlug =
      (locale === 'pt-BR' && product.slugPt) ? product.slugPt :
      (locale === 'en-US' && product.slugEn) ? product.slugEn :
      product.slug;

    const formattedProduct = {
      id: product.id,
      slug: currentSlug,
      slugEn: product.slugEn || product.slug,
      slugPt: product.slugPt || product.slug,
      name: product.name,
      category: product.category,
      rating: product.rating,
      reviewsCount: product.reviewsCount,
      description: product.description,
      pros: product.pros.map((p: any) => p.text),
      cons: product.cons.map((c: any) => c.text),
      fees: product.fees,
      features: product.features.map((f: any) => f.text),
      affiliateLink: product.affiliateLink,
      safetyScore: product.safetyScore,
      logoUrl: product.logoUrl,
      logoAlt: product.logoAlt,
      // SEO fields
      metaTitle: product.metaTitle,
      metaDescription: product.metaDescription,
      canonicalUrl: product.canonicalUrl,
      structuredData: product.structuredData ? JSON.parse(product.structuredData) : null,
    };

    // SEO headers
    res.setHeader('Cache-Control', 'public, max-age=3600');
    if (product.lastModified) {
      res.setHeader('Last-Modified', product.lastModified.toUTCString());
    }

    res.json(formattedProduct);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

