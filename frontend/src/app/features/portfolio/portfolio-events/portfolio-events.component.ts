import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { PortfolioFilterComponent, FilterOption } from '@shared/components/portfolio-filter/portfolio-filter.component';
import { ScrollRevealDirective } from '@shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-portfolio-events',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, TranslatePipe, PortfolioFilterComponent, ScrollRevealDirective],
  templateUrl: './portfolio-events.component.html',
})
export class PortfolioEventsComponent implements OnInit {
  protected data = inject(PortfolioDataService);

  searchText = signal('');
  selectedSkill = signal('');

  skillFilterOptions = computed<FilterOption[]>(() => {
    return this.data.getAllSkillNames().map(name => ({ label: name, value: name }));
  });

  filteredEvents = computed(() => {
    let events = this.data.events();
    const search = this.searchText().toLowerCase();
    const skill = this.selectedSkill();

    if (search) {
      events = events.filter(e => {
        const name = this.data.getEntityTranslation(e, 'name').toLowerCase();
        const desc = this.data.getEntityTranslation(e, 'description').toLowerCase();
        return name.includes(search) || desc.includes(search);
      });
    }

    if (skill) {
      events = events.filter(e => {
        const usages = this.data.getSkillUsages('event', e.id);
        return usages.some(u => this.data.getSkillName(u) === skill);
      });
    }

    return events;
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
