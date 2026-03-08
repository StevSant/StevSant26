import { Injectable, inject, PLATFORM_ID, isDevMode } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

/**
 * Lightweight Web Vitals tracking service.
 * Uses the native PerformanceObserver API (no external dependency needed).
 * Tracks LCP, CLS, and INP — the three Core Web Vitals.
 * Logs to console in dev mode; can be extended to send to analytics.
 */
@Injectable({ providedIn: 'root' })
export class WebVitalsService {
  private platformId = inject(PLATFORM_ID);
  private metrics = new Map<string, WebVitalMetric>();

  /**
   * Start observing Core Web Vitals. Call once in the root layout.
   */
  init(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (typeof PerformanceObserver === 'undefined') return;

    this.observeLCP();
    this.observeCLS();
    this.observeINP();
  }

  private observeLCP(): void {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (last) {
          this.report({
            name: 'LCP',
            value: last.startTime,
            rating: last.startTime <= 2500 ? 'good' : last.startTime <= 4000 ? 'needs-improvement' : 'poor',
          });
        }
      });
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch { /* browser doesn't support this entry type */ }
  }

  private observeCLS(): void {
    try {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
        this.report({
          name: 'CLS',
          value: clsValue,
          rating: clsValue <= 0.1 ? 'good' : clsValue <= 0.25 ? 'needs-improvement' : 'poor',
        });
      });
      observer.observe({ type: 'layout-shift', buffered: true });
    } catch { /* browser doesn't support this entry type */ }
  }

  private observeINP(): void {
    try {
      let inpValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const duration = entry.duration;
          if (duration > inpValue) {
            inpValue = duration;
          }
        }
        this.report({
          name: 'INP',
          value: inpValue,
          rating: inpValue <= 200 ? 'good' : inpValue <= 500 ? 'needs-improvement' : 'poor',
        });
      });
      observer.observe({ type: 'event', buffered: true });
    } catch { /* browser doesn't support this entry type */ }
  }

  private report(metric: WebVitalMetric): void {
    this.metrics.set(metric.name, metric);
    if (isDevMode()) {
      const color = metric.rating === 'good' ? '#0cce6b' : metric.rating === 'needs-improvement' ? '#ffa400' : '#ff4e42';
      console.log(
        `%c[Web Vitals] ${metric.name}: ${metric.value.toFixed(metric.name === 'CLS' ? 3 : 0)} (${metric.rating})`,
        `color: ${color}; font-weight: bold;`
      );
    }
  }

  /** Get all collected metrics (useful for sending to analytics endpoint) */
  getMetrics(): Map<string, WebVitalMetric> {
    return new Map(this.metrics);
  }
}
