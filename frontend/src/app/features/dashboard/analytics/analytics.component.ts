import { Component, OnInit, OnDestroy, signal, inject, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsDashboardService } from '@core/services/analytics-dashboard.service';
import { AnalyticsSummary } from '@core/models';
import {
  AnalyticsComparison,
  BounceRateData,
  VisitorRetentionData,
  ConversionFunnelData,
  ActiveVisitor,
  HeatmapCell,
  EngagementScoresData,
  ContentRankingItem,
  AnomalyDetectionData,
} from '@core/models/entities/analytics.model';
import {
  AdminDashboardVisit,
  DashboardVisitSnapshot,
  AnalyticsChangesSince,
} from '@core/models/entities/admin-dashboard-visit.model';
import { AnalyticsAlertsService } from '@core/services/analytics-alerts.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import {
  SNAPSHOT_SAVE_INTERVAL_MS,
  ACTIVE_VISITOR_POLL_INTERVAL_MS,
} from '@shared/config/analytics.config';
import { MatIcon } from '@angular/material/icon';
import { AnalyticsKpiCardsComponent } from './analytics-kpi-cards/analytics-kpi-cards.component';
import { AnalyticsChangesBannerComponent } from './analytics-changes-banner/analytics-changes-banner.component';
import { AnalyticsToastComponent } from './analytics-toast/analytics-toast.component';
import { AnalyticsOverviewTabComponent } from './analytics-overview-tab/analytics-overview-tab.component';
import { AnalyticsPagesTabComponent } from './analytics-pages-tab/analytics-pages-tab.component';
import { AnalyticsReferrersTabComponent } from './analytics-referrers-tab/analytics-referrers-tab.component';
import { AnalyticsRecruitersTabComponent } from './analytics-recruiters-tab/analytics-recruiters-tab.component';
import { AnalyticsVisitorsTabComponent } from './analytics-visitors-tab/analytics-visitors-tab.component';
import { AnalyticsActiveVisitorsComponent } from './analytics-active-visitors/analytics-active-visitors.component';
import { AnalyticsInsightsTabComponent } from './analytics-insights-tab/analytics-insights-tab.component';
import { AnalyticsHeatmapComponent } from './analytics-heatmap/analytics-heatmap.component';
import { AnalyticsEngagementComponent } from './analytics-engagement/analytics-engagement.component';
import { AnalyticsContentRankingComponent } from './analytics-content-ranking/analytics-content-ranking.component';
import { AnalyticsPeriodComparisonComponent } from './analytics-period-comparison/analytics-period-comparison.component';
import { AnalyticsAnomaliesComponent } from './analytics-anomalies/analytics-anomalies.component';
import { AnalyticsExportComponent } from './analytics-export/analytics-export.component';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [
    CommonModule,
    TranslatePipe,
    MatIcon,
    AnalyticsKpiCardsComponent,
    AnalyticsChangesBannerComponent,
    AnalyticsToastComponent,
    AnalyticsOverviewTabComponent,
    AnalyticsPagesTabComponent,
    AnalyticsReferrersTabComponent,
    AnalyticsRecruitersTabComponent,
    AnalyticsVisitorsTabComponent,
    AnalyticsActiveVisitorsComponent,
    AnalyticsInsightsTabComponent,
    AnalyticsHeatmapComponent,
    AnalyticsEngagementComponent,
    AnalyticsContentRankingComponent,
    AnalyticsPeriodComparisonComponent,
    AnalyticsAnomaliesComponent,
    AnalyticsExportComponent,
  ],
  templateUrl: './analytics.component.html',
})
export class AnalyticsComponent implements OnInit, OnDestroy {
  private analyticsService = inject(AnalyticsDashboardService);
  private alertsService = inject(AnalyticsAlertsService);

  summary = signal<AnalyticsSummary | null>(null);
  loading = signal(true);
  selectedDays = signal(30);
  activeTab = signal<'overview' | 'pages' | 'referrers' | 'recruiters' | 'visitors' | 'insights'>(
    'overview',
  );

  comparison = signal<AnalyticsComparison | null>(null);
  changesSinceLastVisit = signal<AnalyticsChangesSince | null>(null);
  lastVisitAt = signal<string | null>(null);
  activeVisitors = signal(0);
  activeVisitorsList = signal<ActiveVisitor[]>([]);
  showActivePanel = signal(false);
  realtimeAvailable = signal(true);
  showBanner = signal(false);

  bounceRate = signal<BounceRateData | null>(null);
  retention = signal<VisitorRetentionData | null>(null);
  funnel = signal<ConversionFunnelData | null>(null);
  heatmap = signal<HeatmapCell[]>([]);
  engagement = signal<EngagementScoresData | null>(null);
  contentRanking = signal<ContentRankingItem[]>([]);
  anomalies = signal<AnomalyDetectionData | null>(null);

  private realtimeChannel: any = null;
  private snapshotInterval: ReturnType<typeof setInterval> | null = null;
  private pollingInterval: ReturnType<typeof setInterval> | null = null;

  visitorsTab = viewChild<AnalyticsVisitorsTabComponent>('visitorsTab');

  async ngOnInit(): Promise<void> {
    await this.loadData();
    await this.loadLastVisitAndChanges();
    await this.loadActiveVisitors();
    this.setupRealtime();
    this.startSnapshotAutoSave();
  }

  async loadData(): Promise<void> {
    this.loading.set(true);
    try {
      const [summaryData, comparisonData] = await Promise.all([
        this.analyticsService.getAnalyticsSummary(this.selectedDays()),
        this.analyticsService.getAnalyticsComparison(this.selectedDays()),
      ]);
      this.summary.set(summaryData);
      this.comparison.set(comparisonData);
    } catch (error) {
      console.error('Error loading analytics data:', error);
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

  setTab(tab: 'overview' | 'pages' | 'referrers' | 'recruiters' | 'visitors' | 'insights'): void {
    this.activeTab.set(tab);
    if (tab === 'visitors') {
      setTimeout(() => {
        const vt = this.visitorsTab();
        if (vt && vt.visitors().length === 0) {
          vt.loadVisitors();
        }
      });
    }
    if (tab === 'insights') {
      this.loadInsightsData();
    }
  }

  async toggleActivePanel(): Promise<void> {
    if (this.showActivePanel()) {
      this.showActivePanel.set(false);
    } else {
      const visitors = await this.analyticsService.getActiveVisitors();
      this.activeVisitorsList.set(visitors);
      this.showActivePanel.set(true);
    }
  }

  private async loadInsightsData(): Promise<void> {
    const days = this.selectedDays();
    const [
      bounceData,
      retentionData,
      funnelData,
      heatmapData,
      engagementData,
      contentData,
      anomalyData,
    ] = await Promise.all([
      this.analyticsService.getBounceRate(days),
      this.analyticsService.getVisitorRetention(days),
      this.analyticsService.getConversionFunnel(days),
      this.analyticsService.getActivityHeatmap(days),
      this.analyticsService.getEngagementScores(days),
      this.analyticsService.getContentRanking(days),
      this.analyticsService.getAnomalyDetection(days),
    ]);
    this.bounceRate.set(bounceData);
    this.retention.set(retentionData);
    this.funnel.set(funnelData);
    this.heatmap.set(heatmapData);
    this.engagement.set(engagementData);
    this.contentRanking.set(contentData);
    this.anomalies.set(anomalyData);
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

  private async loadLastVisitAndChanges(): Promise<void> {
    let visit = await this.analyticsService.loadDashboardVisit();

    if (!visit) {
      const cached = localStorage.getItem('analytics_dashboard_visit');
      if (cached) {
        try {
          visit = JSON.parse(cached) as AdminDashboardVisit;
        } catch {
          /* ignore */
        }
      }
    }

    if (visit?.last_visit_at) {
      this.lastVisitAt.set(visit.last_visit_at);
      const changes = await this.analyticsService.getChangesSinceLastVisit(visit.last_visit_at);
      if (changes) {
        this.changesSinceLastVisit.set(changes);
        this.showBanner.set(true);
      }
    }
  }

  private async loadActiveVisitors(): Promise<void> {
    const count = await this.analyticsService.getActiveVisitorCount();
    this.activeVisitors.set(count);
  }

  private setupRealtime(): void {
    const summary = this.summary();
    if (summary?.country_breakdown) {
      this.alertsService.initKnownCountries(summary.country_breakdown.map((c) => c.country));
    }

    this.realtimeChannel = this.analyticsService.subscribeToRealtimeChanges({
      onVisitorInsert: (payload) => {
        this.alertsService.handleVisitorInsert(payload);
        this.loadActiveVisitors();
      },
      onVisitorUpdate: (payload) => {
        this.alertsService.handleVisitorUpdate(payload);
        this.loadActiveVisitors();
      },
      onCvDownload: (payload) => {
        this.alertsService.handleCvDownload(payload);
      },
      onPageView: (payload) => {
        this.alertsService.handlePageView(payload);
      },
    });

    // Handle Realtime errors — fallback to polling
    this.realtimeChannel.on('system', {}, (payload: any) => {
      if (payload?.status === 'error' || payload?.status === 'closed') {
        this.realtimeAvailable.set(false);
        this.startPolling();
      }
    });
  }

  private startPolling(): void {
    if (this.pollingInterval) return;
    this.pollingInterval = setInterval(() => {
      this.loadActiveVisitors();
    }, ACTIVE_VISITOR_POLL_INTERVAL_MS);
  }

  private startSnapshotAutoSave(): void {
    this.snapshotInterval = setInterval(() => {
      this.saveCurrentSnapshot();
    }, SNAPSHOT_SAVE_INTERVAL_MS);
  }

  private async saveCurrentSnapshot(): Promise<void> {
    const s = this.summary();
    if (!s) return;

    const snapshot: DashboardVisitSnapshot = {
      total_views: s.total_views,
      unique_visitors: s.unique_visitors,
      potential_recruiters: s.potential_recruiters,
      cv_downloads_total: s.cv_downloads_total,
      avg_session_duration: s.avg_session_duration,
      top_referrers: s.top_referrers ?? [],
      country_breakdown: s.country_breakdown ?? [],
    };

    await this.analyticsService.saveDashboardVisit(snapshot);

    const visit: AdminDashboardVisit = {
      user_id: '',
      last_visit_at: new Date().toISOString(),
      snapshot,
      created_at: '',
    };
    localStorage.setItem('analytics_dashboard_visit', JSON.stringify(visit));
  }

  onBannerDismissed(): void {
    this.showBanner.set(false);
    this.saveCurrentSnapshot();
  }

  ngOnDestroy(): void {
    this.saveCurrentSnapshot();

    if (this.realtimeChannel) {
      this.realtimeChannel.unsubscribe();
    }

    if (this.snapshotInterval) {
      clearInterval(this.snapshotInterval);
    }
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }

    this.alertsService.resetSession();
  }
}
