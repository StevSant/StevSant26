import { Component, input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { MatIcon } from '@angular/material/icon';
import { AnomalyDetectionData } from '@core/models/entities/analytics.model';
import { getCountryFlagEmoji } from '../analytics-utils';

@Component({
  selector: 'app-analytics-anomalies',
  standalone: true,
  imports: [CommonModule, DatePipe, TranslatePipe, MatIcon],
  templateUrl: './analytics-anomalies.component.html',
})
export class AnalyticsAnomaliesComponent {
  data = input.required<AnomalyDetectionData>();

  getCountryFlagEmoji = getCountryFlagEmoji;

  getAnomalyIcon(type: 'spike' | 'drop' | null): string {
    if (type === 'spike') return 'trending_up';
    if (type === 'drop') return 'trending_down';
    return 'remove';
  }

  getAnomalyColor(type: 'spike' | 'drop' | null): string {
    if (type === 'spike') return 'text-red-500';
    if (type === 'drop') return 'text-blue-500';
    return 'text-gray-400';
  }

  getAnomalyBg(type: 'spike' | 'drop' | null): string {
    if (type === 'spike') return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
    if (type === 'drop')
      return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    return '';
  }

  totalAnomalies(): number {
    const d = this.data();
    return d.daily_anomalies.length + d.referrer_bursts.length + d.geo_bursts.length;
  }
}
