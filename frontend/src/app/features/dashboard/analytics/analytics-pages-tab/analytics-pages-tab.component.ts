import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { AnalyticsSummary } from '@core/models';
import { formatPagePath, formatDuration } from '../analytics-utils';

@Component({
  selector: 'app-analytics-pages-tab',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './analytics-pages-tab.component.html',
})
export class AnalyticsPagesTabComponent {
  summary = input.required<AnalyticsSummary>();

  formatPagePath = formatPagePath;
  formatDuration = formatDuration;
}
