import cron from 'node-cron';
import pino from 'pino';
import { Job, JobConfig, JobHandler, JobResult } from './types';

export class JobManager {
  private jobs: Map<string, Job> = new Map();
  private logger: pino.Logger;
  private isShuttingDown = false;

  constructor(logger: pino.Logger) {
    this.logger = logger.child({ module: 'JobManager' });
  }

  /**
   * Register a new job
   */
  registerJob(config: JobConfig, handler: JobHandler): void {
    if (this.jobs.has(config.name)) {
      this.logger.warn({ jobName: config.name }, 'Job already registered, skipping');
      return;
    }

    const job: Job = {
      config,
      handler,
      isRunning: false,
      runCount: 0,
      errorCount: 0,
    };

    this.jobs.set(config.name, job);

    // Validate cron expression
    if (!cron.validate(config.schedule)) {
      this.logger.error(
        { jobName: config.name, schedule: config.schedule },
        'Invalid cron expression'
      );
      return;
    }

    // Schedule the job
    if (config.enabled) {
      const task = cron.schedule(config.schedule, async () => {
        if (!this.isShuttingDown) {
          await this.executeJob(config.name);
        }
      });

      // Store the task for cleanup
      (job as any).task = task;

      this.logger.info(
        {
          jobName: config.name,
          schedule: config.schedule,
          runOnStartup: config.runOnStartup,
        },
        'Job registered and scheduled'
      );

      // Run on startup if configured
      if (config.runOnStartup) {
        // Run after a short delay to ensure everything is initialized
        setTimeout(() => {
          this.executeJob(config.name).catch((error) => {
            this.logger.error({ jobName: config.name, error }, 'Error running job on startup');
          });
        }, 5000); // 5 seconds delay
      }
    } else {
      this.logger.info({ jobName: config.name }, 'Job registered but disabled');
    }
  }

  /**
   * Execute a job by name
   */
  async executeJob(jobName: string): Promise<JobResult> {
    const job = this.jobs.get(jobName);
    if (!job) {
      const error = new Error(`Job ${jobName} not found`);
      this.logger.error({ jobName }, error.message);
      return { success: false, error };
    }

    if (job.isRunning) {
      this.logger.warn({ jobName }, 'Job is already running, skipping');
      return { success: false, message: 'Job is already running' };
    }

    if (!job.config.enabled) {
      this.logger.debug({ jobName }, 'Job is disabled, skipping');
      return { success: false, message: 'Job is disabled' };
    }

    job.isRunning = true;
    job.lastRun = new Date();
    const startTime = Date.now();

    this.logger.info({ jobName }, 'Starting job execution');

    try {
      // Set timeout if configured
      if (job.config.timeout) {
        await Promise.race([
          job.handler(),
          new Promise<void>((_, reject) =>
            setTimeout(() => reject(new Error('Job timeout')), job.config.timeout)
          ),
        ]);
      } else {
        await job.handler();
      }

      const duration = Date.now() - startTime;
      job.runCount++;
      job.isRunning = false;

      this.logger.info({ jobName, duration }, 'Job completed successfully');

      return { success: true, duration };
    } catch (error) {
      const duration = Date.now() - startTime;
      job.errorCount++;
      job.isRunning = false;

      this.logger.error({ jobName, error, duration }, 'Job execution failed');

      // Retry if configured
      if (job.config.retryOnFailure && job.errorCount <= (job.config.maxRetries || 3)) {
        this.logger.info(
          { jobName, retryCount: job.errorCount, maxRetries: job.config.maxRetries || 3 },
          'Retrying job after failure'
        );
        // Retry after 1 minute
        setTimeout(() => {
          this.executeJob(jobName).catch((err) => {
            this.logger.error({ jobName, error: err }, 'Error in retry');
          });
        }, 60000);
      }

      return { success: false, error: error as Error, duration };
    }
  }

  /**
   * Get job status
   */
  getJobStatus(jobName: string): Job | undefined {
    return this.jobs.get(jobName);
  }

  /**
   * Get all jobs status
   */
  getAllJobsStatus(): Job[] {
    return Array.from(this.jobs.values());
  }

  /**
   * Enable a job
   */
  enableJob(jobName: string): void {
    const job = this.jobs.get(jobName);
    if (job) {
      job.config.enabled = true;
      this.logger.info({ jobName }, 'Job enabled');
    }
  }

  /**
   * Disable a job
   */
  disableJob(jobName: string): void {
    const job = this.jobs.get(jobName);
    if (job) {
      job.config.enabled = false;
      this.logger.info({ jobName }, 'Job disabled');
    }
  }

  /**
   * Shutdown all jobs gracefully
   */
  async shutdown(): Promise<void> {
    this.logger.info('Shutting down job manager');
    this.isShuttingDown = true;

    // Wait for running jobs to complete (with timeout)
    const runningJobs = Array.from(this.jobs.values()).filter((job) => job.isRunning);
    if (runningJobs.length > 0) {
      this.logger.info({ count: runningJobs.length }, 'Waiting for running jobs to complete');
      await Promise.race([
        Promise.all(
          runningJobs.map((job) =>
            new Promise<void>((resolve) => {
              const checkInterval = setInterval(() => {
                if (!job.isRunning) {
                  clearInterval(checkInterval);
                  resolve();
                }
              }, 100);
            })
          )
        ),
        new Promise<void>((resolve) => setTimeout(resolve, 30000)), // 30 second timeout
      ]);
    }

    // Stop all cron tasks
    for (const job of this.jobs.values()) {
      const task = (job as any).task;
      if (task) {
        task.stop();
      }
    }

    this.logger.info('Job manager shut down complete');
  }
}
