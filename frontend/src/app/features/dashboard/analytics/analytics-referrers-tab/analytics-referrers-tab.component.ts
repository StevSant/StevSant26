import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { MatIcon } from '@angular/material/icon';
import { AnalyticsSummary } from '@core/models';
import { getReferrerBadge } from '../analytics-utils';

@Component({
  selector: 'app-analytics-referrers-tab',
  standalone: true,
  imports: [CommonModule, TranslatePipe, MatIcon],
  templateUrl: './analytics-referrers-tab.component.html',
})
export class AnalyticsReferrersTabComponent {
  summary = input.required<AnalyticsSummary>();

  /** Emits the referrer source when user clicks a row to filter visitors */
  filterByReferrer = output<string>();

  getReferrerBadge = getReferrerBadge;

  onReferrerClick(referrer: string): void {
    this.filterByReferrer.emit(referrer);
  }
}
