import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-form-actions',
  standalone: true,
  imports: [RouterModule, TranslatePipe],
  templateUrl: './form-actions.component.html',
})
export class FormActionsComponent {
  cancelRoute = input.required<string>();
  saving = input.required<boolean>();
  isNew = input.required<boolean>();
  error = input<string | null>(null);
}
