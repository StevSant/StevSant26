import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { MatIcon } from '@angular/material/icon';

export interface DashboardFilterOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-dashboard-filter',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe, MatIcon],
  templateUrl: './dashboard-filter.component.html',
})
export class DashboardFilterComponent {
  /** Placeholder key for translation */
  searchPlaceholder = input<string>('common.search');

  /** Dropdown filter options */
  filterOptions = input<DashboardFilterOption[]>([]);

  /** Label for the dropdown filter */
  filterLabel = input<string>('');

  /** Show "All" option in dropdown */
  showAllOption = input(true);

  /** Emitted when the search text changes */
  searchChange = output<string>();

  /** Emitted when a dropdown filter is selected */
  filterChange = output<string>();

  searchText = signal('');
  selectedFilter = signal('');

  onSearchInput(value: string): void {
    this.searchText.set(value);
    this.searchChange.emit(value);
  }

  onFilterSelect(value: string): void {
    this.selectedFilter.set(value);
    this.filterChange.emit(value);
  }

  clearSearch(): void {
    this.searchText.set('');
    this.searchChange.emit('');
  }
}
