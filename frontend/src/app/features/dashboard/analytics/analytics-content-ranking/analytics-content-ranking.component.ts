import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { MatIcon } from '@angular/material/icon';
import { ContentRankingItem } from '@core/models/entities/analytics.model';
import { formatDuration, formatPagePath } from '../analytics-utils';

@Component({
  selector: 'app-analytics-content-ranking',
  standalone: true,
  imports: [CommonModule, TranslatePipe, MatIcon],
  templateUrl: './analytics-content-ranking.component.html',
})
export class AnalyticsContentRankingComponent {
  items = input.required<ContentRankingItem[]>();

  formatDuration = formatDuration;
  formatPagePath = formatPagePath;

  getScoreWidth(score: number): number {
    const items = this.items();
    if (!items.length) return 0;
    const max = Math.max(1, items[0]?.content_score ?? 1);
    return Math.max(5, (score / max) * 100);
  }

  getMedalIcon(index: number): string | null {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return null;
  }
}
