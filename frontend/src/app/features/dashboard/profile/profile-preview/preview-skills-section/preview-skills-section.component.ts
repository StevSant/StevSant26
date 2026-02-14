import { Component, input } from '@angular/core';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-preview-skills-section',
  standalone: true,
  imports: [TranslatePipe, MatIcon],
  templateUrl: './preview-skills-section.component.html',
})
export class PreviewSkillsSectionComponent {
  skillCategories = input.required<any[]>();
  getEntityTranslation = input.required<(entity: any, field: string) => string>();
  getCategoryName = input.required<(category: any) => string>();
  getStarArray = input.required<(level: number) => boolean[]>();
}
