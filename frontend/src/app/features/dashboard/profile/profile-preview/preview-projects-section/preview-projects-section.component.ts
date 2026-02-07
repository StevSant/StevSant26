import { Component, input } from '@angular/core';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { Project } from '@core/models';

@Component({
  selector: 'app-preview-projects-section',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './preview-projects-section.component.html',
})
export class PreviewProjectsSectionComponent {
  projects = input.required<Project[]>();
  getEntityTranslation = input.required<(entity: any, field: string) => string>();
}
