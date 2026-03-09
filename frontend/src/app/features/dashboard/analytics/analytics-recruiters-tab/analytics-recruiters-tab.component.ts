import { Component, input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { MatIcon } from '@angular/material/icon';
import { AnalyticsSummary } from '@core/models';
import {
  formatPagePath,
  formatDuration,
  getDeviceIcon,
  getReferrerBadge,
} from '../analytics-utils';

@Component({
  selector: 'app-analytics-recruiters-tab',
  standalone: true,
  imports: [CommonModule, DatePipe, TranslatePipe, MatIcon],
  templateUrl: './analytics-recruiters-tab.component.html',
})
export class AnalyticsRecruitersTabComponent {
  summary = input.required<AnalyticsSummary>();

  formatPagePath = formatPagePath;
  formatDuration = formatDuration;
  getDeviceIcon = getDeviceIcon;
  getReferrerBadge = getReferrerBadge;

  getRecruiterConfidence(session: {
    referrer_source: string | null;
    total_page_views: number;
    pages_visited: { page_path: string }[] | null;
  }): 'high' | 'medium' | 'low' {
    const recruiterReferrers = [
      'linkedin.com',
      'indeed.com',
      'glassdoor.com',
      'hired.com',
      'computrabajo.com',
      'cletonboard',
      'infojobs.net',
      'ziprecruiter.com',
      'manpower.com',
      'hays.com',
      'randstad.com',
      'adecco.com',
      'michaelpage.com',
      'roberthalf.com',
    ];
    const hasRecruiterReferrer = session.referrer_source
      ? recruiterReferrers.some((r) => session.referrer_source!.includes(r))
      : false;
    const uniquePages = new Set(session.pages_visited?.map((p) => p.page_path) || []).size;

    if (hasRecruiterReferrer && uniquePages >= 3) return 'high';
    if (hasRecruiterReferrer || uniquePages >= 4) return 'medium';
    return 'low';
  }
}
