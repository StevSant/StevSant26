import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { SeoService } from '@core/services/seo.service';
import { TranslateService } from '@core/services/translate.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import {
  PortfolioFilterComponent,
  FilterOption,
} from '@shared/components/portfolio-filter/portfolio-filter.component';
import { ScrollRevealDirective } from '@shared/directives/scroll-reveal.directive';
import { Experience } from '@core/models';
import { MatIcon } from '@angular/material/icon';
import { PortfolioTimelineSkeletonComponent } from '@shared/components/portfolio-timeline-skeleton/portfolio-timeline-skeleton.component';

@Component({
  selector: 'app-portfolio-experience',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslatePipe,
    PortfolioFilterComponent,
    ScrollRevealDirective,
    MatIcon,
    PortfolioTimelineSkeletonComponent,
  ],
  templateUrl: './portfolio-experience.component.html',
})
export class PortfolioExperienceComponent implements OnInit {
  protected data = inject(PortfolioDataService);
  private seoService = inject(SeoService);
  private translateService = inject(TranslateService);

  searchText = signal('');
  selectedCompany = signal('');

  companyFilterOptions = computed<FilterOption[]>(() => {
    return this.data.getAllCompanies().map((c) => ({ label: c, value: c }));
  });

  filteredExperiences = computed(() => {
    let experiences = this.data.experiences();
    const search = this.searchText().toLowerCase();
    const company = this.selectedCompany();

    if (search) {
      experiences = experiences.filter((e) => {
        const role = this.data.getEntityTranslation(e, 'role').toLowerCase();
        const desc = this.data.getEntityTranslation(e, 'description').toLowerCase();
        const comp = e.company.toLowerCase();
        return role.includes(search) || desc.includes(search) || comp.includes(search);
      });
    }

    if (company) {
      experiences = experiences.filter((e) => e.company === company);
    }

    // Sort by start_date ascending (oldest first), ongoing experiences at the end
    return [...experiences].sort((a, b) => {
      const aStart = a.start_date ? new Date(a.start_date).getTime() : 0;
      const bStart = b.start_date ? new Date(b.start_date).getTime() : 0;
      return aStart - bStart;
    });
  });

  isOngoing(exp: Experience): boolean {
    return !exp.end_date;
  }

  formatMonth(dateStr: string | null): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString(this.data.currentLang() === 'es' ? 'es-ES' : 'en-US', {
      month: 'short',
      year: 'numeric',
    });
  }

  getDuration(exp: Experience): string {
    if (!exp.start_date) return '';
    const start = new Date(exp.start_date);
    const end = exp.end_date ? new Date(exp.end_date) : new Date();
    let months =
      (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    if (months < 1) months = 1;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    const lang = this.data.currentLang();
    if (years > 0 && remainingMonths > 0) {
      return lang === 'es' ? `${years}a ${remainingMonths}m` : `${years}y ${remainingMonths}m`;
    }
    if (years > 0) {
      return lang === 'es'
        ? `${years} ${years === 1 ? 'año' : 'años'}`
        : `${years} ${years === 1 ? 'year' : 'years'}`;
    }
    return lang === 'es'
      ? `${remainingMonths} ${remainingMonths === 1 ? 'mes' : 'meses'}`
      : `${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`;
  }

  getTooltip(exp: Experience): string {
    const role = this.data.getEntityTranslation(exp, 'role');
    const company = exp.company;
    const duration = this.getDuration(exp);
    const start = this.formatMonth(exp.start_date);
    const end = this.isOngoing(exp)
      ? this.data.currentLang() === 'es'
        ? 'Presente'
        : 'Present'
      : this.formatMonth(exp.end_date);
    return `${role} — ${company}\n${start} → ${end}${duration ? ' (' + duration + ')' : ''}`;
  }

  onSearchChange(text: string): void {
    this.searchText.set(text);
  }

  onCompanyFilterChange(company: string): void {
    this.selectedCompany.set(company);
  }

  async ngOnInit(): Promise<void> {
    await this.data.initialize();
    const siteUrl = this.seoService.getSiteUrl();
    const locale = this.translateService.currentLang() === 'es' ? 'es_ES' : 'en_US';
    this.seoService.updateMeta({
      title: this.translateService.instant('seo.experience.title'),
      description: this.translateService.instant('seo.experience.description'),
      url: `${siteUrl}/experience`,
      locale,
      keywords: this.translateService.instant('seo.keywords.experience'),
    });
    this.seoService.setJsonLd(
      this.seoService.buildBreadcrumbSchema([
        { name: this.translateService.instant('seo.home.title'), url: siteUrl },
        {
          name: this.translateService.instant('seo.experience.title'),
          url: `${siteUrl}/experience`,
        },
      ]),
    );
  }
}
