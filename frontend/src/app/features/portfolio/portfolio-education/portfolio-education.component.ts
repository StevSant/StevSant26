import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { ScrollRevealDirective } from '@shared/directives/scroll-reveal.directive';
import { Education } from '@core/models';

@Component({
  selector: 'app-portfolio-education',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, ScrollRevealDirective],
  templateUrl: './portfolio-education.component.html',
})
export class PortfolioEducationComponent implements OnInit {
  protected data = inject(PortfolioDataService);

  sortedEducations = computed(() => {
    return [...this.data.educations()].sort((a, b) => {
      const dateA = a.start_date ? new Date(a.start_date).getTime() : 0;
      const dateB = b.start_date ? new Date(b.start_date).getTime() : 0;
      return dateA - dateB; // oldest first
    });
  });

  async ngOnInit(): Promise<void> {
    await this.data.initialize();
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
}
