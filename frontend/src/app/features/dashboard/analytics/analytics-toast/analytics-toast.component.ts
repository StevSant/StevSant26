import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AnalyticsAlertsService } from '@core/services/analytics-alerts.service';

@Component({
  selector: 'app-analytics-toast',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './analytics-toast.component.html',
  styleUrl: './analytics-toast.component.css',
})
export class AnalyticsToastComponent {
  alertsService = inject(AnalyticsAlertsService);

  getColorClasses(color: string): string {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-200',
      green: 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-200',
      purple: 'bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-950/50 dark:border-purple-800 dark:text-purple-200',
      orange: 'bg-orange-50 border-orange-200 text-orange-800 dark:bg-orange-950/50 dark:border-orange-800 dark:text-orange-200',
    };
    return colorMap[color] ?? colorMap['blue'];
  }

  getIconColor(color: string): string {
    const iconColors: Record<string, string> = {
      blue: 'text-blue-500',
      green: 'text-emerald-500',
      purple: 'text-purple-500',
      orange: 'text-orange-500',
    };
    return iconColors[color] ?? 'text-blue-500';
  }
}
