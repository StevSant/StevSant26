import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { TranslateService } from '@core/services/translate.service';
import { MatIcon } from '@angular/material/icon';
import { AnalyticsDashboardService } from '@core/services/analytics-dashboard.service';
import { AnalyticsExportData } from '@core/models/entities/analytics.model';
import { formatDuration } from '../analytics-utils';

@Component({
  selector: 'app-analytics-export',
  standalone: true,
  imports: [CommonModule, TranslatePipe, MatIcon],
  templateUrl: './analytics-export.component.html',
})
export class AnalyticsExportComponent {
  private analyticsService = inject(AnalyticsDashboardService);
  private translate = inject(TranslateService);

  selectedDays = input.required<number>();
  exportingCsv = false;
  exportingPdf = false;

  async exportCsv(): Promise<void> {
    this.exportingCsv = true;
    const data = await this.analyticsService.getAnalyticsExport(this.selectedDays());
    if (data) {
      this.downloadCsv(data);
    }
    this.exportingCsv = false;
  }

  async exportPdf(): Promise<void> {
    this.exportingPdf = true;
    const data = await this.analyticsService.getAnalyticsExport(this.selectedDays());
    if (data) {
      this.downloadHtmlReport(data);
    }
    this.exportingPdf = false;
  }

  private downloadCsv(data: AnalyticsExportData): void {
    const lines: string[] = [];

    lines.push('Analytics Report');
    lines.push(`Period: ${data.period.start} to ${data.period.end} (${data.period.days} days)`);
    lines.push('');

    lines.push('KPIs');
    lines.push('Metric,Value');
    lines.push(`Total Views,${data.kpis.total_views}`);
    lines.push(`Unique Visitors,${data.kpis.unique_visitors}`);
    lines.push(`Potential Recruiters,${data.kpis.potential_recruiters}`);
    lines.push(`CV Downloads,${data.kpis.cv_downloads}`);
    lines.push(`Avg Session Duration,${formatDuration(data.kpis.avg_session_duration)}`);
    lines.push(`Bounce Rate,${data.kpis.bounce_rate}%`);
    lines.push('');

    lines.push('Daily Views');
    lines.push('Date,Views');
    for (const day of data.daily_views) {
      lines.push(`${day.day},${day.views}`);
    }
    lines.push('');

    lines.push('Top Pages');
    lines.push('Page,Views,Unique Visitors,Avg Duration');
    for (const page of data.top_pages) {
      lines.push(
        `"${page.page_path}",${page.views},${page.unique_visitors},${formatDuration(page.avg_duration)}`,
      );
    }
    lines.push('');

    lines.push('Top Referrers');
    lines.push('Source,Visits');
    for (const ref of data.top_referrers) {
      lines.push(`"${ref.source}",${ref.visits}`);
    }
    lines.push('');

    lines.push('Countries');
    lines.push('Country,Visitors');
    for (const c of data.countries) {
      lines.push(`"${c.country}",${c.visitors}`);
    }
    lines.push('');

    lines.push('Devices');
    lines.push('Device,Count');
    for (const d of data.devices) {
      lines.push(`${d.device},${d.count}`);
    }

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    this.triggerDownload(blob, `analytics-${data.period.start}-to-${data.period.end}.csv`);
  }

  private downloadHtmlReport(data: AnalyticsExportData): void {
    const title = this.translate.instant('analytics.title');
    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${title}</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 800px; margin: 0 auto; padding: 40px 20px; color: #1f2937; }
  h1 { color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 8px; }
  h2 { color: #374151; margin-top: 32px; }
  .period { color: #6b7280; font-size: 14px; }
  .kpi-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: 16px 0; }
  .kpi { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; text-align: center; }
  .kpi-value { font-size: 28px; font-weight: 700; color: #1e40af; }
  .kpi-label { font-size: 12px; color: #6b7280; margin-top: 4px; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; }
  th { background: #f3f4f6; text-align: left; padding: 8px 12px; font-size: 12px; color: #6b7280; }
  td { padding: 8px 12px; border-bottom: 1px solid #e5e7eb; font-size: 13px; }
  .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 11px; text-align: center; }
</style></head><body>
<h1>${title}</h1>
<p class="period">${data.period.start} — ${data.period.end} (${data.period.days} days)</p>

<div class="kpi-grid">
  <div class="kpi"><div class="kpi-value">${data.kpis.total_views}</div><div class="kpi-label">Total Views</div></div>
  <div class="kpi"><div class="kpi-value">${data.kpis.unique_visitors}</div><div class="kpi-label">Unique Visitors</div></div>
  <div class="kpi"><div class="kpi-value">${data.kpis.potential_recruiters}</div><div class="kpi-label">Recruiters</div></div>
  <div class="kpi"><div class="kpi-value">${data.kpis.cv_downloads}</div><div class="kpi-label">CV Downloads</div></div>
  <div class="kpi"><div class="kpi-value">${formatDuration(data.kpis.avg_session_duration)}</div><div class="kpi-label">Avg Duration</div></div>
  <div class="kpi"><div class="kpi-value">${data.kpis.bounce_rate}%</div><div class="kpi-label">Bounce Rate</div></div>
</div>

<h2>Top Pages</h2>
<table><tr><th>Page</th><th>Views</th><th>Visitors</th><th>Avg Time</th></tr>
${data.top_pages.map((p) => `<tr><td>${p.page_path}</td><td>${p.views}</td><td>${p.unique_visitors}</td><td>${formatDuration(p.avg_duration)}</td></tr>`).join('')}
</table>

<h2>Top Referrers</h2>
<table><tr><th>Source</th><th>Visits</th></tr>
${data.top_referrers.map((r) => `<tr><td>${r.source}</td><td>${r.visits}</td></tr>`).join('')}
</table>

<h2>Countries</h2>
<table><tr><th>Country</th><th>Visitors</th></tr>
${data.countries.map((c) => `<tr><td>${c.country}</td><td>${c.visitors}</td></tr>`).join('')}
</table>

<h2>Devices</h2>
<table><tr><th>Device</th><th>Count</th></tr>
${data.devices.map((d) => `<tr><td>${d.device}</td><td>${d.count}</td></tr>`).join('')}
</table>

<div class="footer">Generated by StevSant Analytics · ${new Date().toLocaleString()}</div>
</body></html>`;

    const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
    this.triggerDownload(blob, `analytics-report-${data.period.start}-to-${data.period.end}.html`);
  }

  private triggerDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}
