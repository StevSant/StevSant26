import { Component, input, computed } from '@angular/core';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { MatIcon } from '@angular/material/icon';
import { AnalyticsSummary } from '@core/models';
import { AnalyticsComparison } from '@core/models/entities/analytics.model';
import { formatDuration } from '../analytics-utils';

@Component({
  selector: 'app-analytics-kpi-cards',
  standalone: true,
  imports: [TranslatePipe, MatIcon],
  templateUrl: './analytics-kpi-cards.component.html',
})
export class AnalyticsKpiCardsComponent {
  summary = input.required<AnalyticsSummary>();
  comparison = input<AnalyticsComparison | null>(null);

  avgViewsPerVisitor = computed(() => {
    const s = this.summary();
    if (!s.unique_visitors) return '0';
    return (s.total_views / s.unique_visitors).toFixed(1);
  });

  avgSessionDuration = computed(() => {
    return formatDuration(this.summary().avg_session_duration ?? 0);
  });

  getDelta(
    current: number,
    previous: number,
  ): { percent: number; direction: 'up' | 'down' | 'neutral' } {
    if (previous === 0) {
      return current > 0 ? { percent: 100, direction: 'up' } : { percent: 0, direction: 'neutral' };
    }
    const percent = Math.round(((current - previous) / previous) * 100);
    if (percent > 0) return { percent, direction: 'up' };
    if (percent < 0) return { percent: Math.abs(percent), direction: 'down' };
    return { percent: 0, direction: 'neutral' };
  }

  getDeltaClasses(direction: 'up' | 'down' | 'neutral'): string {
    if (direction === 'up') return 'text-emerald-600 dark:text-emerald-400';
    if (direction === 'down') return 'text-red-500 dark:text-red-400';
    return 'text-gray-400 dark:text-gray-500';
  }

  getDeltaIcon(direction: 'up' | 'down' | 'neutral'): string {
    if (direction === 'up') return '↑';
    if (direction === 'down') return '↓';
    return '—';
  }
}
