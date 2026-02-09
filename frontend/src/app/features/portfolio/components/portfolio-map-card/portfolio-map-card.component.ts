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
  /** Whether the person is available for work */
  @Input() isAvailable = true;
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
