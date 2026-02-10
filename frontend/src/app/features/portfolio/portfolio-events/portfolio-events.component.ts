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
  selector: 'app-portfolio-events',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, TranslatePipe, PortfolioFilterComponent, ScrollRevealDirective],
  templateUrl: './portfolio-events.component.html',
})
export class PortfolioEventsComponent implements OnInit {
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
    const siteUrl = this.seoService.getSiteUrl();
    const locale = this.translateService.currentLang() === 'es' ? 'es_ES' : 'en_US';
    this.seoService.updateMeta({
      title: this.translateService.instant('seo.events.title'),
      description: this.translateService.instant('seo.events.description'),
      url: `${siteUrl}/events`,
      locale,
      keywords: this.translateService.instant('seo.keywords.events'),
    });
    this.seoService.setJsonLd(
      this.seoService.buildBreadcrumbSchema([
        { name: this.translateService.instant('seo.home.title'), url: siteUrl },
        { name: this.translateService.instant('seo.events.title'), url: `${siteUrl}/events` },
      ])
    );
  }
}
