import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { MatIcon } from '@angular/material/icon';
import { EngagementScoresData } from '@core/models/entities/analytics.model';
import { getDeviceIcon, getCountryFlagEmoji, formatDuration } from '../analytics-utils';

@Component({
  selector: 'app-analytics-engagement',
  standalone: true,
  imports: [CommonModule, TranslatePipe, MatIcon],
  templateUrl: './analytics-engagement.component.html',
})
export class AnalyticsEngagementComponent {
  data = input.required<EngagementScoresData>();

  getDeviceIcon = getDeviceIcon;
  getCountryFlagEmoji = getCountryFlagEmoji;
  formatDuration = formatDuration;

  totalVisitors = computed(() => {
    const d = this.data().distribution;
    return d.high + d.medium + d.low;
  });

  distributionBars = computed(() => {
    const d = this.data().distribution;
    const total = this.totalVisitors() || 1;
    return [
      {
        label: 'high',
        count: d.high,
        pct: Math.round((d.high / total) * 100),
        color: 'bg-emerald-500',
      },
      {
        label: 'medium',
        count: d.medium,
        pct: Math.round((d.medium / total) * 100),
        color: 'bg-amber-500',
      },
      { label: 'low', count: d.low, pct: Math.round((d.low / total) * 100), color: 'bg-red-400' },
    ];
  });

  getScoreColor(score: number): string {
    if (score >= 50) return 'text-emerald-600 dark:text-emerald-400';
    if (score >= 20) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-500 dark:text-red-400';
  }

  getScoreBg(score: number): string {
    if (score >= 50) return 'bg-emerald-500';
    if (score >= 20) return 'bg-amber-500';
    return 'bg-red-400';
  }
}
