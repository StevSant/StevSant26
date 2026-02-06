import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Project } from '@core/models';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-project-item',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule, TranslatePipe],
  templateUrl: './project-item.component.html',
})
export class ProjectItemComponent {
  item = input.required<Project>();
  imageUrl = input<string | undefined>();
  title = input.required<string>();
  description = input<string | null>(null);
  showDragHandle = input(true);

  pinToggled = output<void>();
  archiveToggled = output<void>();
  deleteClicked = output<void>();
}
