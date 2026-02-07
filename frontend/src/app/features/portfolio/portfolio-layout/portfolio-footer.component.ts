import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { PortfolioDataService } from '../services/portfolio-data.service';

@Component({
  selector: 'app-portfolio-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './portfolio-footer.component.html',
})
export class PortfolioFooterComponent {
  protected data = inject(PortfolioDataService);
  profileName = input<string>('');
  currentYear = input<number>(new Date().getFullYear());

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
