import { Component, input, output } from '@angular/core';
import { TranslatePipe } from '../../../pipes/translate.pipe';
import { SkillUsageItem } from '../skill-usage-manager.component';

@Component({
  selector: 'app-skill-usage-item',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './skill-usage-item.component.html',
})
export class SkillUsageItemComponent {
  usage = input.required<SkillUsageItem>();
  displayName = input.required<string>();

  remove = output<SkillUsageItem>();

  getLevelStars(level: number | null): string {
    if (level === null) return '-';
    return '★'.repeat(level) + '☆'.repeat(5 - level);
  }
}
