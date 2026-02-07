import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { PortfolioFilterComponent, FilterOption } from '@shared/components/portfolio-filter/portfolio-filter.component';
import { ScrollRevealDirective } from '@shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-portfolio-competitions',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, TranslatePipe, PortfolioFilterComponent, ScrollRevealDirective],
  templateUrl: './portfolio-competitions.component.html',
})
export class PortfolioCompetitionsComponent implements OnInit {
  protected data = inject(PortfolioDataService);

  searchText = signal('');
  selectedSkill = signal('');

  skillFilterOptions = computed<FilterOption[]>(() => {
    return this.data.getAllSkillNames().map(name => ({ label: name, value: name }));
  });

  filteredCompetitions = computed(() => {
    let competitions = this.data.competitions();
    const search = this.searchText().toLowerCase();
    const skill = this.selectedSkill();

    if (search) {
      competitions = competitions.filter(c => {
        const name = this.data.getEntityTranslation(c, 'name').toLowerCase();
        const desc = this.data.getEntityTranslation(c, 'description').toLowerCase();
        const organizer = (c.organizer || '').toLowerCase();
        return name.includes(search) || desc.includes(search) || organizer.includes(search);
      });
    }

    if (skill) {
      competitions = competitions.filter(c => {
        const usages = this.data.getSkillUsages('competition', c.id);
        return usages.some(u => this.data.getSkillName(u) === skill);
      });
    }

    return competitions;
  });

  onSearchChange(text: string): void {
    this.searchText.set(text);
  }

  onSkillFilterChange(skill: string): void {
    this.selectedSkill.set(skill);
  }

  async ngOnInit(): Promise<void> {
    await this.data.initialize();
  }
}
