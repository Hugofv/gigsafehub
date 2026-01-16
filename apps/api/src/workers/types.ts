export interface JobConfig {
  name: string;
  schedule: string; // Cron expression
  enabled: boolean;
  runOnStartup?: boolean; // Run immediately on startup
  timeout?: number; // Timeout in milliseconds
  retryOnFailure?: boolean;
  maxRetries?: number;
}

export interface JobResult {
  success: boolean;
  message?: string;
  error?: Error;
  duration?: number;
}

export type JobHandler = () => Promise<void> | void;

export interface Job {
  config: JobConfig;
  handler: JobHandler;
  lastRun?: Date;
  nextRun?: Date;
  isRunning: boolean;
  runCount: number;
  errorCount: number;
}
