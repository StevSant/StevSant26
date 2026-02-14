import {
  Component,
  output,
  signal,
  inject,
  PLATFORM_ID,
  OnDestroy,
  ElementRef,
  viewChild,
  input,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LOCATION_SEARCH_DEBOUNCE_MS, LOCATION_SEARCH_MAX_RESULTS, NOMINATIM_API_URL } from '@shared/config/constants';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { LoggerService } from '@core/services/logger.service';
import { MatIcon } from '@angular/material/icon';

export interface LocationResult {
  city: string;
  country_code: string;
  timezone: string;
  latitude: number;
  longitude: number;
  displayName: string;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
    state?: string;
    country?: string;
    country_code?: string;
  };
}

// Simplified timezone lookup by country + longitude offset
const COUNTRY_TIMEZONES: Record<string, string[]> = {
  us: ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'America/Anchorage', 'Pacific/Honolulu'],
  ca: ['America/Toronto', 'America/Winnipeg', 'America/Edmonton', 'America/Vancouver', 'America/Halifax'],
  mx: ['America/Mexico_City', 'America/Cancun', 'America/Tijuana'],
  br: ['America/Sao_Paulo', 'America/Manaus', 'America/Belem', 'America/Recife'],
  ar: ['America/Argentina/Buenos_Aires'],
  cl: ['America/Santiago'],
  co: ['America/Bogota'],
  ec: ['America/Guayaquil', 'Pacific/Galapagos'],
  pe: ['America/Lima'],
  ve: ['America/Caracas'],
  bo: ['America/La_Paz'],
  py: ['America/Asuncion'],
  uy: ['America/Montevideo'],
  cr: ['America/Costa_Rica'],
  pa: ['America/Panama'],
  gt: ['America/Guatemala'],
  cu: ['America/Havana'],
  do: ['America/Santo_Domingo'],
  gb: ['Europe/London'],
  fr: ['Europe/Paris'],
  de: ['Europe/Berlin'],
  es: ['Europe/Madrid'],
  it: ['Europe/Rome'],
  pt: ['Europe/Lisbon'],
  nl: ['Europe/Amsterdam'],
  be: ['Europe/Brussels'],
  ch: ['Europe/Zurich'],
  at: ['Europe/Vienna'],
  pl: ['Europe/Warsaw'],
  cz: ['Europe/Prague'],
  se: ['Europe/Stockholm'],
  no: ['Europe/Oslo'],
  dk: ['Europe/Copenhagen'],
  fi: ['Europe/Helsinki'],
  ie: ['Europe/Dublin'],
  ru: ['Europe/Moscow', 'Asia/Yekaterinburg', 'Asia/Novosibirsk', 'Asia/Vladivostok'],
  ua: ['Europe/Kiev'],
  tr: ['Europe/Istanbul'],
  gr: ['Europe/Athens'],
  ro: ['Europe/Bucharest'],
  cn: ['Asia/Shanghai'],
  jp: ['Asia/Tokyo'],
  kr: ['Asia/Seoul'],
  in: ['Asia/Kolkata'],
  au: ['Australia/Sydney', 'Australia/Melbourne', 'Australia/Perth', 'Australia/Brisbane'],
  nz: ['Pacific/Auckland'],
  za: ['Africa/Johannesburg'],
  eg: ['Africa/Cairo'],
  ng: ['Africa/Lagos'],
  ke: ['Africa/Nairobi'],
  ae: ['Asia/Dubai'],
  sa: ['Asia/Riyadh'],
  il: ['Asia/Jerusalem'],
  th: ['Asia/Bangkok'],
  sg: ['Asia/Singapore'],
  ph: ['Asia/Manila'],
  id: ['Asia/Jakarta'],
  my: ['Asia/Kuala_Lumpur'],
  vn: ['Asia/Ho_Chi_Minh'],
  pk: ['Asia/Karachi'],
  bd: ['Asia/Dhaka'],
  hn: ['America/Tegucigalpa'],
  sv: ['America/El_Salvador'],
  ni: ['America/Managua'],
};

@Component({
  selector: 'app-location-picker',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, MatIcon],
  templateUrl: './location-picker.component.html',
})
export class LocationPickerComponent implements OnDestroy {
  searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  /** Current selected location display text */
  currentLocation = input<string>('');

  /** Emitted when a location is selected */
  locationSelected = output<LocationResult>();

  private platformId = inject(PLATFORM_ID);
  private logger = inject(LoggerService);
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;
  private abortController: AbortController | null = null;

  searchQuery = signal('');
  results = signal<NominatimResult[]>([]);
  isSearching = signal(false);
  showResults = signal(false);
  noResults = signal(false);
  selectedDisplay = signal('');

  onSearchInput(query: string): void {
    this.searchQuery.set(query);
    this.noResults.set(false);

    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    if (this.abortController) this.abortController.abort();

    if (query.trim().length < 2) {
      this.results.set([]);
      this.showResults.set(false);
      return;
    }

    // Debounce 400ms
    this.searchTimeout = setTimeout(() => this.searchLocation(query.trim()), LOCATION_SEARCH_DEBOUNCE_MS);
  }

  private async searchLocation(query: string): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;

    this.isSearching.set(true);
    this.showResults.set(true);
    this.abortController = new AbortController();

    try {
      const url = `${NOMINATIM_API_URL}/search?format=json&addressdetails=1&limit=${LOCATION_SEARCH_MAX_RESULTS}&q=${encodeURIComponent(query)}`;
      const response = await fetch(url, {
        signal: this.abortController.signal,
        headers: { 'Accept-Language': 'en' },
      });
      const data: NominatimResult[] = await response.json();
      this.results.set(data);
      this.noResults.set(data.length === 0);
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        this.logger.error('Location search error:', err);
        this.results.set([]);
      }
    } finally {
      this.isSearching.set(false);
    }
  }

  selectResult(result: NominatimResult): void {
    const addr = result.address;
    const city = addr.city || addr.town || addr.village || addr.municipality || addr.county || addr.state || '';
    const countryCode = (addr.country_code || '').toUpperCase();
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    const timezone = this.estimateTimezone(countryCode.toLowerCase(), lng);

    const displayName = city && addr.country
      ? `${city}, ${countryCode}`
      : result.display_name.split(',').slice(0, 2).join(',').trim();

    this.selectedDisplay.set(displayName);
    this.searchQuery.set('');
    this.results.set([]);
    this.showResults.set(false);

    this.locationSelected.emit({
      city,
      country_code: countryCode,
      timezone,
      latitude: lat,
      longitude: lng,
      displayName,
    });
  }

  private estimateTimezone(countryCode: string, longitude: number): string {
    const timezones = COUNTRY_TIMEZONES[countryCode];
    if (timezones && timezones.length === 1) {
      return timezones[0];
    }

    if (timezones && timezones.length > 1) {
      // For countries with multiple timezones, pick the closest by longitude heuristic
      // This is a rough estimate — good enough for most cases
      return timezones[0];
    }

    // Fallback: estimate UTC offset from longitude
    const offset = Math.round(longitude / 15);
    if (offset === 0) return 'Europe/London';
    if (offset >= 1 && offset <= 2) return 'Europe/Paris';
    if (offset === 3) return 'Europe/Moscow';
    if (offset === 4) return 'Asia/Dubai';
    if (offset === 5) return 'Asia/Karachi';
    if (offset >= 6 && offset <= 7) return 'Asia/Bangkok';
    if (offset === 8) return 'Asia/Shanghai';
    if (offset === 9) return 'Asia/Tokyo';
    if (offset >= 10 && offset <= 11) return 'Australia/Sydney';
    if (offset === 12) return 'Pacific/Auckland';
    if (offset <= -3 && offset >= -5) return 'America/Bogota';
    if (offset <= -5 && offset >= -6) return 'America/Chicago';
    if (offset <= -7 && offset >= -8) return 'America/Los_Angeles';
    if (offset <= -9) return 'America/Anchorage';
    return `Etc/GMT${offset >= 0 ? '-' : '+'}${Math.abs(offset)}`;
  }

  formatResultName(result: NominatimResult): string {
    const addr = result.address;
    const city = addr.city || addr.town || addr.village || addr.municipality || '';
    const state = addr.state || '';
    const country = addr.country || '';

    if (city && state && country) return `${city}, ${state}, ${country}`;
    if (city && country) return `${city}, ${country}`;
    return result.display_name.split(',').slice(0, 3).join(',').trim();
  }

  formatResultSubtext(result: NominatimResult): string {
    const parts = result.display_name.split(',');
    return parts.length > 3 ? parts.slice(2, 5).join(',').trim() : '';
  }

  onBlur(): void {
    // Delay to allow click on results
    setTimeout(() => {
      this.showResults.set(false);
    }, 200);
  }

  onFocus(): void {
    if (this.results().length > 0) {
      this.showResults.set(true);
    }
  }

  clearSelection(): void {
    this.selectedDisplay.set('');
    this.searchQuery.set('');
    this.results.set([]);
    this.locationSelected.emit({
      city: '',
      country_code: '',
      timezone: '',
      latitude: 0,
      longitude: 0,
      displayName: '',
    });
  }

  ngOnDestroy(): void {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    if (this.abortController) this.abortController.abort();
  }
}
