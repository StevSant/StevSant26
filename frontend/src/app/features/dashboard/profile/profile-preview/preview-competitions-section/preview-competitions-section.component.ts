import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { Competition } from '@core/models';

@Component({
  selector: 'app-preview-competitions-section',
  standalone: true,
  imports: [DatePipe, TranslatePipe],
  templateUrl: './preview-competitions-section.component.html',
})
export class PreviewCompetitionsSectionComponent {
  competitions = input.required<Competition[]>();
  getEntityTranslation = input.required<(entity: any, field: string) => string>();
}
