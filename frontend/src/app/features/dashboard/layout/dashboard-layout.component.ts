import { Component, signal, inject, computed } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { TranslateService } from '@core/services/translate.service';
import { NavItem } from './nav-item.interface';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { SafeHtmlPipe } from '@shared/pipes/safe-html.pipe';
import { LanguageSelectorComponent } from '@shared/components/language-selector/language-selector.component';
import { ThemeToggleComponent } from '@shared/components/theme-toggle/theme-toggle.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterModule, TranslatePipe, SafeHtmlPipe, LanguageSelectorComponent, ThemeToggleComponent],
  templateUrl: './dashboard-layout.component.html',
})
export class DashboardLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private translate = inject(TranslateService);

  sidebarOpen = signal(false);

  /** In dev, portfolio lives at /portfolio; in prod, at / */
  readonly portfolioLink = environment.production ? '/' : '/portfolio';

  navItems: NavItem[] = [
    {
      path: 'profile',
      labelKey: 'nav.profile',
      icon: '<span class="material-symbols-outlined text-[20px]">person</span>',
    },
    {
      path: 'projects',
      labelKey: 'nav.projects',
      icon: '<span class="material-symbols-outlined text-[20px]">folder</span>',
    },
    {
      path: 'events',
      labelKey: 'nav.events',
      icon: '<span class="material-symbols-outlined text-[20px]">event</span>',
    },
    {
      path: 'experiences',
      labelKey: 'nav.experiences',
      icon: '<span class="material-symbols-outlined text-[20px]">work</span>',
    },
    {
      path: 'educations',
      labelKey: 'nav.educations',
      icon: '<span class="material-symbols-outlined text-[20px]">school</span>',
    },
    {
      path: 'competitions',
      labelKey: 'nav.competitions',
      icon: '<span class="material-symbols-outlined text-[20px]">emoji_events</span>',
    },
    {
      path: 'skill-categories',
      labelKey: 'nav.skillCategories',
      icon: '<span class="material-symbols-outlined text-[20px]">label</span>',
    },
    {
      path: 'skills',
      labelKey: 'nav.skills',
      icon: '<span class="material-symbols-outlined text-[20px]">lightbulb</span>',
    },
    {
      path: 'analytics',
      labelKey: 'nav.analytics',
      icon: '<span class="material-symbols-outlined text-[20px]">bar_chart</span>',
    },
  ];

  userEmail = computed(() => this.authService.user()?.email ?? '');
  userInitial = computed(() => {
    const email = this.userEmail();
    return email ? email.charAt(0).toUpperCase() : '?';
  });

  currentPageTitle = computed(() => {
    const path = this.router.url.split('/').pop() || 'profile';
    const titleKeys: Record<string, string> = {
      profile: 'nav.profile',
      projects: 'nav.projects',
      events: 'nav.events',
      experiences: 'nav.experiences',
      educations: 'nav.educations',
      competitions: 'nav.competitions',
      skills: 'nav.skills',
      'skill-categories': 'nav.skillCategories',
      analytics: 'nav.analytics',
    };
    return this.translate.instant(titleKeys[path] || 'dashboard.title');
  });

  toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  closeSidebarOnMobile(): void {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      this.sidebarOpen.set(false);
    }
  }

  async signOut(): Promise<void> {
    await this.authService.signOut();
    this.router.navigate(['/login']);
  }
}
