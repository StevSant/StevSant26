import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SkillCategory } from '@core/models';

@Component({
  selector: 'app-skill-category-item',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule],
  templateUrl: './skill-category-item.component.html',
})
export class SkillCategoryItemComponent {
  item = input.required<SkillCategory>();
  name = input.required<string>();
  approach = input<string | null>(null);
  showDragHandle = input(true);

  pinToggled = output<void>();
  archiveToggled = output<void>();
  deleteClicked = output<void>();
}
