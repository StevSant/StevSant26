import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  signal,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { ThemeService } from '@core/services/theme.service';
import { SeoService } from '@core/services/seo.service';
import { TranslateService } from '@core/services/translate.service';
import { AnalyticsTrackingService } from '@core/services/analytics-tracking.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { LanguageSelectorComponent } from '@shared/components/language-selector/language-selector.component';
import { ThemeToggleComponent } from '@shared/components/theme-toggle/theme-toggle.component';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { PortfolioNavbarComponent } from './portfolio-navbar/portfolio-navbar.component';
import { PortfolioMobileMenuComponent } from './portfolio-mobile-menu/portfolio-mobile-menu.component';
import { PortfolioFooterComponent } from './portfolio-footer/portfolio-footer.component';
import { ScrollProgressComponent } from '@shared/components/scroll-progress/scroll-progress.component';
import { SkeletonComponent } from '@shared/components/skeleton/skeleton.component';
import { WebVitalsService } from '@core/services/web-vitals.service';

@Component({
  selector: 'app-portfolio-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslatePipe,
    LanguageSelectorComponent,
    ThemeToggleComponent,
    PortfolioNavbarComponent,
    PortfolioMobileMenuComponent,
    PortfolioFooterComponent,
    ScrollProgressComponent,
    SkeletonComponent,
  ],
  templateUrl: './portfolio-layout.component.html',
})
export class PortfolioLayoutComponent implements OnInit, OnDestroy {
  protected data = inject(PortfolioDataService);
  private webVitals = inject(WebVitalsService);
  // Theme service injected to ensure initialization
  protected themeService = inject(ThemeService);
  private seoService = inject(SeoService);
  private translate = inject(TranslateService);
  private analytics = inject(AnalyticsTrackingService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private platformId = inject(PLATFORM_ID);
  private routerSub?: Subscription;

  mobileMenuOpen = signal(false);
  moreMenuOpen = signal(false);
  cvMenuOpen = signal(false);

  currentYear = new Date().getFullYear();

  async ngOnInit(): Promise<void> {
    await this.data.initialize();
    this.webVitals.init();

    // Initialize analytics only in browser (not during SSR)
    if (isPlatformBrowser(this.platformId)) {
      // Capture ref/utm_source from query params via Angular router (reliable even after SSR redirects)
      const queryParams = this.route.snapshot.queryParams;
      const ref = queryParams['ref'] || queryParams['utm_source'] || null;
      await this.analytics.initSession(ref);
      await this.analytics.trackPageView(this.router.url, document?.title);

      // Setup visibility/pagehide listeners for reliable duration tracking on mobile
      this.analytics.setupPageLifecycleListeners();

      // Track subsequent route navigations
      this.routerSub = this.router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe((event) => {
          this.analytics.trackPageView(event.urlAfterRedirects, document?.title);
        });
    }

    // Update lang attribute based on current language
    this.seoService.updateLang(this.translate.currentLang());

    const profile = this.data.profile();
    if (profile) {
      const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
      const siteUrl = this.seoService.getSiteUrl();
      const locale = this.translate.currentLang() === 'es' ? 'es_ES' : 'en_US';

      this.seoService.updateMeta({
        title: fullName || undefined,
        description: `Portfolio of ${fullName}. Projects, skills, and professional experience.`,
        image: this.data.avatarUrl() || undefined,
        url: siteUrl,
        locale,
        author: fullName,
        keywords: 'portfolio, software developer, projects, skills, experience',
      });

      // Build social links for sameAs
      const sameAs: string[] = [];
      if (profile.linkedin_url) sameAs.push(profile.linkedin_url);
      if (profile.github_url) sameAs.push(profile.github_url);
      if (profile.instagram_url) sameAs.push(profile.instagram_url);

      // Set JSON-LD structured data
      this.seoService.setJsonLd([
        this.seoService.buildWebSiteSchema(fullName || 'StevSant'),
        this.seoService.buildPersonSchema({
          name: fullName,
          email: profile.email,
          url: siteUrl,
          image: this.data.avatarUrl(),
          sameAs,
        }),
      ]);
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  toggleMoreMenu(): void {
    this.cvMenuOpen.set(false);
    this.moreMenuOpen.update((v) => !v);
  }

  toggleCvMenu(): void {
    this.moreMenuOpen.set(false);
    this.cvMenuOpen.update((v) => !v);
  }

  closeAllMenus(): void {
    this.moreMenuOpen.set(false);
    this.cvMenuOpen.set(false);
    this.mobileMenuOpen.set(false);
  }

  @HostListener('window:beforeunload')
  onBeforeUnload(): void {
    this.analytics.finalizeSession();
  }

  ngOnDestroy(): void {
    this.analytics.finalizeSession();
    this.routerSub?.unsubscribe();
  }
}
