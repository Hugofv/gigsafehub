import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';

export const jobOpportunitiesRouter: Router = Router();

/**
 * @swagger
 * /api/job-opportunities:
 *   get:
 *     summary: Get job opportunities
 *     tags: [Job Opportunities]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search query filter
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Location filter
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *           enum: [US, BR, UK, CA, AU, DE, FR, ES, PT, MX, AR, CL, CO, Other]
 *         description: Country filter
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of results to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of results to skip
 *     responses:
 *       200:
 *         description: List of job opportunities
 */
jobOpportunitiesRouter.get('/', async (req: Request, res: Response) => {
  try {
    const {
      query: searchQuery,
      location: searchLocation,
      country,
      active,
      limit = '50',
      offset = '0',
    } = req.query;

    const where: any = {};

    if (searchQuery) {
      where.searchQuery = searchQuery as string;
    }

    if (searchLocation) {
      where.searchLocation = searchLocation as string;
    }

    if (country) {
      where.country = country as string;
    }

    if (active !== undefined) {
      where.isActive = active === 'true';
    }

    const limitNum = parseInt(limit as string, 10);
    const offsetNum = parseInt(offset as string, 10);

    const [jobs, total] = await Promise.all([
      prisma.jobOpportunity.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        take: limitNum,
        skip: offsetNum,
      }),
      prisma.jobOpportunity.count({ where }),
    ]);

    res.json({
      jobs,
      pagination: {
        total,
        limit: limitNum,
        offset: offsetNum,
        hasMore: offsetNum + limitNum < total,
      },
    });
  } catch (error) {
    console.error('Error fetching job opportunities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/job-opportunities/{id}:
 *   get:
 *     summary: Get a specific job opportunity
 *     tags: [Job Opportunities]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Job opportunity details
 *       404:
 *         description: Job opportunity not found
 */
jobOpportunitiesRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const job = await prisma.jobOpportunity.findUnique({
      where: { id },
    });

    if (!job) {
      return res.status(404).json({ error: 'Job opportunity not found' });
    }

    res.json(job);
  } catch (error) {
    console.error('Error fetching job opportunity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /api/job-opportunities/stats:
 *   get:
 *     summary: Get job opportunities statistics
 *     tags: [Job Opportunities]
 *     responses:
 *       200:
 *         description: Job opportunities statistics
 */
jobOpportunitiesRouter.get('/stats/summary', async (req: Request, res: Response) => {
  try {
    const [total, active, byCountry, byQuery] = await Promise.all([
      prisma.jobOpportunity.count(),
      prisma.jobOpportunity.count({ where: { isActive: true } }),
      prisma.jobOpportunity.groupBy({
        by: ['country'],
        _count: true,
      }),
      prisma.jobOpportunity.groupBy({
        by: ['searchQuery'],
        _count: true,
        orderBy: {
          _count: {
            searchQuery: 'desc',
          },
        },
        take: 10,
      }),
    ]);

    res.json({
      total,
      active,
      inactive: total - active,
      byCountry: byCountry.map((item: { country: string; _count: number }) => ({
        country: item.country,
        count: item._count,
      })),
      topQueries: byQuery.map((item: { searchQuery: string; _count: number }) => ({
        query: item.searchQuery,
        count: item._count,
      })),
    });
  } catch (error) {
    console.error('Error fetching job opportunities stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
