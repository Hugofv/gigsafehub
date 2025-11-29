import { Router, Request, Response } from 'express';
import { config } from '../config';

export const healthRouter = Router();

const startTime = Date.now();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 uptime:
 *                   type: number
 *                 timestamp:
 *                   type: string
 *                 commit:
 *                   type: string
 */
healthRouter.get('/', (req: Request, res: Response) => {
  const uptime = Math.floor((Date.now() - startTime) / 1000);
  
  res.json({
    status: 'ok',
    uptime,
    timestamp: new Date().toISOString(),
    commit: process.env.GIT_COMMIT || 'unknown',
    environment: config.nodeEnv,
  });
});

