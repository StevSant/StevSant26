import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '@core/services/theme.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { LanguageSelectorComponent } from '@shared/components/language-selector/language-selector.component';
import { ThemeToggleComponent } from '@shared/components/theme-toggle/theme-toggle.component';
import { PortfolioDataService } from '../services/portfolio-data.service';
import { PortfolioNavbarComponent } from './portfolio-navbar.component';
import { PortfolioMobileMenuComponent } from './portfolio-mobile-menu.component';
import { PortfolioFooterComponent } from './portfolio-footer.component';

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
  ],
  templateUrl: './portfolio-layout.component.html',
})
export class PortfolioLayoutComponent implements OnInit {
  protected data = inject(PortfolioDataService);
  // Theme service injected to ensure initialization
  protected themeService = inject(ThemeService);

  mobileMenuOpen = signal(false);
  moreMenuOpen = signal(false);
  cvMenuOpen = signal(false);

  currentYear = new Date().getFullYear();

  async ngOnInit(): Promise<void> {
    await this.data.initialize();
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
}
