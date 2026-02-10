import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { SeoService } from '@core/services/seo.service';
import { TranslateService } from '@core/services/translate.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { PortfolioFilterComponent, FilterOption, FilterOptionGroup } from '@shared/components/portfolio-filter/portfolio-filter.component';
import { ScrollRevealDirective } from '@shared/directives/scroll-reveal.directive';

@Component({
  selector: 'app-portfolio-projects',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, TranslatePipe, PortfolioFilterComponent, ScrollRevealDirective],
  templateUrl: './portfolio-projects.component.html',
})
export class PortfolioProjectsComponent implements OnInit {
  protected data = inject(PortfolioDataService);
  private seoService = inject(SeoService);
  private translateService = inject(TranslateService);

  searchText = signal('');
  selectedSkill = signal('');

  skillFilterOptions = computed<FilterOption[]>(() => {
    return this.data.getAllSkillNames().map(name => ({ label: name, value: name }));
  });

  skillFilterGroups = computed<FilterOptionGroup[]>(() => {
    return this.data.getGroupedSkillNames().map(g => ({
      label: g.category,
      options: g.names.map(n => ({ label: n, value: n })),
    }));
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
        // Check skill usages on the parent project itself
        const parentUsages = this.data.getSkillUsages('project', p.id);
        if (parentUsages.some(u => this.data.getSkillName(u) === skill)) return true;
        // Also check skill usages on any child/sub-projects
        const children = this.data.getSubProjects(p.id);
        return children.some(child => {
          const childUsages = this.data.getSkillUsages('project', child.id);
          return childUsages.some(u => this.data.getSkillName(u) === skill);
        });
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
    const siteUrl = this.seoService.getSiteUrl();
    const locale = this.translateService.currentLang() === 'es' ? 'es_ES' : 'en_US';
    this.seoService.updateMeta({
      title: this.translateService.instant('seo.projects.title'),
      description: this.translateService.instant('seo.projects.description'),
      url: `${siteUrl}/projects`,
      locale,
      keywords: this.translateService.instant('seo.keywords.projects'),
    });
    this.seoService.setJsonLd(
      this.seoService.buildBreadcrumbSchema([
        { name: this.translateService.instant('seo.home.title'), url: siteUrl },
        { name: this.translateService.instant('seo.projects.title'), url: `${siteUrl}/projects` },
      ])
    );
  }
}
