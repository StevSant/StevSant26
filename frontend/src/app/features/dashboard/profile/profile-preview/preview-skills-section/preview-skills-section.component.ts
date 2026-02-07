import { Component, input } from '@angular/core';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-preview-skills-section',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './preview-skills-section.component.html',
})
export class PreviewSkillsSectionComponent {
  skillCategories = input.required<any[]>();
  getEntityTranslation = input.required<(entity: any, field: string) => string>();
  getCategoryName = input.required<(category: any) => string>();
  getStarArray = input.required<(level: number) => boolean[]>();
}
