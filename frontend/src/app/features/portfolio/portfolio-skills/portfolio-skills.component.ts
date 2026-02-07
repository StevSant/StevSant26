import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioDataService, SkillCategoryWithSkills } from '../services/portfolio-data.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { PortfolioFilterComponent, FilterOption } from '@shared/components/portfolio-filter/portfolio-filter.component';

@Component({
  selector: 'app-portfolio-skills',
  standalone: true,
  imports: [CommonModule, TranslatePipe, PortfolioFilterComponent],
  templateUrl: './portfolio-skills.component.html',
})
export class PortfolioSkillsComponent implements OnInit {
  protected data = inject(PortfolioDataService);

  searchText = signal('');
  selectedCategory = signal('');

  categoryFilterOptions = computed<FilterOption[]>(() => {
    return this.data.skillCategories().map(c => ({
      label: this.data.getCategoryName(c),
      value: String(c.id),
    }));
  });

  filteredCategories = computed(() => {
    let categories = this.data.skillCategories();
    const search = this.searchText().toLowerCase();
    const categoryId = this.selectedCategory();

    if (categoryId) {
      categories = categories.filter(c => String(c.id) === categoryId);
    }

    if (search) {
      categories = categories
        .map(c => ({
          ...c,
          skills: c.skills.filter(s => {
            const name = this.data.getEntityTranslation(s, 'name').toLowerCase();
            return name.includes(search);
          }),
        }))
        .filter(c => c.skills.length > 0);
    }

    return categories;
  });

  onSearchChange(text: string): void {
    this.searchText.set(text);
  }

  onCategoryFilterChange(categoryId: string): void {
    this.selectedCategory.set(categoryId);
  }

  async ngOnInit(): Promise<void> {
    await this.data.initialize();
  }
}
