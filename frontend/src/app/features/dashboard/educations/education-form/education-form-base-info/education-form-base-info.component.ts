import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-education-form-base-info',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './education-form-base-info.component.html',
})
export class EducationFormBaseInfoComponent {
  institution = input<string>('');
  startDate = input<string>('');
  endDate = input<string>('');
  institutionImageUrl = input<string>('');
  institutionChange = output<string>();
  startDateChange = output<string>();
  endDateChange = output<string>();
  institutionImageUrlChange = output<string>();
}
