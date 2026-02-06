import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { Project } from '@core/models';

@Component({
  selector: 'app-project-form-association',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './project-form-association.component.html',
})
export class ProjectFormAssociationComponent {
  sourceType = input<string | null>(null);
  sourceId = input<number | null>(null);
  parentProjectId = input<number | null>(null);
  parentProjects = input.required<Project[]>();
  getProjectTitle = input.required<(project: Project) => string>();

  sourceTypeChange = output<string | null>();
  sourceIdChange = output<number | null>();
  parentProjectIdChange = output<number | null>();
}
