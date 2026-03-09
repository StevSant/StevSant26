import { Component, input, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { MatIcon } from '@angular/material/icon';
import { AnalyticsSummary } from '@core/models';
import {
  formatDuration,
  getDeviceIcon,
  formatLanguageTag,
  getLanguageFlagEmoji,
  getCountryFlagEmoji,
} from '../analytics-utils';

@Component({
  selector: 'app-analytics-overview-tab',
  standalone: true,
  imports: [CommonModule, DatePipe, TranslatePipe, MatIcon],
  templateUrl: './analytics-overview-tab.component.html',
})
export class AnalyticsOverviewTabComponent {
  summary = input.required<AnalyticsSummary>();

  filledDailyViews = computed(() => {
    const s = this.summary();
    if (!s?.daily_views?.length) return [];

    const days = this._selectedDays();
    const viewMap = new Map<string, number>();
    for (const d of s.daily_views) {
      const key = d.date.substring(0, 10);
      viewMap.set(key, d.views);
    }

    const result: { date: string; views: number }[] = [];
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toISOString().substring(0, 10);
      result.push({ date: key, views: viewMap.get(key) ?? 0 });
    }
    return result;
  });

  maxDailyViews = computed(() => {
    const filled = this.filledDailyViews();
    if (!filled.length) return 1;
    return Math.max(1, ...filled.map((d) => d.views));
  });

  midDailyViews = computed(() => Math.round(this.maxDailyViews() / 2));

  normalizedLanguages = computed(() => {
    const s = this.summary();
    if (!s?.language_breakdown?.length) return [];

    const grouped = new Map<string, number>();
    for (const lang of s.language_breakdown) {
      const base = lang.browser_language.split('-')[0].toLowerCase();
      grouped.set(base, (grouped.get(base) ?? 0) + lang.count);
    }

    return Array.from(grouped.entries())
      .map(([code, count]) => ({ browser_language: code, count }))
      .sort((a, b) => b.count - a.count);
  });

  /** Selected days input for chart date range calculation */
  selectedDays = input.required<number>();

  /** Private computed to avoid collision with the input signal name */
  private _selectedDays = computed(() => this.selectedDays());

  getBarHeight(views: number): number {
    const max = this.maxDailyViews();
    if (max === 0 || views === 0) return 0;
    return Math.max(4, (views / max) * 100);
  }

  getDeviceIcon = getDeviceIcon;
  formatLanguageTag = formatLanguageTag;
  getLanguageFlagEmoji = getLanguageFlagEmoji;
  getCountryFlagEmoji = getCountryFlagEmoji;
  formatDuration = formatDuration;
}
