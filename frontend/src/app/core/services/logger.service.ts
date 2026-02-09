import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

/**
 * Environment-aware logger service.
 * Suppresses all output in production builds.
 * Use instead of console.log/error/warn throughout the app.
 */
@Injectable({ providedIn: 'root' })
export class LoggerService {
  private readonly enabled = !environment.production;

  log(message: string, ...args: unknown[]): void {
    if (this.enabled) console.log(message, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    if (this.enabled) console.error(message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    if (this.enabled) console.warn(message, ...args);
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.enabled) console.debug(message, ...args);
  }
}

/**
 * Standalone logger for non-DI contexts (plain classes, utilities).
 * Uses the same environment-aware logic.
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
