import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { PortfolioFilterComponent, FilterOption } from '@shared/components/portfolio-filter/portfolio-filter.component';
import { ScrollRevealDirective } from '@shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-portfolio-experience',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, PortfolioFilterComponent, ScrollRevealDirective],
  templateUrl: './portfolio-experience.component.html',
})
export class PortfolioExperienceComponent implements OnInit {
  protected data = inject(PortfolioDataService);

  searchText = signal('');
  selectedCompany = signal('');

  companyFilterOptions = computed<FilterOption[]>(() => {
    return this.data.getAllCompanies().map(c => ({ label: c, value: c }));
  });

  filteredExperiences = computed(() => {
    let experiences = this.data.experiences();
    const search = this.searchText().toLowerCase();
    const company = this.selectedCompany();

    if (search) {
      experiences = experiences.filter(e => {
        const role = this.data.getEntityTranslation(e, 'role').toLowerCase();
        const desc = this.data.getEntityTranslation(e, 'description').toLowerCase();
        const comp = e.company.toLowerCase();
        return role.includes(search) || desc.includes(search) || comp.includes(search);
      });
    }

    if (company) {
      experiences = experiences.filter(e => e.company === company);
    }

    return experiences;
  });

  onSearchChange(text: string): void {
    this.searchText.set(text);
  }

  onCompanyFilterChange(company: string): void {
    this.selectedCompany.set(company);
  }

  async ngOnInit(): Promise<void> {
    await this.data.initialize();
  }
}
