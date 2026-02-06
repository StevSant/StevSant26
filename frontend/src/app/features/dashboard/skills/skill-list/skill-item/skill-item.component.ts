import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Skill } from '@core/models';

@Component({
  selector: 'app-skill-item',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule],
  templateUrl: './skill-item.component.html',
})
export class SkillItemComponent {
  item = input.required<Skill>();
  name = input.required<string>();
  description = input<string | null>(null);
  categoryName = input<string | null>(null);
  showDragHandle = input(true);

  pinToggled = output<void>();
  archiveToggled = output<void>();
  deleteClicked = output<void>();
}
