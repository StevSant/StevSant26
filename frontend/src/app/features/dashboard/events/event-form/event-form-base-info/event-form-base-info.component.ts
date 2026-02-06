import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-event-form-base-info',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './event-form-base-info.component.html',
})
export class EventFormBaseInfoComponent {
  assistedAt = input<string>('');
  assistedAtChange = output<string>();
}
