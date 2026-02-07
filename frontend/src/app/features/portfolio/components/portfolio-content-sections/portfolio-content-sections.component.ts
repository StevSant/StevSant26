import { Component, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { PortfolioDataService } from '../../services/portfolio-data.service';
import { ContentSection, SourceType, Image } from '@core/models';

@Component({
  selector: 'app-portfolio-content-sections',
  standalone: true,
  imports: [CommonModule, TranslatePipe],
  templateUrl: './portfolio-content-sections.component.html',
})
export class PortfolioContentSectionsComponent {
  protected data = inject(PortfolioDataService);

  sourceType = input.required<SourceType>();
  sourceId = input.required<number>();

  get sections(): ContentSection[] {
    return this.data.getContentSections(this.sourceType(), this.sourceId());
  }

  getSectionImages(sectionId: number): Image[] {
    return this.data.getAllImages('content_section', sectionId);
  }
}
