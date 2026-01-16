import { Router, Request, Response } from 'express';
import { JobManager } from '../workers/JobManager';

export function createJobsRouter(jobManager: JobManager | null): Router {
  const jobsRouter = Router();

  /**
   * @swagger
   * /api/jobs:
   *   get:
   *     summary: Get status of all jobs
   *     tags: [Jobs]
   *     responses:
   *       200:
   *         description: List of all jobs with their status
   *       503:
   *         description: Job manager not available
   */
  jobsRouter.get('/', (req: Request, res: Response) => {
    if (!jobManager) {
      return res.status(503).json({ error: 'Job manager not available' });
    }

    const jobs = jobManager.getAllJobsStatus();
    res.json({
      jobs: jobs.map((job) => ({
        name: job.config.name,
        enabled: job.config.enabled,
        schedule: job.config.schedule,
        lastRun: job.lastRun,
        nextRun: job.nextRun,
        isRunning: job.isRunning,
        runCount: job.runCount,
        errorCount: job.errorCount,
      })),
    });
  });

  /**
   * @swagger
   * /api/jobs/{name}:
   *   get:
   *     summary: Get status of a specific job
   *     tags: [Jobs]
   *     parameters:
   *       - in: path
   *         name: name
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Job status
   *       404:
   *         description: Job not found
   *       503:
   *         description: Job manager not available
   */
  jobsRouter.get('/:name', (req: Request, res: Response) => {
    if (!jobManager) {
      return res.status(503).json({ error: 'Job manager not available' });
    }

    const { name } = req.params;
    const job = jobManager.getJobStatus(name);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({
      name: job.config.name,
      enabled: job.config.enabled,
      schedule: job.config.schedule,
      lastRun: job.lastRun,
      nextRun: job.nextRun,
      isRunning: job.isRunning,
      runCount: job.runCount,
      errorCount: job.errorCount,
    });
  });

  /**
   * @swagger
   * /api/jobs/{name}/run:
   *   post:
   *     summary: Manually trigger a job
   *     tags: [Jobs]
   *     parameters:
   *       - in: path
   *         name: name
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Job execution result
   *       404:
   *         description: Job not found
   *       503:
   *         description: Job manager not available
   */
  jobsRouter.post('/:name/run', async (req: Request, res: Response) => {
    if (!jobManager) {
      return res.status(503).json({ error: 'Job manager not available' });
    }

    const { name } = req.params;
    const result = await jobManager.executeJob(name);

    if (!result.success && result.error?.message === `Job ${name} not found`) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(result);
  });

  return jobsRouter;
}
