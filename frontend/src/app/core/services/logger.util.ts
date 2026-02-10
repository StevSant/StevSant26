import { environment } from '../../../environments/environment';

/**
 * Standalone logger for non-DI contexts (plain classes, utilities).
 * Uses the same environment-aware logic as LoggerService.
 */
export const logger = {
  log: (message: string, ...args: unknown[]) => {
    if (!environment.production) console.log(message, ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    if (!environment.production) console.error(message, ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    if (!environment.production) console.warn(message, ...args);
  },
};
