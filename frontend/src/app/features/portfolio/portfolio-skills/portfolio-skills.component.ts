import { Component, inject, OnInit, OnDestroy, signal, computed, ElementRef, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PortfolioDataService, SkillCategoryWithSkills, SkillWithLevel } from '../services/portfolio-data.service';
import { SeoService } from '@core/services/seo.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { TranslateService } from '@core/services/translate.service';
import { PortfolioFilterComponent, FilterOption } from '@shared/components/portfolio-filter/portfolio-filter.component';
import { ScrollRevealDirective } from '@shared/directives/scroll-reveal.directive';
import { MatIcon } from '@angular/material/icon';
import { getSkillFallbackIcon } from '@shared/utils/skill-icons';

@Component({
  selector: 'app-portfolio-skills',
  standalone: true,
  imports: [CommonModule, TranslatePipe, PortfolioFilterComponent, ScrollRevealDirective, MatIcon],
  templateUrl: './portfolio-skills.component.html',
})
export class PortfolioSkillsComponent implements OnInit, OnDestroy, AfterViewInit {
  protected data = inject(PortfolioDataService);
  private translate = inject(TranslateService);
  private seoService = inject(SeoService);
  private elRef = inject(ElementRef);
  private platformId = inject(PLATFORM_ID);
  private barObserver?: IntersectionObserver;

  searchText = signal('');
  selectedCategory = signal('');

  /** True when a specific category filter is active */
  isSingleCategoryView = computed(() => !!this.selectedCategory());

  categoryFilterOptions = computed<FilterOption[]>(() => {
    return this.data.skillCategories().map(c => ({
      label: this.data.getCategoryName(c),
      value: String(c.id),
    }));
  });

  filteredCategories = computed(() => {
    let categories = this.data.skillCategories();
    const search = this.searchText().toLowerCase();
    const categoryId = this.selectedCategory();

    if (categoryId) {
      categories = categories.filter(c => String(c.id) === categoryId);
    }

    if (search) {
      categories = categories
        .map(c => ({
          ...c,
          skills: c.skills.filter(s => {
            const name = this.data.getEntityTranslation(s, 'name').toLowerCase();
            const desc = this.data.getSkillDescription(s).toLowerCase();
            return name.includes(search) || desc.includes(search);
          }),
        }))
        .filter(c => c.skills.length > 0);
    }

    return categories;
  });

  /** Flattened list of all skills in filtered categories (for detailed view) */
  flatSkills = computed<SkillWithLevel[]>(() => {
    return this.filteredCategories().flatMap(c => c.skills);
  });

  getLevelLabel(level: number): string {
    const keys = ['', 'portfolio.skillLevel.beginner', 'portfolio.skillLevel.basic', 'portfolio.skillLevel.intermediate', 'portfolio.skillLevel.advanced', 'portfolio.skillLevel.expert'];
    const key = keys[level];
    return key ? this.translate.instant(key) : '';
  }

  getLevelPercentage(level: number): number {
    return (level / 5) * 100;
  }

  onSearchChange(text: string): void {
    this.searchText.set(text);
  }

  onCategoryFilterChange(categoryId: string): void {
    this.selectedCategory.set(categoryId);
  }

  /** Get a fallback icon for a skill when icon_url is not set. */
  getSkillFallback(skill: SkillWithLevel): { type: 'url' | 'flag'; value: string } | null {
    const name = this.data.getEntityTranslation(skill, 'name');
    return getSkillFallbackIcon(name);
  }

  barsAnimated = signal(false);

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.barsAnimated.set(true);
            this.barObserver?.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    // Observe the section element to trigger bar animation
    const section = this.elRef.nativeElement.querySelector('section');
    if (section) this.barObserver.observe(section);
  }

  ngOnDestroy(): void {
    this.barObserver?.disconnect();
  }

  async ngOnInit(): Promise<void> {
    await this.data.initialize();
    const siteUrl = this.seoService.getSiteUrl();
    const locale = this.translate.currentLang() === 'es' ? 'es_ES' : 'en_US';
    this.seoService.updateMeta({
      title: this.translate.instant('seo.skills.title'),
      description: this.translate.instant('seo.skills.description'),
      url: `${siteUrl}/skills`,
      locale,
      keywords: this.translate.instant('seo.keywords.skills'),
    });
    this.seoService.setJsonLd(
      this.seoService.buildBreadcrumbSchema([
        { name: this.translate.instant('seo.home.title'), url: siteUrl },
        { name: this.translate.instant('seo.skills.title'), url: `${siteUrl}/skills` },
      ])
    );
  }
}
