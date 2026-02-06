import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-form-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './form-header.component.html',
})
export class FormHeaderComponent {
  backRoute = input.required<string>();
  title = input.required<string>();
}
