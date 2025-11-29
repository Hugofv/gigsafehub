import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const faqRouter = Router();

/**
 * @swagger
 * /api/faq:
 *   get:
 *     summary: Get all FAQs
 *     tags: [FAQ]
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
 *         description: List of FAQs
 */
faqRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { locale = 'en-US', category } = req.query;
    const prismaLocale = locale === 'pt-BR' ? 'pt_BR' : locale === 'en-US' ? 'en_US' : 'Both';

    const where: any = {
      isPublished: true,
      OR: [
        { locale: prismaLocale },
        { locale: 'Both' },
      ],
    };

    if (category) {
      where.category = category;
    }

    const faqs = await prisma.fAQ.findMany({
      where,
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

