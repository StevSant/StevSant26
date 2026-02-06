import { Component, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { PortfolioDataService } from '../services/portfolio-data.service';

@Component({
  selector: 'app-portfolio-mobile-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './portfolio-mobile-menu.component.html',
})
export class PortfolioMobileMenuComponent {
  protected data = inject(PortfolioDataService);

  closeMobileMenu = output<void>();
}
