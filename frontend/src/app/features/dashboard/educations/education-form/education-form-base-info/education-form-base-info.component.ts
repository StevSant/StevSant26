import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { EducationType } from '@core/models';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-education-form-base-info',
  standalone: true,
  imports: [FormsModule, TranslatePipe, MatIcon],
  templateUrl: './education-form-base-info.component.html',
})
export class EducationFormBaseInfoComponent {
  educationType = input<EducationType>('formal');
  institution = input<string>('');
  startDate = input<string>('');
  endDate = input<string>('');
  institutionImageUrl = input<string>('');
  credentialUrl = input<string>('');
  credentialId = input<string>('');
  educationTypeChange = output<EducationType>();
  institutionChange = output<string>();
  startDateChange = output<string>();
  endDateChange = output<string>();
  institutionImageUrlChange = output<string>();
  credentialUrlChange = output<string>();
  credentialIdChange = output<string>();

  educationTypes: EducationType[] = ['formal', 'course', 'certification'];
}
