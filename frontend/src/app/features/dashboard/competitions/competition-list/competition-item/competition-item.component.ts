import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Competition } from '@core/models';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-competition-item',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule, MatIcon],
  templateUrl: './competition-item.component.html',
})
export class CompetitionItemComponent {
  item = input.required<Competition>();
  imageUrl = input<string | undefined>();
  name = input.required<string>();
  description = input<string | null>(null);
  result = input<string | null>(null);
  showDragHandle = input(true);

  pinToggled = output<void>();
  archiveToggled = output<void>();
  deleteClicked = output<void>();
}
