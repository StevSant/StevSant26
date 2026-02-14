import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { SeoService } from '@core/services/seo.service';
import { TranslateService } from '@core/services/translate.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { ScrollRevealDirective } from '@shared/directives/scroll-reveal.directive';
import { Education, EducationType } from '@core/models';

interface EducationGroup {
  type: EducationType;
  items: Education[];
}

@Component({
  selector: 'app-portfolio-education',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, ScrollRevealDirective],
  templateUrl: './portfolio-education.component.html',
})
export class PortfolioEducationComponent implements OnInit {
  protected data = inject(PortfolioDataService);
  private seoService = inject(SeoService);
  private translate = inject(TranslateService);

  /** All educations sorted oldest first */
  sortedEducations = computed(() => {
    return [...this.data.educations()].sort((a, b) => {
      const dateA = a.start_date ? new Date(a.start_date).getTime() : 0;
      const dateB = b.start_date ? new Date(b.start_date).getTime() : 0;
      return dateA - dateB; // oldest first
    });
  });

  /** Educations grouped by type: formal, course, certification */
  educationGroups = computed<EducationGroup[]>(() => {
    const all = this.sortedEducations();
    const typeOrder: EducationType[] = ['formal', 'course', 'certification'];
    const groups: EducationGroup[] = [];

    for (const type of typeOrder) {
      const items = all.filter(e => (e.education_type || 'formal') === type);
      if (items.length > 0) {
        groups.push({ type, items });
      }
    }
    return groups;
  });

  /** Total count of all education entries */
  totalCount = computed(() => this.data.educations().length);

  async ngOnInit(): Promise<void> {
    await this.data.initialize();
    const siteUrl = this.seoService.getSiteUrl();
    const locale = this.translate.currentLang() === 'es' ? 'es_ES' : 'en_US';
    this.seoService.updateMeta({
      title: this.translate.instant('seo.education.title'),
      description: this.translate.instant('seo.education.description'),
      url: `${siteUrl}/education`,
      locale,
      keywords: this.translate.instant('seo.keywords.education'),
    });
    this.seoService.setJsonLd(
      this.seoService.buildBreadcrumbSchema([
        { name: this.translate.instant('seo.home.title'), url: siteUrl },
        { name: this.translate.instant('seo.education.title'), url: `${siteUrl}/education` },
      ])
    );
  }

  isOngoing(edu: Education): boolean {
    return !edu.end_date;
  }

  getDegree(edu: Education): string {
    return this.data.getEntityTranslation(edu, 'degree');
  }

  getFieldOfStudy(edu: Education): string {
    return this.data.getEntityTranslation(edu, 'field_of_study');
  }

  getDescription(edu: Education): string {
    return this.data.getEntityTranslation(edu, 'description');
  }

  formatYear(dateStr: string | null): string {
    if (!dateStr) return '';
    return new Date(dateStr).getFullYear().toString();
  }

  getDuration(edu: Education): string {
    if (!edu.start_date) return '';
    const start = new Date(edu.start_date);
    const end = edu.end_date ? new Date(edu.end_date) : new Date();
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years > 0 && remainingMonths > 0) return `${years}a ${remainingMonths}m`;
    if (years > 0) return `${years}a`;
    return `${remainingMonths}m`;
  }

  getTypeIcon(type: EducationType): string {
    switch (type) {
      case 'formal': return 'school';
      case 'course': return 'menu_book';
      case 'certification': return 'verified';
    }
  }
}
