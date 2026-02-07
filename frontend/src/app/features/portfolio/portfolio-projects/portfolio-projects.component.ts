import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { PortfolioFilterComponent, FilterOption } from '@shared/components/portfolio-filter/portfolio-filter.component';

@Component({
  selector: 'app-portfolio-projects',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, TranslatePipe, PortfolioFilterComponent],
  templateUrl: './portfolio-projects.component.html',
})
export class PortfolioProjectsComponent implements OnInit {
  protected data = inject(PortfolioDataService);

  searchText = signal('');
  selectedSkill = signal('');

  skillFilterOptions = computed<FilterOption[]>(() => {
    return this.data.getAllSkillNames().map(name => ({ label: name, value: name }));
  });

  filteredProjects = computed(() => {
    let projects = this.data.projects();
    const search = this.searchText().toLowerCase();
    const skill = this.selectedSkill();

    if (search) {
      projects = projects.filter(p => {
        const title = this.data.getEntityTranslation(p, 'title').toLowerCase();
        const desc = this.data.getEntityTranslation(p, 'description').toLowerCase();
        return title.includes(search) || desc.includes(search);
      });
    }

    if (skill) {
      projects = projects.filter(p => {
        const usages = this.data.getSkillUsages('project', p.id);
        return usages.some(u => this.data.getSkillName(u) === skill);
      });
    }

    return projects;
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
