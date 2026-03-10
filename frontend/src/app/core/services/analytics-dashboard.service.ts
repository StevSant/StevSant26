import { Injectable, inject } from '@angular/core';
import { SupabaseClientService } from './supabase-client.service';
import { AnalyticsSummary, VisitorSession, PageView, UniqueVisitor } from '../models';
import {
  AdminDashboardVisit,
  DashboardVisitSnapshot,
  AnalyticsChangesSince,
} from '@core/models/entities/admin-dashboard-visit.model';
import {
  AnalyticsComparison,
  BounceRateData,
  VisitorRetentionData,
  ConversionFunnelData,
  ActiveVisitor,
  HeatmapCell,
  EngagementScoresData,
  ContentRankingItem,
  PeriodComparisonData,
  AnomalyDetectionData,
  AnalyticsExportData,
} from '@core/models/entities/analytics.model';
import { ACTIVE_VISITOR_THRESHOLD_MS } from '@shared/config/analytics.config';

/**
 * Analytics dashboard service for retrieving aggregated metrics.
 *
 * Responsibilities:
 * - Retrieve aggregated analytics for the dashboard (authenticated only)
 * - Stateless — just DB queries via Supabase
 */
@Injectable({ providedIn: 'root' })
export class AnalyticsDashboardService {
  private client = inject(SupabaseClientService);

  /**
   * Get aggregated analytics summary.
   * Calls the Supabase function get_analytics_summary.
   * Includes retry with exponential backoff for transient 520 errors.
   */
  async getAnalyticsSummary(days: number = 30): Promise<AnalyticsSummary | null> {
    try {
      const { data, error } = await this.client.client.rpc('get_analytics_summary', {
        p_days: days,
      });

      if (error) {
        console.error(
          'Error fetching analytics summary:',
          error.message,
          error.details,
          error.hint,
          error.code,
        );
        return null;
      }

      return data as AnalyticsSummary;
    } catch {
      return null;
    }
  }

  /**
   * Get recent page views with pagination.
   */
  async getRecentPageViews(limit: number = 50, offset: number = 0): Promise<PageView[]> {
    const { data, error } = await this.client.client
      .from('page_view')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) return [];
    return data as PageView[];
  }

  /**
   * Get unique visitors with filters.
   * Calls the Supabase function get_unique_visitors.
   */
  async getUniqueVisitors(
    params: {
      days?: number;
      deviceType?: string | null;
      referrer?: string | null;
      isRecruiter?: boolean | null;
      country?: string | null;
      search?: string | null;
    } = {},
  ): Promise<UniqueVisitor[]> {
    try {
      const rpcParams: Record<string, unknown> = {
        p_days: params.days ?? 30,
      };
      if (params.deviceType) rpcParams['p_device_type'] = params.deviceType;
      if (params.referrer) rpcParams['p_referrer'] = params.referrer;
      if (params.isRecruiter !== undefined && params.isRecruiter !== null)
        rpcParams['p_is_recruiter'] = params.isRecruiter;
      if (params.country) rpcParams['p_country'] = params.country;
      if (params.search) rpcParams['p_search'] = params.search;

      const { data, error } = await this.client.client.rpc('get_unique_visitors', rpcParams);

      if (error) {
        console.error('Error fetching unique visitors:', error.message);
        return [];
      }

      return (data as UniqueVisitor[]) || [];
    } catch {
      return [];
    }
  }

  /**
   * Get recent visitor sessions with pagination.
   */
  async getRecentSessions(limit: number = 50, offset: number = 0): Promise<VisitorSession[]> {
    const { data, error } = await this.client.client
      .from('visitor_session')
      .select('*')
      .order('started_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) return [];
    return data as VisitorSession[];
  }

  async getAnalyticsComparison(days: number = 30): Promise<AnalyticsComparison | null> {
    const { data, error } = await this.client.client.rpc('get_analytics_comparison', {
      p_days: days,
    });

    if (error) {
      console.error('Error fetching analytics comparison:', error);
      return null;
    }

    return data as AnalyticsComparison;
  }

  async getChangesSinceLastVisit(lastVisitAt: string): Promise<AnalyticsChangesSince | null> {
    const { data, error } = await this.client.client.rpc('get_analytics_changes_since', {
      p_since: lastVisitAt,
    });

    if (error) {
      console.error('Error fetching changes since last visit:', error);
      return null;
    }

    return data as AnalyticsChangesSince;
  }

  async getActiveVisitorCount(): Promise<number> {
    const thresholdDate = new Date(Date.now() - ACTIVE_VISITOR_THRESHOLD_MS).toISOString();

    const { data, error } = await this.client.client.rpc('get_active_visitor_count', {
      p_threshold: thresholdDate,
    });

    if (error) {
      console.error('Error fetching active visitor count:', error);
      return 0;
    }

    return (data as number) ?? 0;
  }

  async loadDashboardVisit(): Promise<AdminDashboardVisit | null> {
    const { data, error } = await this.client.client
      .from('admin_dashboard_visit')
      .select('*')
      .single();

    if (error) {
      console.error('Error loading dashboard visit:', error);
      return null;
    }

    return data as AdminDashboardVisit;
  }

  async saveDashboardVisit(snapshot: DashboardVisitSnapshot): Promise<void> {
    const userId = (await this.client.client.auth.getUser()).data.user?.id;
    if (!userId) return;

    const { error } = await this.client.client.from('admin_dashboard_visit').upsert(
      {
        user_id: userId,
        last_visit_at: new Date().toISOString(),
        snapshot,
      },
      { onConflict: 'user_id' },
    );

    if (error) {
      console.error('Error saving dashboard visit:', error);
    }
  }

  subscribeToRealtimeChanges(handlers: {
    onVisitorInsert?: (payload: any) => void;
    onVisitorUpdate?: (payload: any) => void;
    onCvDownload?: (payload: any) => void;
    onPageView?: (payload: any) => void;
  }) {
    const channel = this.client.client
      .channel('admin-analytics-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'visitor_session' },
        (payload) => handlers.onVisitorInsert?.(payload),
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'visitor_session' },
        (payload) => handlers.onVisitorUpdate?.(payload),
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'cv_download' },
        (payload) => handlers.onCvDownload?.(payload),
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'page_view' },
        (payload) => handlers.onPageView?.(payload),
      )
      .subscribe();

    return channel;
  }

  async getBounceRate(days: number = 30): Promise<BounceRateData | null> {
    const { data, error } = await this.client.client.rpc('get_bounce_rate', { p_days: days });
    if (error) {
      console.error('Error fetching bounce rate:', error);
      return null;
    }
    return data as BounceRateData;
  }

  async getVisitorRetention(days: number = 30): Promise<VisitorRetentionData | null> {
    const { data, error } = await this.client.client.rpc('get_visitor_retention', { p_days: days });
    if (error) {
      console.error('Error fetching visitor retention:', error);
      return null;
    }
    return data as VisitorRetentionData;
  }

  async getConversionFunnel(days: number = 30): Promise<ConversionFunnelData | null> {
    const { data, error } = await this.client.client.rpc('get_conversion_funnel', { p_days: days });
    if (error) {
      console.error('Error fetching conversion funnel:', error);
      return null;
    }
    return data as ConversionFunnelData;
  }

  async getActiveVisitors(): Promise<ActiveVisitor[]> {
    const thresholdDate = new Date(Date.now() - ACTIVE_VISITOR_THRESHOLD_MS).toISOString();
    const { data, error } = await this.client.client.rpc('get_active_visitors', {
      p_threshold: thresholdDate,
    });
    if (error) {
      console.error('Error fetching active visitors:', error);
      return [];
    }
    return (data as ActiveVisitor[]) ?? [];
  }

  async getActivityHeatmap(days: number = 30): Promise<HeatmapCell[]> {
    const { data, error } = await this.client.client.rpc('get_activity_heatmap', { p_days: days });
    if (error) {
      console.error('Error fetching activity heatmap:', error);
      return [];
    }
    return (data as HeatmapCell[]) ?? [];
  }

  async getEngagementScores(days: number = 30): Promise<EngagementScoresData | null> {
    const { data, error } = await this.client.client.rpc('get_visitor_engagement_scores', {
      p_days: days,
    });
    if (error) {
      console.error('Error fetching engagement scores:', error);
      return null;
    }
    return data as EngagementScoresData;
  }

  async getContentRanking(days: number = 30): Promise<ContentRankingItem[]> {
    const { data, error } = await this.client.client.rpc('get_content_ranking', { p_days: days });
    if (error) {
      console.error('Error fetching content ranking:', error);
      return [];
    }
    return (data as ContentRankingItem[]) ?? [];
  }

  async getPeriodComparison(
    startA: string,
    endA: string,
    startB: string,
    endB: string,
  ): Promise<PeriodComparisonData | null> {
    const { data, error } = await this.client.client.rpc('get_period_comparison', {
      p_start_a: startA,
      p_end_a: endA,
      p_start_b: startB,
      p_end_b: endB,
    });
    if (error) {
      console.error('Error fetching period comparison:', error);
      return null;
    }
    return data as PeriodComparisonData;
  }

  async getAnomalyDetection(days: number = 30): Promise<AnomalyDetectionData | null> {
    const { data, error } = await this.client.client.rpc('get_anomaly_detection', { p_days: days });
    if (error) {
      console.error('Error fetching anomaly detection:', error);
      return null;
    }
    return data as AnomalyDetectionData;
  }

  async getAnalyticsExport(days: number = 30): Promise<AnalyticsExportData | null> {
    const { data, error } = await this.client.client.rpc('get_analytics_export', { p_days: days });
    if (error) {
      console.error('Error fetching analytics export:', error);
      return null;
    }
    return data as AnalyticsExportData;
  }

  /**
   * Delete all data for a specific visitor (all sessions + page views).
   * Page views are auto-deleted via ON DELETE CASCADE on the session FK.
   */
  async deleteVisitor(visitorHash: string): Promise<boolean> {
    try {
      const { error } = await this.client.client
        .from('visitor_session')
        .delete()
        .eq('visitor_hash', visitorHash);

      if (error) {
        console.error('Error deleting visitor:', error.message);
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }
}
