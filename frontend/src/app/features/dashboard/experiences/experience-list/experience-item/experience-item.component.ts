import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Experience } from '@core/models';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-experience-item',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule, TranslatePipe],
  templateUrl: './experience-item.component.html',
})
export class ExperienceItemComponent {
  item = input.required<Experience>();
  imageUrl = input<string | undefined>();
  role = input.required<string>();
  showDragHandle = input(true);

  pinToggled = output<void>();
  archiveToggled = output<void>();
  deleteClicked = output<void>();
}
