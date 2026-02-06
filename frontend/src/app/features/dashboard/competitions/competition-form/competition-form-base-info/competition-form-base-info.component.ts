import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-competition-form-base-info',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './competition-form-base-info.component.html',
})
export class CompetitionFormBaseInfoComponent {
  organizer = input<string>('');
  date = input<string>('');
  organizerChange = output<string>();
  dateChange = output<string>();
}
