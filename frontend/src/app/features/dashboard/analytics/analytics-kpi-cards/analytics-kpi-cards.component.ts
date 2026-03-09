import { Component, input, computed } from '@angular/core';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { MatIcon } from '@angular/material/icon';
import { AnalyticsSummary } from '@core/models';
import { formatDuration } from '../analytics-utils';

@Component({
  selector: 'app-analytics-kpi-cards',
  standalone: true,
  imports: [TranslatePipe, MatIcon],
  templateUrl: './analytics-kpi-cards.component.html',
})
export class AnalyticsKpiCardsComponent {
  summary = input.required<AnalyticsSummary>();

  avgViewsPerVisitor = computed(() => {
    const s = this.summary();
    if (!s.unique_visitors) return '0';
    return (s.total_views / s.unique_visitors).toFixed(1);
  });

  avgSessionDuration = computed(() => {
    return formatDuration(this.summary().avg_session_duration ?? 0);
  });
}
