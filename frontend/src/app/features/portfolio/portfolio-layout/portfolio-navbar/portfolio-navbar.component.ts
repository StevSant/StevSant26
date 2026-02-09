import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { LanguageSelectorComponent } from '@shared/components/language-selector/language-selector.component';
import { ThemeToggleComponent } from '@shared/components/theme-toggle/theme-toggle.component';
import { PortfolioDataService } from '../../services/portfolio-data.service';

@Component({
  selector: 'app-portfolio-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, LanguageSelectorComponent, ThemeToggleComponent],
  templateUrl: './portfolio-navbar.component.html',
})
export class PortfolioNavbarComponent {
  protected data = inject(PortfolioDataService);

  moreMenuOpen = input<boolean>(false);
  cvMenuOpen = input<boolean>(false);

  toggleMoreMenu = output<void>();
  toggleCvMenu = output<void>();
  closeAllMenus = output<void>();
}
