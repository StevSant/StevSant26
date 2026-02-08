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
      case 'formal': return 'M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222';
      case 'course': return 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253';
      case 'certification': return 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z';
    }
  }
}
