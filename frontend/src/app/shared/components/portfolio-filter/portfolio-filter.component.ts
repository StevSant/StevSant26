import { Component, input, output, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterOptionGroup {
  label: string;
  options: FilterOption[];
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

  /** Filter chip options (optional, flat list) */
  filterOptions = input<FilterOption[]>([]);

  /** Filter chip options grouped by category (optional) */
  filterGroups = input<FilterOptionGroup[]>([]);

  /** Label for the filter chips group */
  filterLabel = input<string>('');

  /** Emitted when the search text changes */
  searchChange = output<string>();

  /** Emitted when a filter chip is selected/deselected */
  filterChange = output<string>();

  searchText = signal('');
  selectedFilter = signal('');
  selectedCategory = signal('');

  /** Skills visible based on the selected category */
  activeGroupOptions = computed<FilterOption[]>(() => {
    const cat = this.selectedCategory();
    if (!cat) return [];
    const group = this.filterGroups().find(g => g.label === cat);
    return group?.options ?? [];
  });

  onSearchInput(value: string): void {
    this.searchText.set(value);
    this.searchChange.emit(value);
  }

  onCategorySelect(category: string): void {
    const current = this.selectedCategory();
    if (current === category) {
      // Toggle off category → also clear skill
      this.selectedCategory.set('');
      if (this.selectedFilter()) {
        this.selectedFilter.set('');
        this.filterChange.emit('');
      }
    } else {
      this.selectedCategory.set(category);
      // Clear skill when switching categories
      if (this.selectedFilter()) {
        this.selectedFilter.set('');
        this.filterChange.emit('');
      }
    }
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
