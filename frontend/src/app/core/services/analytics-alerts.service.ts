import { inject, Injectable, signal, computed } from '@angular/core';
import {
  TRAFFIC_SPIKE_THRESHOLD,
  TRAFFIC_SPIKE_WINDOW_MS,
  TRAFFIC_SPIKE_COOLDOWN_MS,
  TOAST_MAX_VISIBLE,
  TOAST_AUTO_DISMISS_MS,
} from '@shared/config/analytics.config';
import { TranslateService } from '@core/services/translate.service';

export interface AnalyticsAlert {
  id: string;
  type: 'recruiter' | 'cv_download' | 'new_country' | 'traffic_spike';
  icon: string;
  color: string;
  message: string;
  timestamp: Date;
}

@Injectable({ providedIn: 'root' })
export class AnalyticsAlertsService {
  private translate = inject(TranslateService);
  private allAlerts = signal<AnalyticsAlert[]>([]);
  private alertedVisitorHashes = new Set<string>();
  private alertedCountries = new Set<string>();
  private pageViewTimestamps: number[] = [];
  private lastSpikeAlert = 0;
  private dismissTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

  visibleAlerts = computed(() => this.allAlerts().slice(0, TOAST_MAX_VISIBLE));

  handleVisitorInsert(payload: any): void {
    const record = payload.new;
    if (!record) return;

    if (record.country && !this.alertedCountries.has(record.country)) {
      this.alertedCountries.add(record.country);
      this.addAlert({
        type: 'new_country',
        icon: 'flag',
        color: 'purple',
        message: this.translate
          .instant('analytics.toast.newCountry')
          .replace('{{country}}', record.country),
      });
    }
  }

  handleVisitorUpdate(payload: any): void {
    const record = payload.new;
    const oldRecord = payload.old;
    if (!record) return;

    if (
      record.is_potential_recruiter &&
      !oldRecord?.is_potential_recruiter &&
      !this.alertedVisitorHashes.has(record.visitor_hash)
    ) {
      this.alertedVisitorHashes.add(record.visitor_hash);
      const source = record.referrer_source || 'unknown';
      const org = record.organization;
      let message = this.translate
        .instant('analytics.toast.recruiter')
        .replace('{{source}}', source);
      if (org) {
        message += ` (${org})`;
      }
      this.addAlert({
        type: 'recruiter',
        icon: 'work',
        color: 'blue',
        message,
      });
    }
  }

  handleCvDownload(payload: any): void {
    const record = payload.new;
    if (!record) return;

    const fileName = record.file_name || 'CV';
    this.addAlert({
      type: 'cv_download',
      icon: 'download',
      color: 'green',
      message: this.translate
        .instant('analytics.toast.cvDownload')
        .replace('{{fileName}}', fileName),
    });
  }

  handlePageView(payload: any): void {
    const now = Date.now();
    this.pageViewTimestamps.push(now);

    const windowStart = now - TRAFFIC_SPIKE_WINDOW_MS;
    this.pageViewTimestamps = this.pageViewTimestamps.filter((t) => t >= windowStart);

    if (
      this.pageViewTimestamps.length >= TRAFFIC_SPIKE_THRESHOLD &&
      now - this.lastSpikeAlert > TRAFFIC_SPIKE_COOLDOWN_MS
    ) {
      this.lastSpikeAlert = now;
      this.addAlert({
        type: 'traffic_spike',
        icon: 'trending_up',
        color: 'orange',
        message: this.translate
          .instant('analytics.toast.trafficSpike')
          .replace('{{count}}', String(this.pageViewTimestamps.length)),
      });
    }
  }

  dismissAlert(id: string): void {
    const timeout = this.dismissTimeouts.get(id);
    if (timeout) clearTimeout(timeout);
    this.dismissTimeouts.delete(id);
    this.allAlerts.update((alerts) => alerts.filter((a) => a.id !== id));
  }

  resetSession(): void {
    this.alertedVisitorHashes.clear();
    this.alertedCountries.clear();
    this.pageViewTimestamps = [];
    this.lastSpikeAlert = 0;
    this.allAlerts.set([]);
    this.dismissTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.dismissTimeouts.clear();
  }

  initKnownCountries(countries: string[]): void {
    countries.forEach((c) => this.alertedCountries.add(c));
  }

  private addAlert(params: Omit<AnalyticsAlert, 'id' | 'timestamp'>): void {
    const alert: AnalyticsAlert = {
      ...params,
      id: crypto.randomUUID(),
      timestamp: new Date(),
    };

    this.allAlerts.update((alerts) => [alert, ...alerts]);

    const timeout = setTimeout(() => {
      this.dismissAlert(alert.id);
    }, TOAST_AUTO_DISMISS_MS);
    this.dismissTimeouts.set(alert.id, timeout);
  }
}
