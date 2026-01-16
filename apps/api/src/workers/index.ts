import pino from 'pino';
import { JobManager } from './JobManager';
import { simplyHiredScraperJob } from './jobs/simplyHiredScraper';

/**
 * Initialize and configure all workers/jobs
 * This runs in parallel with the API and doesn't block it
 */
export function initializeWorkers(logger: pino.Logger): JobManager {
  const jobManager = new JobManager(logger);

  // Register all jobs here
  // SimplyHired scraper job - runs twice daily (6 AM and 6 PM)
  jobManager.registerJob(
    {
      name: 'simplyhired-scraper',
      schedule: '0 6,18 * * *', // Twice daily at 6 AM and 6 PM
      enabled: process.env.ENABLE_SIMPLYHIRED_SCRAPER === 'true',
      runOnStartup: false,
      timeout: 600000, // 10 minutes timeout
      retryOnFailure: true,
      maxRetries: 3,
    },
    simplyHiredScraperJob
  );

  logger.info({ jobCount: jobManager.getAllJobsStatus().length }, 'Workers initialized');

  return jobManager;
}
