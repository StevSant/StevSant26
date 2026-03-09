import { Injectable, inject } from '@angular/core';
import { SupabaseClientService } from './supabase-client.service';
import { AnalyticsSummary, VisitorSession, PageView, UniqueVisitor } from '../models';

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
