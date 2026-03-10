import { Component, input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { TranslateService } from '@core/services/translate.service';
import { HeatmapCell } from '@core/models/entities/analytics.model';

@Component({
  selector: 'app-analytics-heatmap',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './analytics-heatmap.component.html',
})
export class AnalyticsHeatmapComponent {
  private translate = inject(TranslateService);

  cells = input.required<HeatmapCell[]>();

  hours = Array.from({ length: 24 }, (_, i) => i);

  dayLabels = computed(() => [
    this.translate.instant('analytics.heatmap.sun'),
    this.translate.instant('analytics.heatmap.mon'),
    this.translate.instant('analytics.heatmap.tue'),
    this.translate.instant('analytics.heatmap.wed'),
    this.translate.instant('analytics.heatmap.thu'),
    this.translate.instant('analytics.heatmap.fri'),
    this.translate.instant('analytics.heatmap.sat'),
  ]);

  grid = computed(() => {
    const data = this.cells();
    const matrix: number[][] = Array.from({ length: 7 }, () => Array(24).fill(0));
    for (const cell of data) {
      matrix[cell.day_of_week][cell.hour_of_day] = cell.count;
    }
    return matrix;
  });

  maxCount = computed(() => {
    const data = this.cells();
    if (!data.length) return 1;
    return Math.max(1, ...data.map((c) => c.count));
  });

  getCellOpacity(count: number): number {
    if (count === 0) return 0.05;
    return Math.max(0.15, count / this.maxCount());
  }

  formatHour(h: number): string {
    if (h === 0) return '12a';
    if (h < 12) return `${h}a`;
    if (h === 12) return '12p';
    return `${h - 12}p`;
  }
}
