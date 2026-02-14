import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-form-header',
  standalone: true,
  imports: [RouterModule, MatIcon],
  templateUrl: './form-header.component.html',
})
export class FormHeaderComponent {
  backRoute = input.required<string>();
  title = input.required<string>();
}
