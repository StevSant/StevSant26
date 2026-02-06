import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SkillUsage } from '@core/models';

@Component({
  selector: 'app-skill-usage-list-item',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule],
  templateUrl: './skill-usage-list-item.component.html',
})
export class SkillUsageListItemComponent {
  item = input.required<SkillUsage>();
  skillName = input.required<string>();
  showDragHandle = input(true);

  archiveToggled = output<void>();
  deleteClicked = output<void>();
}
