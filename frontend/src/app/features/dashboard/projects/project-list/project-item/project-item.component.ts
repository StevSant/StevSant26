import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Project } from '@core/models';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-project-item',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule, TranslatePipe, MatIcon],
  templateUrl: './project-item.component.html',
})
export class ProjectItemComponent {
  item = input.required<Project>();
  imageUrl = input<string | undefined>();
  title = input.required<string>();
  description = input<string | null>(null);
  showDragHandle = input(true);
  parentTitle = input<string | null>(null);
  subProjectCount = input(0);
  isExpanded = input(false);
  isChild = input(false);

  pinToggled = output<void>();
  archiveToggled = output<void>();
  deleteClicked = output<void>();
  expandToggled = output<void>();
}
