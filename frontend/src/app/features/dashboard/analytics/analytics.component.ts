import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { AnalyticsService } from '@core/services/analytics.service';
import { AnalyticsSummary } from '@core/models';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, DatePipe, TranslatePipe],
  templateUrl: './analytics.component.html',
})
export class AnalyticsComponent implements OnInit {
  private analyticsService = inject(AnalyticsService);

  summary = signal<AnalyticsSummary | null>(null);
  loading = signal(true);
  selectedDays = signal(30);
  activeTab = signal<'overview' | 'pages' | 'referrers' | 'recruiters'>('overview');

  // Computed values for display
  avgViewsPerVisitor = computed(() => {
    const s = this.summary();
    if (!s || !s.unique_visitors) return '0';
    return (s.total_views / s.unique_visitors).toFixed(1);
  });

  maxDailyViews = computed(() => {
    const s = this.summary();
    if (!s?.daily_views?.length) return 1;
    return Math.max(...s.daily_views.map((d) => d.views));
  });

  avgSessionDuration = computed(() => {
    const s = this.summary();
    return this.formatDuration(s?.avg_session_duration ?? 0);
  });

  async ngOnInit(): Promise<void> {
    await this.loadData();
  }

  async loadData(): Promise<void> {
    this.loading.set(true);
    try {
      const data = await this.analyticsService.getAnalyticsSummary(this.selectedDays());
      console.log('[Analytics] Summary data:', data);
      this.summary.set(data);
    } catch (err) {
      console.error('[Analytics] Error loading data:', err);
    } finally {
      this.loading.set(false);
    }
  }

  async onDaysChange(days: number): Promise<void> {
    this.selectedDays.set(days);
    await this.loadData();
  }

  setTab(tab: 'overview' | 'pages' | 'referrers' | 'recruiters'): void {
    this.activeTab.set(tab);
  }

  /**
   * Returns a percentage height for the bar chart visualization.
   */
  getBarHeight(views: number): number {
    const max = this.maxDailyViews();
    if (max === 0) return 0;
    return Math.max(4, (views / max) * 100);
  }

  /**
   * Format a page path for display.
   */
  formatPagePath(path: string): string {
    if (path === '/' || path === '') return 'Home';
    return path.replace(/^\//, '').replace(/-/g, ' ').replace(/\//g, ' / ');
  }

  /**
   * Get an icon class based on device type.
   */
  getDeviceIcon(type: string): string {
    switch (type) {
      case 'desktop':
        return 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z';
      case 'mobile':
        return 'M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z';
      case 'tablet':
        return 'M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z';
      default:
        return 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }

  /**
   * Returns a color class based on percentage for recruiter probability.
   */
  getRecruiterConfidence(session: {
    referrer_source: string | null;
    total_page_views: number;
    pages_visited: { page_path: string }[] | null;
  }): 'high' | 'medium' | 'low' {
    const recruiterReferrers = ['linkedin.com', 'indeed.com', 'glassdoor.com', 'hired.com'];
    const hasRecruiterReferrer = session.referrer_source
      ? recruiterReferrers.some((r) => session.referrer_source!.includes(r))
      : false;
    const uniquePages = new Set(session.pages_visited?.map((p) => p.page_path) || []).size;

    if (hasRecruiterReferrer && uniquePages >= 3) return 'high';
    if (hasRecruiterReferrer || uniquePages >= 4) return 'medium';
    return 'low';
  }

  /**
   * Format seconds into a human-readable duration (e.g. "2m 30s").
   */
  formatDuration(seconds: number): string {
    if (!seconds || seconds <= 0) return '0s';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m === 0) return `${s}s`;
    return `${m}m ${s}s`;
  }
}
