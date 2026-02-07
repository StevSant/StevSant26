import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-experience-form-base-info',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './experience-form-base-info.component.html',
})
export class ExperienceFormBaseInfoComponent {
  company = input<string>('');
  startDate = input<string>('');
  endDate = input<string>('');
  companyImageUrl = input<string>('');
  companyChange = output<string>();
  startDateChange = output<string>();
  endDateChange = output<string>();
  companyImageUrlChange = output<string>();
}
