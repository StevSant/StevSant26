import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnalyticsService } from '@core/services/analytics.service';
import { AnalyticsSummary, UniqueVisitor, VisitorSessionDetail } from '@core/models';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, DatePipe, TranslatePipe, FormsModule, MatIcon],
  templateUrl: './analytics.component.html',
})
export class AnalyticsComponent implements OnInit {
  private analyticsService = inject(AnalyticsService);

  summary = signal<AnalyticsSummary | null>(null);
  loading = signal(true);
  selectedDays = signal(30);
  activeTab = signal<'overview' | 'pages' | 'referrers' | 'recruiters' | 'visitors'>('overview');

  // Visitors tab state
  visitors = signal<UniqueVisitor[]>([]);
  visitorsLoading = signal(false);
  visitorSearch = signal('');
  visitorFilterDevice = signal<string | null>(null);
  visitorFilterRecruiter = signal<boolean | null>(null);
  visitorFilterCountry = signal<string | null>(null);
  visitorFilterReferrer = signal<string | null>(null);
  expandedVisitor = signal<string | null>(null);
  expandedVisitorTab = signal<'history' | 'pages'>('history');
  deletingVisitor = signal<string | null>(null);
  confirmDeleteVisitor = signal<string | null>(null);

  // Computed values for display
  avgViewsPerVisitor = computed(() => {
    const s = this.summary();
    if (!s || !s.unique_visitors) return '0';
    return (s.total_views / s.unique_visitors).toFixed(1);
  });

  /**
   * Fills in missing dates with 0 views so the chart renders
   * a bar for every day in the selected period.
   */
  filledDailyViews = computed(() => {
    const s = this.summary();
    if (!s?.daily_views?.length) return [];

    const days = this.selectedDays();
    const viewMap = new Map<string, number>();
    for (const d of s.daily_views) {
      // Normalise: the SQL returns DATE strings like "2026-02-12"
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
    if (this.activeTab() === 'visitors') {
      await this.loadVisitors();
    }
  }

  setTab(tab: 'overview' | 'pages' | 'referrers' | 'recruiters' | 'visitors'): void {
    this.activeTab.set(tab);
    if (tab === 'visitors' && this.visitors().length === 0) {
      this.loadVisitors();
    }
  }

  async loadVisitors(): Promise<void> {
    this.visitorsLoading.set(true);
    try {
      const data = await this.analyticsService.getUniqueVisitors({
        days: this.selectedDays(),
        deviceType: this.visitorFilterDevice(),
        referrer: this.visitorFilterReferrer(),
        isRecruiter: this.visitorFilterRecruiter(),
        country: this.visitorFilterCountry(),
        search: this.visitorSearch() || null,
      });
      this.visitors.set(data);
    } catch (err) {
      console.error('[Analytics] Error loading visitors:', err);
    } finally {
      this.visitorsLoading.set(false);
    }
  }

  async onVisitorSearch(query: string): Promise<void> {
    this.visitorSearch.set(query);
    await this.loadVisitors();
  }

  async onVisitorFilterChange(): Promise<void> {
    await this.loadVisitors();
  }

  clearVisitorFilters(): void {
    this.visitorSearch.set('');
    this.visitorFilterDevice.set(null);
    this.visitorFilterRecruiter.set(null);
    this.visitorFilterCountry.set(null);
    this.visitorFilterReferrer.set(null);
    this.loadVisitors();
  }

  toggleVisitorExpand(hash: string): void {
    if (this.expandedVisitor() === hash) {
      this.expandedVisitor.set(null);
    } else {
      this.expandedVisitor.set(hash);
      this.expandedVisitorTab.set('history');
    }
  }

  setVisitorDetailTab(tab: 'history' | 'pages'): void {
    this.expandedVisitorTab.set(tab);
  }

  /**
   * Compute total duration for a session from its pages.
   */
  getSessionTotalDuration(session: VisitorSessionDetail): number {
    return session.session_duration || 0;
  }

  /**
   * Determine if a session appears to still be active.
   * A session is "active" if last_seen_at is within the last 2 minutes.
   */
  isSessionActive(session: VisitorSessionDetail): boolean {
    if (!session.last_seen_at) return false;
    const lastSeen = new Date(session.last_seen_at).getTime();
    const twoMinutesAgo = Date.now() - 2 * 60 * 1000;
    return lastSeen > twoMinutesAgo;
  }

  /**
   * Show delete confirmation for a visitor.
   */
  showDeleteConfirm(visitorHash: string, event: Event): void {
    event.stopPropagation();
    this.confirmDeleteVisitor.set(visitorHash);
  }

  /**
   * Cancel delete confirmation.
   */
  cancelDelete(event: Event): void {
    event.stopPropagation();
    this.confirmDeleteVisitor.set(null);
  }

  /**
   * Delete a visitor and all their session data.
   */
  async deleteVisitor(visitorHash: string, event: Event): Promise<void> {
    event.stopPropagation();
    this.deletingVisitor.set(visitorHash);
    try {
      const success = await this.analyticsService.deleteVisitor(visitorHash);
      if (success) {
        // Remove from local list immediately
        this.visitors.update((v) => v.filter((vis) => vis.visitor_hash !== visitorHash));
        this.confirmDeleteVisitor.set(null);
        // Reload summary to update KPIs
        await this.loadData();
      }
    } catch (err) {
      console.error('[Analytics] Error deleting visitor:', err);
    } finally {
      this.deletingVisitor.set(null);
    }
  }

  hasActiveVisitorFilters(): boolean {
    return !!(this.visitorSearch() || this.visitorFilterDevice() || this.visitorFilterRecruiter() !== null || this.visitorFilterCountry() || this.visitorFilterReferrer());
  }

  /**
   * Returns a percentage height for the bar chart visualization.
   * Returns 0 for days with no views, and a minimum of 4% for days with views.
   */
  getBarHeight(views: number): number {
    const max = this.maxDailyViews();
    if (max === 0 || views === 0) return 0;
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
        return 'desktop_windows';
      case 'mobile':
        return 'smartphone';
      case 'tablet':
        return 'tablet';
      default:
        return 'help_outline';
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
    const s = Math.round(seconds % 60);
    if (m === 0) return `${s}s`;
    return `${m}m ${s}s`;
  }

  /**
   * Returns a badge config (label + color classes) based on referrer source.
   * Returns null if no special badge applies.
   */
  getReferrerBadge(source: string): { label: string; classes: string } | null {
    const s = source.toLowerCase();
    if (s.includes('linkedin')) {
      return { label: 'LinkedIn', classes: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' };
    }
    if (s.includes('cv') || s.includes('curriculum') || s.includes('resume')) {
      return { label: 'CV', classes: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' };
    }
    if (s.includes('github')) {
      return { label: 'GitHub', classes: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300' };
    }
    if (s.includes('google')) {
      return { label: 'Google', classes: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' };
    }
    if (s.includes('indeed')) {
      return { label: 'Indeed', classes: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' };
    }
    if (s.includes('glassdoor')) {
      return { label: 'Glassdoor', classes: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' };
    }
    if (s.includes('twitter') || s.includes('x.com')) {
      return { label: 'X / Twitter', classes: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300' };
    }
    if (s.includes('instagram')) {
      return { label: 'Instagram', classes: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300' };
    }
    if (s.includes('facebook')) {
      return { label: 'Facebook', classes: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' };
    }
    return null;
  }
}
