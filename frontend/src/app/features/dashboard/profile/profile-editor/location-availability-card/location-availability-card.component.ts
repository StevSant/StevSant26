import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

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
  imports: [FormsModule, TranslatePipe],
  templateUrl: './location-availability-card.component.html',
})
export class LocationAvailabilityCardComponent {
  formData = input.required<LocationAvailabilityData>();
  formDataChange = output<LocationAvailabilityData>();

  onFieldChange(): void {
    this.formDataChange.emit({ ...this.formData() });
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

  onAvailabilityToggle(): void {
    const data = { ...this.formData() };
    data.is_available = !data.is_available;
    this.formDataChange.emit(data);
  }
}
