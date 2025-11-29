import { Router, Request, Response } from 'express';
import { z } from 'zod';
import type { InsuranceQuote, Coverage } from '@gigsafehub/types';

export const quotesRouter = Router();

const quoteSchema = z.object({
  productId: z.string().min(1),
  coverage: z.object({
    type: z.enum(['basic', 'standard', 'premium']),
    amount: z.number().positive(),
    deductible: z.number().nonnegative(),
    features: z.array(z.string()),
  }),
});

/**
 * @swagger
 * /api/quotes:
 *   get:
 *     summary: Get insurance quotes
 *     tags: [Quotes]
 *     responses:
 *       200:
 *         description: List of quotes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/InsuranceQuote'
 */
quotesRouter.get('/', (req: Request, res: Response) => {
  // Mock data - replace with actual database query
  const mockQuotes: InsuranceQuote[] = [
    {
      id: '1',
      userId: 'user-1',
      productId: 'product-1',
      coverage: {
        type: 'standard',
        amount: 100000,
        deductible: 1000,
        features: ['liability', 'property'],
      },
      premium: 500,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  res.json(mockQuotes);
});

/**
 * @swagger
 * /api/quotes:
 *   post:
 *     summary: Create a new insurance quote
 *     tags: [Quotes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - coverage
 *             properties:
 *               productId:
 *                 type: string
 *               coverage:
 *                 type: object
 *     responses:
 *       201:
 *         description: Quote created successfully
 *       400:
 *         description: Invalid input
 */
quotesRouter.post('/', (req: Request, res: Response) => {
  try {
    const validated = quoteSchema.parse(req.body);
    
    // Mock quote creation
    const newQuote: InsuranceQuote = {
      id: Date.now().toString(),
      userId: 'user-1', // In real app, get from JWT token
      productId: validated.productId,
      coverage: validated.coverage as Coverage,
      premium: validated.coverage.amount * 0.005, // Mock calculation
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    };

    res.status(201).json(newQuote);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
      return;
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

