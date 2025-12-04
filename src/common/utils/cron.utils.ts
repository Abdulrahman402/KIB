/**
 * Common Cron Job Utilities and Documentation
 *
 * This file provides utilities and documentation for cron jobs across the application.
 */

/**
 * Cron Expression Reference
 *
 * Format: second minute hour dayOfMonth month dayOfWeek
 * ┌────────────── second (optional, 0-59)
 * │ ┌──────────── minute (0-59)
 * │ │ ┌────────── hour (0-23)
 * │ │ │ ┌──────── day of month (1-31)
 * │ │ │ │ ┌────── month (1-12 or names)
 * │ │ │ │ │ ┌──── day of week (0-7 or names, 0 and 7 = Sunday)
 * │ │ │ │ │ │
 * * * * * * *
 */

/**
 * Common Cron Patterns
 */
export const CRON_PATTERNS = {
  // Every minute
  EVERY_MINUTE: '* * * * *',

  // Every 5 minutes
  EVERY_5_MINUTES: '*/5 * * * *',

  // Every 10 minutes
  EVERY_10_MINUTES: '*/10 * * * *',

  // Every 30 minutes
  EVERY_30_MINUTES: '*/30 * * * *',

  // Every hour
  EVERY_HOUR: '0 * * * *',

  // Every day at midnight
  DAILY_AT_MIDNIGHT: '0 0 * * *',

  // Every day at 1 AM
  DAILY_AT_1AM: '0 1 * * *',

  // Every day at 2 AM
  DAILY_AT_2AM: '0 2 * * *',

  // Every day at 3 AM
  DAILY_AT_3AM: '0 3 * * *',

  // Every Monday at 9 AM
  WEEKLY_MONDAY_9AM: '0 9 * * 1',

  // First day of month at midnight
  MONTHLY_FIRST_DAY: '0 0 1 * *',

  // Every 30 seconds
  EVERY_30_SECONDS: '*/30 * * * * *',
} as const;

/**
 * Cron Job Best Practices
 *
 * 1. Always use UTC timezone for consistency
 * 2. Add job names for easier identification and management
 * 3. Prevent overlapping executions with flags
 * 4. Log all job executions (start, success, failure)
 * 5. Store sync metadata in database for tracking
 * 6. Respect API rate limits (add delays between requests)
 * 7. Handle errors gracefully and log them
 * 8. Make jobs idempotent (safe to run multiple times)
 * 9. Use environment variables for configurable schedules
 * 10. Monitor job performance and failures
 */

/**
 * Example Usage:
 *
 * @Injectable()
 * export class MyService {
 *   private readonly logger = new Logger(MyService.name);
 *   private isProcessing = false;
 *
 *   @Cron(CRON_PATTERNS.DAILY_AT_2AM, {
 *     name: 'my-scheduled-task',
 *     timeZone: 'UTC',
 *   })
 *   async myScheduledTask(): Promise<void> {
 *     if (this.isProcessing) {
 *       this.logger.warn('Task already in progress, skipping...');
 *       return;
 *     }
 *
 *     this.isProcessing = true;
 *     this.logger.log('Starting scheduled task...');
 *
 *     try {
 *       // Your task logic here
 *
 *       this.logger.log('Scheduled task completed successfully');
 *     } catch (error) {
 *       this.logger.error(`Scheduled task failed: ${error.message}`, error.stack);
 *       throw error;
 *     } finally {
 *       this.isProcessing = false;
 *     }
 *   }
 * }
 */

/**
 * Utility: Delay execution
 * @param ms Milliseconds to delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Utility: Retry with exponential backoff
 * @param fn Function to retry
 * @param maxRetries Maximum number of retries
 * @param baseDelay Base delay in milliseconds
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt < maxRetries) {
        const delayMs = baseDelay * Math.pow(2, attempt);
        await delay(delayMs);
      }
    }
  }

  throw lastError;
}

/**
 * Utility: Batch process items
 * @param items Items to process
 * @param batchSize Number of items per batch
 * @param processBatch Function to process each batch
 * @param delayBetweenBatches Delay between batches in milliseconds
 */
export async function processBatches<T>(
  items: T[],
  batchSize: number,
  processBatch: (batch: T[]) => Promise<void>,
  delayBetweenBatches: number = 0,
): Promise<void> {
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    await processBatch(batch);

    if (delayBetweenBatches > 0 && i + batchSize < items.length) {
      await delay(delayBetweenBatches);
    }
  }
}
