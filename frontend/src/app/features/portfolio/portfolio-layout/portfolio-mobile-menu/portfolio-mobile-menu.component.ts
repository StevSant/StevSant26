import { Component, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { PortfolioDataService } from '../../services/portfolio-data.service';
import { AnalyticsTrackingService } from '@core/services/analytics-tracking.service';
import { Document } from '@core/models';

@Component({
  selector: 'app-portfolio-mobile-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './portfolio-mobile-menu.component.html',
})
export class PortfolioMobileMenuComponent {
  protected data = inject(PortfolioDataService);
  private analytics = inject(AnalyticsTrackingService);

  closeMobileMenu = output<void>();

  onCvDownload(cv: Document): void {
    this.analytics.trackCvDownload({
      documentId: cv.id,
      fileName: cv.label || cv.file_name || 'CV',
      language: cv.language?.name || undefined,
    });
  }
}
