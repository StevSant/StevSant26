import {
  Component,
  inject,
  input,
  output,
  signal,
  computed,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AnalyticsChangesSince } from '@core/models/entities/admin-dashboard-visit.model';
import { TranslateService } from '@core/services/translate.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { formatPagePath } from '../analytics-utils';
import { BANNER_AUTO_HIDE_MS } from '@shared/config/analytics.config';

@Component({
  selector: 'app-analytics-changes-banner',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, TranslatePipe],
  templateUrl: './analytics-changes-banner.component.html',
  styleUrl: './analytics-changes-banner.component.css',
})
export class AnalyticsChangesBannerComponent implements OnInit, OnDestroy {
  changes = input.required<AnalyticsChangesSince>();
  lastVisitAt = input.required<string>();
  dismissed = output<void>();

  translate = inject(TranslateService);

  expanded = signal(false);
  visible = signal(true);
  private autoHideTimeout: ReturnType<typeof setTimeout> | null = null;

  formatPagePath = formatPagePath;

  hasChanges = computed(() => {
    const c = this.changes();
    return (
      c.total_new_views > 0 ||
      c.total_new_visitors > 0 ||
      c.total_new_recruiters > 0 ||
      c.total_new_cv_downloads > 0
    );
  });

  timeAgo = computed(() => {
    const lastVisit = new Date(this.lastVisitAt());
    const now = new Date();
    const diffMs = now.getTime() - lastVisit.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d`;
    if (diffHours > 0) return `${diffHours}h`;
    return `${diffMins}m`;
  });

  ngOnInit(): void {
    this.autoHideTimeout = setTimeout(() => {
      this.dismiss();
    }, BANNER_AUTO_HIDE_MS);
  }

  ngOnDestroy(): void {
    if (this.autoHideTimeout) {
      clearTimeout(this.autoHideTimeout);
    }
  }

  toggleExpanded(): void {
    this.expanded.update((v) => !v);
  }

  dismiss(): void {
    this.visible.set(false);
    this.dismissed.emit();
  }
}
