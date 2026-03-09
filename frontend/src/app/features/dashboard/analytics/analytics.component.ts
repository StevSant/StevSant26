import { Component, OnInit, signal, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsDashboardService } from '@core/services/analytics-dashboard.service';
import { AnalyticsSummary } from '@core/models';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { MatIcon } from '@angular/material/icon';
import { AnalyticsKpiCardsComponent } from './analytics-kpi-cards/analytics-kpi-cards.component';
import { AnalyticsOverviewTabComponent } from './analytics-overview-tab/analytics-overview-tab.component';
import { AnalyticsPagesTabComponent } from './analytics-pages-tab/analytics-pages-tab.component';
import { AnalyticsReferrersTabComponent } from './analytics-referrers-tab/analytics-referrers-tab.component';
import { AnalyticsRecruitersTabComponent } from './analytics-recruiters-tab/analytics-recruiters-tab.component';
import { AnalyticsVisitorsTabComponent } from './analytics-visitors-tab/analytics-visitors-tab.component';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    TranslatePipe,
    MatIcon,
    AnalyticsKpiCardsComponent,
    AnalyticsOverviewTabComponent,
    AnalyticsPagesTabComponent,
    AnalyticsReferrersTabComponent,
    AnalyticsRecruitersTabComponent,
    AnalyticsVisitorsTabComponent,
  ],
  templateUrl: './analytics.component.html',
})
export class AnalyticsComponent implements OnInit {
  private analyticsService = inject(AnalyticsDashboardService);

  summary = signal<AnalyticsSummary | null>(null);
  loading = signal(true);
  selectedDays = signal(30);
  activeTab = signal<'overview' | 'pages' | 'referrers' | 'recruiters' | 'visitors'>('overview');

  visitorsTab = viewChild<AnalyticsVisitorsTabComponent>('visitorsTab');

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
      this.visitorsTab()?.loadVisitors();
    }
  }

  setTab(tab: 'overview' | 'pages' | 'referrers' | 'recruiters' | 'visitors'): void {
    this.activeTab.set(tab);
    if (tab === 'visitors') {
      // Delay slightly so the viewChild is available after @switch renders
      setTimeout(() => {
        const vt = this.visitorsTab();
        if (vt && vt.visitors().length === 0) {
          vt.loadVisitors();
        }
      });
    }
  }

  /**
   * Navigate to the Visitors tab pre-filtered by a specific referrer source.
   */
  filterVisitorsByReferrer(referrer: string): void {
    this.activeTab.set('visitors');
    setTimeout(() => {
      this.visitorsTab()?.applyReferrerFilter(referrer);
    });
  }

  /**
   * Reload summary data (e.g. after visitor deletion).
   */
  async onReloadSummary(): Promise<void> {
    await this.loadData();
  }
}
