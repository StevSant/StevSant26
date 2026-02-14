import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Education, EducationType } from '@core/models';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-education-item',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule, TranslatePipe],
  templateUrl: './education-item.component.html',
})
export class EducationItemComponent {
  item = input.required<Education>();
  imageUrl = input<string | undefined>();
  degree = input.required<string>();
  showDragHandle = input(true);

  pinToggled = output<void>();
  archiveToggled = output<void>();
  deleteClicked = output<void>();

  getTypeIcon(type: EducationType): string {
    switch (type) {
      case 'formal': return 'school';
      case 'course': return 'menu_book';
      case 'certification': return 'verified';
    }
  }
}
