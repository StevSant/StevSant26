import { Component, signal, inject, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { MatIcon } from '@angular/material/icon';
import { AnalyticsDashboardService } from '@core/services/analytics-dashboard.service';
import { PeriodComparisonData } from '@core/models/entities/analytics.model';
import { formatDuration } from '../analytics-utils';

@Component({
  selector: 'app-analytics-period-comparison',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, TranslatePipe, MatIcon],
  templateUrl: './analytics-period-comparison.component.html',
})
export class AnalyticsPeriodComparisonComponent {
  private analyticsService = inject(AnalyticsDashboardService);

  data = signal<PeriodComparisonData | null>(null);
  loading = signal(false);

  startA = signal('');
  endA = signal('');
  startB = signal('');
  endB = signal('');

  formatDuration = formatDuration;

  metrics = computed(() => {
    const d = this.data();
    if (!d) return [];
    const a = d.period_a;
    const b = d.period_b;
    return [
      { label: 'analytics.totalViews', a: a.total_views, b: b.total_views, icon: 'visibility' },
      {
        label: 'analytics.uniqueVisitors',
        a: a.unique_visitors,
        b: b.unique_visitors,
        icon: 'group',
      },
      { label: 'analytics.potentialRecruiters', a: a.recruiters, b: b.recruiters, icon: 'work' },
      { label: 'analytics.cvDownloads', a: a.cv_downloads, b: b.cv_downloads, icon: 'download' },
      {
        label: 'analytics.avgDuration',
        a: a.avg_duration ?? 0,
        b: b.avg_duration ?? 0,
        icon: 'schedule',
        isDuration: true,
      },
      {
        label: 'analytics.insights.bounceRate',
        a: Math.round(a.bounce_rate ?? 0),
        b: Math.round(b.bounce_rate ?? 0),
        icon: 'exit_to_app',
        isPercent: true,
      },
    ];
  });

  maxDailyViews = computed(() => {
    const d = this.data();
    if (!d) return 1;
    const allViews = [...(d.daily_a || []), ...(d.daily_b || [])].map((v) => v.views);
    return Math.max(1, ...allViews);
  });

  constructor() {
    const now = new Date();
    const end = now.toISOString().substring(0, 10);
    const start30 = new Date(now.getTime() - 30 * 86400000).toISOString().substring(0, 10);
    const start60 = new Date(now.getTime() - 60 * 86400000).toISOString().substring(0, 10);
    const end30 = new Date(now.getTime() - 31 * 86400000).toISOString().substring(0, 10);

    this.startA.set(start30);
    this.endA.set(end);
    this.startB.set(start60);
    this.endB.set(end30);
  }

  async compare(): Promise<void> {
    this.loading.set(true);
    const result = await this.analyticsService.getPeriodComparison(
      this.startA(),
      this.endA(),
      this.startB(),
      this.endB(),
    );
    this.data.set(result);
    this.loading.set(false);
  }

  getDelta(a: number, b: number): { pct: number; dir: 'up' | 'down' | 'neutral' } {
    if (b === 0) return a > 0 ? { pct: 100, dir: 'up' } : { pct: 0, dir: 'neutral' };
    const pct = Math.round(((a - b) / b) * 100);
    if (pct > 0) return { pct, dir: 'up' };
    if (pct < 0) return { pct: Math.abs(pct), dir: 'down' };
    return { pct: 0, dir: 'neutral' };
  }

  getDeltaColor(dir: 'up' | 'down' | 'neutral'): string {
    if (dir === 'up') return 'text-emerald-600 dark:text-emerald-400';
    if (dir === 'down') return 'text-red-500 dark:text-red-400';
    return 'text-gray-400';
  }

  getBarHeight(views: number): number {
    return Math.max(2, (views / this.maxDailyViews()) * 100);
  }
}
