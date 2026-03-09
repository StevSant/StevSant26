import { Component, input, output, signal, computed, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { MatIcon } from '@angular/material/icon';
import { PaginationComponent } from '@shared/components/pagination/pagination.component';
import { AnalyticsDashboardService } from '@core/services/analytics-dashboard.service';
import { UniqueVisitor, VisitorSessionDetail } from '@core/models';
import {
  formatDuration,
  formatPagePath,
  getDeviceIcon,
  getReferrerBadge,
  getCountryFlagEmoji,
} from '../analytics-utils';

@Component({
  selector: 'app-analytics-visitors-tab',
  standalone: true,
  imports: [CommonModule, DatePipe, FormsModule, TranslatePipe, MatIcon, PaginationComponent],
  templateUrl: './analytics-visitors-tab.component.html',
})
export class AnalyticsVisitorsTabComponent {
  private analyticsService = inject(AnalyticsDashboardService);

  /** Number of days for the time range */
  selectedDays = input.required<number>();

  /** Initial referrer filter value (set when navigating from referrers tab) */
  initialReferrer = input<string | null>(null);

  /** Emits when data changes require the parent to reload summary */
  reloadSummary = output<void>();

  // State
  visitors = signal<UniqueVisitor[]>([]);
  visitorsLoading = signal(false);
  visitorSearch = signal('');
  visitorFilterDevice = signal<string | null>(null);
  visitorFilterRecruiter = signal<boolean | null>(null);
  visitorFilterCountry = signal<string | null>(null);
  visitorFilterReferrer = signal<string | null>(null);
  visitorSort = signal<string>('recent');
  visitorPage = signal(1);
  visitorPageSize = 10;
  expandedVisitor = signal<string | null>(null);
  expandedVisitorTab = signal<'history' | 'pages'>('history');
  deletingVisitor = signal<string | null>(null);
  confirmDeleteVisitor = signal<string | null>(null);

  availableCountries = computed(() => {
    const countries = new Set<string>();
    for (const v of this.visitors()) {
      if (v.country) countries.add(v.country);
    }
    return Array.from(countries).sort();
  });

  sortedVisitors = computed(() => {
    const list = [...this.visitors()];
    const sort = this.visitorSort();
    switch (sort) {
      case 'sessions':
        return list.sort((a, b) => b.total_sessions - a.total_sessions);
      case 'views':
        return list.sort((a, b) => b.total_page_views - a.total_page_views);
      case 'duration':
        return list.sort((a, b) => b.avg_session_duration - a.avg_session_duration);
      case 'country':
        return list.sort((a, b) => (a.country || '').localeCompare(b.country || ''));
      case 'recent':
      default:
        return list.sort(
          (a, b) => new Date(b.last_visit).getTime() - new Date(a.last_visit).getTime(),
        );
    }
  });

  paginatedVisitors = computed(() => {
    const all = this.sortedVisitors();
    const start = (this.visitorPage() - 1) * this.visitorPageSize;
    return all.slice(start, start + this.visitorPageSize);
  });

  // Utility functions
  formatDuration = formatDuration;
  formatPagePath = formatPagePath;
  getDeviceIcon = getDeviceIcon;
  getReferrerBadge = getReferrerBadge;
  getCountryFlagEmoji = getCountryFlagEmoji;

  /**
   * Load visitors with current filters. Called by parent or internally.
   */
  async loadVisitors(): Promise<void> {
    this.visitorsLoading.set(true);
    this.visitorPage.set(1);
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

  /**
   * Apply an external referrer filter and load visitors.
   */
  applyReferrerFilter(referrer: string): void {
    this.visitorFilterReferrer.set(referrer);
    this.loadVisitors();
  }

  onVisitorPageChange(page: number): void {
    this.visitorPage.set(page);
  }

  onVisitorSortChange(sort: string): void {
    this.visitorSort.set(sort);
    this.visitorPage.set(1);
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

  hasActiveVisitorFilters(): boolean {
    return !!(
      this.visitorSearch() ||
      this.visitorFilterDevice() ||
      this.visitorFilterRecruiter() !== null ||
      this.visitorFilterCountry() ||
      this.visitorFilterReferrer()
    );
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

  getSessionTotalDuration(session: VisitorSessionDetail): number {
    return session.session_duration || 0;
  }

  isSessionActive(session: VisitorSessionDetail): boolean {
    if (!session.last_seen_at) return false;
    const lastSeen = new Date(session.last_seen_at).getTime();
    const twoMinutesAgo = Date.now() - 2 * 60 * 1000;
    return lastSeen > twoMinutesAgo;
  }

  showDeleteConfirm(visitorHash: string, event: Event): void {
    event.stopPropagation();
    this.confirmDeleteVisitor.set(visitorHash);
  }

  cancelDelete(event: Event): void {
    event.stopPropagation();
    this.confirmDeleteVisitor.set(null);
  }

  async deleteVisitor(visitorHash: string, event: Event): Promise<void> {
    event.stopPropagation();
    this.deletingVisitor.set(visitorHash);
    try {
      const success = await this.analyticsService.deleteVisitor(visitorHash);
      if (success) {
        this.visitors.update((v) => v.filter((vis) => vis.visitor_hash !== visitorHash));
        this.confirmDeleteVisitor.set(null);
        this.reloadSummary.emit();
      }
    } catch (err) {
      console.error('[Analytics] Error deleting visitor:', err);
    } finally {
      this.deletingVisitor.set(null);
    }
  }
}
