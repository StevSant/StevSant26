import { Component, input, output, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { LocationPickerComponent, LocationResult } from '@shared/components/location-picker/location-picker.component';
import { MatIcon } from '@angular/material/icon';

export interface LocationAvailabilityData {
  city: string;
  country_code: string;
  timezone: string;
  latitude: number | null;
  longitude: number | null;
  job_title: string;
  is_available: boolean;
}

@Component({
  selector: 'app-location-availability-card',
  standalone: true,
  imports: [FormsModule, TranslatePipe, LocationPickerComponent, MatIcon],
  templateUrl: './location-availability-card.component.html',
})
export class LocationAvailabilityCardComponent {
  formData = input.required<LocationAvailabilityData>();
  formDataChange = output<LocationAvailabilityData>();

  /** Show/hide the detailed fields */
  showDetails = false;

  currentLocationDisplay = computed(() => {
    const data = this.formData();
    if (data.city && data.country_code) return `${data.city}, ${data.country_code}`;
    if (data.city) return data.city;
    return '';
  });

  onFieldChange(): void {
    this.formDataChange.emit({ ...this.formData() });
  }

  onLocationSelected(location: LocationResult): void {
    const data = { ...this.formData() };
    data.city = location.city;
    data.country_code = location.country_code;
    data.timezone = location.timezone;
    data.latitude = location.latitude || null;
    data.longitude = location.longitude || null;
    this.formDataChange.emit(data);
  }

  onAvailabilityToggle(): void {
    const data = { ...this.formData() };
    data.is_available = !data.is_available;
    this.formDataChange.emit(data);
  }

  onLatChange(value: string): void {
    const data = { ...this.formData() };
    data.latitude = value ? parseFloat(value) : null;
    this.formDataChange.emit(data);
  }

  onLngChange(value: string): void {
    const data = { ...this.formData() };
    data.longitude = value ? parseFloat(value) : null;
    this.formDataChange.emit(data);
  }

  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }
}
