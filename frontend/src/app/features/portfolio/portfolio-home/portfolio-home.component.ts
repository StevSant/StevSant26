import { Component, inject, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { SeoService } from '@core/services/seo.service';
import { TranslateService } from '@core/services/translate.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { MatIcon } from '@angular/material/icon';

import { PortfolioHomeSkeletonComponent } from '@shared/components/portfolio-home-skeleton/portfolio-home-skeleton.component';
import { PortfolioHeroComponent } from './portfolio-hero/portfolio-hero.component';
import { PortfolioAboutComponent } from './portfolio-about/portfolio-about.component';
import { PortfolioFeaturedProjectsComponent } from './portfolio-featured-projects/portfolio-featured-projects.component';
import { PortfolioSkillsTickerComponent } from './portfolio-skills-ticker/portfolio-skills-ticker.component';

@Component({
  selector: 'app-portfolio-home',
  standalone: true,
  imports: [
    CommonModule,
    TranslatePipe,
    MatIcon,
    PortfolioHomeSkeletonComponent,
    PortfolioHeroComponent,
    PortfolioAboutComponent,
    PortfolioFeaturedProjectsComponent,
    PortfolioSkillsTickerComponent,
  ],
  templateUrl: './portfolio-home.component.html',
})
export class PortfolioHomeComponent implements OnInit {
  protected data = inject(PortfolioDataService);
  private seoService = inject(SeoService);
  private translate = inject(TranslateService);

  // Image modal state
  showImageModal = signal(false);
  modalImageUrl = signal<string | null>(null);
  modalImageAlt = signal<string>('');

  pinnedProjects = computed(() =>
    this.data
      .projects()
      .filter((p) => p.is_pinned && !p.is_archived)
      .slice(0, 3),
  );

  topSkillCategories = computed(() => this.data.skillCategories().slice(0, 4));

  /** All skills flattened for the scrolling ticker */
  allSkills = computed(() => this.data.skillCategories().flatMap((c) => c.skills));

  /** Stats for the animated counter section */
  yearsOfExperience = computed(() => {
    const experiences = this.data.experiences();
    if (experiences.length === 0) return 0;
    const earliest = experiences.reduce((min, exp) => {
      const start = exp.start_date ? new Date(exp.start_date).getTime() : Infinity;
      return start < min ? start : min;
    }, Infinity);
    if (earliest === Infinity) return 0;
    return Math.max(1, Math.floor((Date.now() - earliest) / (365.25 * 24 * 60 * 60 * 1000)));
  });

  /** Whether the profile has location data configured */
  hasLocationData = computed(() => {
    const profile = this.data.profile();
    return !!(profile?.city && profile?.latitude && profile?.longitude);
  });

  /** Resolved job title: from translated headline or profile.job_title */
  profileJobTitle = computed(() => {
    const profile = this.data.profile();
    if (!profile) return '';
    const translation = this.data.getEntityTranslation(profile, 'headline');
    return translation || profile.job_title || '';
  });

  async ngOnInit(): Promise<void> {
    await this.data.initialize();
    this.updateSeo();
  }

  private updateSeo(): void {
    const profile = this.data.profile();
    const fullName = profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() : '';
    const siteUrl = this.seoService.getSiteUrl();
    const locale = this.translate.currentLang() === 'es' ? 'es_ES' : 'en_US';

    this.seoService.updateMeta({
      title: this.translate.instant('seo.home.title'),
      description: this.translate.instant('seo.home.description'),
      image: this.data.avatarUrl() || undefined,
      url: siteUrl,
      locale,
      author: fullName,
      keywords: this.translate.instant('seo.keywords.home'),
    });

    this.seoService.setJsonLd(
      this.seoService.buildBreadcrumbSchema([
        { name: this.translate.instant('seo.home.title'), url: siteUrl },
      ]),
    );
  }

  openImageModal(event: { url: string; alt: string }): void {
    this.modalImageUrl.set(event.url);
    this.modalImageAlt.set(event.alt);
    this.showImageModal.set(true);
  }

  closeImageModal(): void {
    this.showImageModal.set(false);
    this.modalImageUrl.set(null);
  }

  onModalBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.closeImageModal();
    }
  }
}
