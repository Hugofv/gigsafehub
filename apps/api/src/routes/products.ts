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
    const products = await prisma.financialProduct.findMany({
      include: {
        pros: true,
        cons: true,
        features: true,
      },
      orderBy: {
        safetyScore: 'desc',
      },
    });

    // Transform to match the expected format
    const formattedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      category: product.category,
      rating: product.rating,
      reviewsCount: product.reviewsCount,
      description: product.description,
      pros: product.pros.map((p) => p.text),
      cons: product.cons.map((c) => c.text),
      fees: product.fees,
      features: product.features.map((f) => f.text),
      affiliateLink: product.affiliateLink,
      safetyScore: product.safetyScore,
      logoUrl: product.logoUrl,
    }));

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
productsRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const product = await prisma.financialProduct.findUnique({
      where: { id: req.params.id },
      include: {
        pros: true,
        cons: true,
        features: true,
      },
    });

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const formattedProduct = {
      id: product.id,
      name: product.name,
      category: product.category,
      rating: product.rating,
      reviewsCount: product.reviewsCount,
      description: product.description,
      pros: product.pros.map((p) => p.text),
      cons: product.cons.map((c) => c.text),
      fees: product.fees,
      features: product.features.map((f) => f.text),
      affiliateLink: product.affiliateLink,
      safetyScore: product.safetyScore,
      logoUrl: product.logoUrl,
    };

    res.json(formattedProduct);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

