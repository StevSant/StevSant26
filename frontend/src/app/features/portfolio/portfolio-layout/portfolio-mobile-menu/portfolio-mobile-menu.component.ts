import { Component, output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { PortfolioDataService } from '../../services/portfolio-data.service';
import { AnalyticsTrackingService } from '@core/services/analytics-tracking.service';
import { Document } from '@core/models';
import { downloadFile } from '@shared/utils/download-file.util';

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

  downloading = signal(false);

  async downloadCv(cv: Document): Promise<void> {
    if (this.downloading()) return;
    this.downloading.set(true);
    this.analytics.trackCvDownload({
      documentId: cv.id,
      fileName: cv.label || cv.file_name || 'CV',
      language: cv.language?.name || undefined,
    });
    try {
      await downloadFile(cv.url, cv.file_name || 'CV.pdf');
    } finally {
      this.downloading.set(false);
    }
  }
}
