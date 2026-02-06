import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-project-form-base-info',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './project-form-base-info.component.html',
})
export class ProjectFormBaseInfoComponent {
  url = input<string>('');
  createdAt = input<string>('');

  urlChange = output<string>();
  createdAtChange = output<string>();
}
