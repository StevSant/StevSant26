import { Component, input, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { MatIcon } from '@angular/material/icon';
import {
  BounceRateData,
  VisitorRetentionData,
  ConversionFunnelData,
} from '@core/models/entities/analytics.model';

@Component({
  selector: 'app-analytics-insights-tab',
  standalone: true,
  imports: [CommonModule, DatePipe, TranslatePipe, MatIcon],
  templateUrl: './analytics-insights-tab.component.html',
})
export class AnalyticsInsightsTabComponent {
  bounceRate = input<BounceRateData | null>(null);
  retention = input<VisitorRetentionData | null>(null);
  funnel = input<ConversionFunnelData | null>(null);

  bounceRateColor = computed(() => {
    const rate = this.bounceRate()?.bounce_rate ?? 0;
    if (rate <= 30) return 'text-emerald-600 dark:text-emerald-400';
    if (rate <= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  });

  bounceRateBgColor = computed(() => {
    const rate = this.bounceRate()?.bounce_rate ?? 0;
    if (rate <= 30) return 'bg-emerald-500';
    if (rate <= 60) return 'bg-amber-500';
    return 'bg-red-500';
  });

  retentionPieData = computed(() => {
    const r = this.retention();
    if (!r || r.total_visitors === 0) return { newPct: 0, returningPct: 0 };
    return {
      newPct: Math.round((r.new_visitors / r.total_visitors) * 100),
      returningPct: Math.round((r.returning_visitors / r.total_visitors) * 100),
    };
  });

  funnelMaxCount = computed(() => {
    const f = this.funnel();
    if (!f?.stages?.length) return 1;
    return Math.max(1, f.stages[0]?.count ?? 1);
  });

  getFunnelBarWidth(count: number): number {
    const max = this.funnelMaxCount();
    return Math.max(2, (count / max) * 100);
  }

  getFunnelConversion(index: number): string {
    const stages = this.funnel()?.stages;
    if (!stages || index === 0 || !stages[index - 1]?.count) return '';
    const prev = stages[index - 1].count;
    if (prev === 0) return '0%';
    return Math.round((stages[index].count / prev) * 100) + '%';
  }

  getFunnelStageColor(index: number): string {
    const colors = [
      'bg-(--color-accent)',
      'bg-blue-500',
      'bg-indigo-500',
      'bg-purple-500',
      'bg-emerald-500',
    ];
    return colors[index % colors.length];
  }
}
