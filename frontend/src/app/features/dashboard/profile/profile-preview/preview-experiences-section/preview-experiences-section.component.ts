import { Component, input } from '@angular/core';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { Experience } from '@core/models';

@Component({
  selector: 'app-preview-experiences-section',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './preview-experiences-section.component.html',
})
export class PreviewExperiencesSectionComponent {
  experiences = input.required<Experience[]>();
  getEntityTranslation = input.required<(entity: any, field: string) => string>();
  formatDateRange = input.required<(start: string | null, end: string | null) => string>();
}
