import { Component, input, output, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

export interface FilterOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-portfolio-filter',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './portfolio-filter.component.html',
})
export class PortfolioFilterComponent {
  /** Placeholder text for the search input */
  placeholder = input<string>('portfolio.filter.searchPlaceholder');

  /** Filter chip options (optional) */
  filterOptions = input<FilterOption[]>([]);

  /** Label for the filter chips group */
  filterLabel = input<string>('');

  /** Emitted when the search text changes */
  searchChange = output<string>();

  /** Emitted when a filter chip is selected/deselected */
  filterChange = output<string>();

  searchText = signal('');
  selectedFilter = signal('');

  onSearchInput(value: string): void {
    this.searchText.set(value);
    this.searchChange.emit(value);
  }

  onFilterSelect(value: string): void {
    const current = this.selectedFilter();
    const newValue = current === value ? '' : value;
    this.selectedFilter.set(newValue);
    this.filterChange.emit(newValue);
  }

  clearSearch(): void {
    this.searchText.set('');
    this.searchChange.emit('');
  }
}
