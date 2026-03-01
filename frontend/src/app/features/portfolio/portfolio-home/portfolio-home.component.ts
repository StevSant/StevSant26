import { Component, inject, OnInit, computed, signal, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { SeoService } from '@core/services/seo.service';
import { TranslateService } from '@core/services/translate.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { SafeHtmlPipe } from '@shared/pipes/safe-html.pipe';
import { ScrollRevealDirective } from '@shared/directives/scroll-reveal.directive';
import { PortfolioMapCardComponent } from '../components/portfolio-map-card/portfolio-map-card.component';
import { MatIcon } from '@angular/material/icon';
import { getSkillFallbackIcon } from '@shared/utils/skill-icons';

@Component({
  selector: 'app-portfolio-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, SafeHtmlPipe, ScrollRevealDirective, PortfolioMapCardComponent, MatIcon],
  templateUrl: './portfolio-home.component.html',
})
export class PortfolioHomeComponent implements OnInit {
  protected data = inject(PortfolioDataService);
  private seoService = inject(SeoService);
  private translate = inject(TranslateService);
  private elRef = inject(ElementRef);

  // Image modal state
  showImageModal = signal(false);
  modalImageUrl = signal<string | null>(null);
  modalImageAlt = signal<string>('');

  // CV dropdown state
  cvMenuOpen = signal(false);

  pinnedProjects = computed(() =>
    this.data.projects().filter(p => p.is_pinned && !p.is_archived).slice(0, 3)
  );

  topSkillCategories = computed(() =>
    this.data.skillCategories().slice(0, 4)
  );

  /** All skills flattened for the scrolling ticker */
  allSkills = computed(() =>
    this.data.skillCategories().flatMap(c => c.skills)
  );

  /** Get a fallback icon for a skill when icon_url is not set. */
  getSkillFallback(skillName: string): { type: 'url' | 'flag'; value: string } | null {
    return getSkillFallbackIcon(skillName);
  }

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
      ])
    );
  }

  openImageModal(url: string, alt: string): void {
    this.modalImageUrl.set(url);
    this.modalImageAlt.set(alt);
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

  toggleCvMenu(): void {
    this.cvMenuOpen.update(v => !v);
  }

  closeCvMenu(): void {
    this.cvMenuOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.cvMenuOpen() && !this.elRef.nativeElement.querySelector('.relative')?.contains(event.target)) {
      this.closeCvMenu();
    }
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.cvMenuOpen()) {
      this.closeCvMenu();
    }
  }
}
