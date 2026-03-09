import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { SeoService } from '@core/services/seo.service';
import { TranslateService } from '@core/services/translate.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import {
  PortfolioFilterComponent,
  FilterOption,
  FilterOptionGroup,
} from '@shared/components/portfolio-filter/portfolio-filter.component';
import { ScrollRevealDirective } from '@shared/directives/scroll-reveal.directive';
import { ProgressiveImageComponent } from '@shared/components/progressive-image/progressive-image.component';
import { PortfolioGridSkeletonComponent } from '@shared/components/portfolio-grid-skeleton/portfolio-grid-skeleton.component';

@Component({
  selector: 'app-portfolio-competitions',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    RouterModule,
    TranslatePipe,
    PortfolioFilterComponent,
    ScrollRevealDirective,
    ProgressiveImageComponent,
    PortfolioGridSkeletonComponent,
  ],
  templateUrl: './portfolio-competitions.component.html',
})
export class PortfolioCompetitionsComponent implements OnInit {
  protected data = inject(PortfolioDataService);
  private seoService = inject(SeoService);
  private translateService = inject(TranslateService);

  searchText = signal('');
  selectedSkill = signal('');

  skillFilterOptions = computed<FilterOption[]>(() => {
    return this.data.getAllSkillNames().map((name) => ({ label: name, value: name }));
  });

  skillFilterGroups = computed<FilterOptionGroup[]>(() => {
    return this.data.getGroupedSkillNamesBySourceType('competition').map((g) => ({
      label: g.category,
      options: g.names.map((n) => ({ label: n, value: n })),
    }));
  });

  filteredCompetitions = computed(() => {
    let competitions = this.data.competitions();
    const search = this.searchText().toLowerCase();
    const skill = this.selectedSkill();

    if (search) {
      competitions = competitions.filter((c) => {
        const name = this.data.getEntityTranslation(c, 'name').toLowerCase();
        const desc = this.data.getEntityTranslation(c, 'description').toLowerCase();
        const organizer = (c.organizer || '').toLowerCase();
        return name.includes(search) || desc.includes(search) || organizer.includes(search);
      });
    }

    if (skill) {
      competitions = competitions.filter((c) => {
        const usages = this.data.getSkillUsages('competition', c.id);
        return usages.some((u) => this.data.getSkillName(u) === skill);
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
    const siteUrl = this.seoService.getSiteUrl();
    const locale = this.translateService.currentLang() === 'es' ? 'es_ES' : 'en_US';
    this.seoService.updateMeta({
      title: this.translateService.instant('seo.competitions.title'),
      description: this.translateService.instant('seo.competitions.description'),
      url: `${siteUrl}/competitions`,
      locale,
      keywords: this.translateService.instant('seo.keywords.competitions'),
    });
    this.seoService.setJsonLd(
      this.seoService.buildBreadcrumbSchema([
        { name: this.translateService.instant('seo.home.title'), url: siteUrl },
        {
          name: this.translateService.instant('seo.competitions.title'),
          url: `${siteUrl}/competitions`,
        },
      ]),
    );
  }
}
