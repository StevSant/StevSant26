import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  signal,
  computed,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { GlobeComponent } from '@shared/components/globe/globe.component';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-portfolio-map-card',
  standalone: true,
  imports: [CommonModule, GlobeComponent, TranslatePipe],
  templateUrl: './portfolio-map-card.component.html',
})
export class PortfolioMapCardComponent implements OnInit, OnDestroy {
  /** City name to display */
  @Input() city = '';
  /** Country code (ISO 2-letter) */
  @Input() countryCode = '';
  /** IANA timezone string, e.g. "America/Bogota" */
  @Input() timezone = '';
  /** Job title / role */
  @Input() jobTitle = '';
  /** Latitude for the globe marker */
  @Input() latitude = 0;
  /** Longitude for the globe marker */
  @Input() longitude = 0;

  private platformId = inject(PLATFORM_ID);
  private timeInterval: ReturnType<typeof setInterval> | null = null;

  currentTime = signal('--:-- --');

  displayLocation = computed(() => {
    if (this.city && this.countryCode) {
      return `${this.city}, ${this.countryCode.toUpperCase()}`;
    }
    if (this.city) return this.city;
    return '';
  });

  /** Friendly timezone display, e.g. "America/Guayaquil" → "GMT-5" */
  timezoneDisplay = computed(() => {
    if (!this.timezone) return '';
    try {
      const now = new Date();
      const short = new Intl.DateTimeFormat('en-US', {
        timeZone: this.timezone,
        timeZoneName: 'shortOffset',
      }).formatToParts(now).find(p => p.type === 'timeZoneName')?.value || '';
      // e.g. "GMT-5" — also show friendly name
      const friendly = this.timezone.replace(/_/g, ' ').split('/').pop() || '';
      return short ? `${friendly} (${short})` : friendly;
    } catch {
      return this.timezone.replace(/_/g, ' ').split('/').pop() || '';
    }
  });

  /** Formatted coordinates, e.g. "0.95°S, 80.73°W" */
  coordsDisplay = computed(() => {
    if (!this.latitude && !this.longitude) return '';
    const latDir = this.latitude >= 0 ? 'N' : 'S';
    const lngDir = this.longitude >= 0 ? 'E' : 'W';
    return `${Math.abs(this.latitude).toFixed(2)}°${latDir}, ${Math.abs(this.longitude).toFixed(2)}°${lngDir}`;
  });

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.updateTime();
    this.timeInterval = setInterval(() => this.updateTime(), 1000);
  }

  ngOnDestroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  private updateTime(): void {
    try {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: this.timezone || undefined,
      };
      this.currentTime.set(
        new Intl.DateTimeFormat('en-US', options).format(now)
      );
    } catch {
      const now = new Date();
      this.currentTime.set(
        now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
      );
    }
  }
}
