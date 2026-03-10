import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { MatIcon } from '@angular/material/icon';
import { ActiveVisitor } from '@core/models/entities/analytics.model';
import { getDeviceIcon, getCountryFlagEmoji } from '../analytics-utils';

@Component({
  selector: 'app-analytics-active-visitors',
  standalone: true,
  imports: [CommonModule, TranslatePipe, MatIcon],
  templateUrl: './analytics-active-visitors.component.html',
})
export class AnalyticsActiveVisitorsComponent {
  visitors = input.required<ActiveVisitor[]>();
  closed = output<void>();

  getDeviceIcon = getDeviceIcon;
  getCountryFlagEmoji = getCountryFlagEmoji;

  timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const seconds = Math.floor(diff / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    return `${Math.floor(minutes / 60)}h`;
  }

  formatPage(path: string | null): string {
    if (!path) return '/';
    return path.length > 30 ? path.substring(0, 30) + '...' : path;
  }
}
