import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Skill, SourceType } from '@core/models';

@Component({
  selector: 'app-skill-usage-form-base-info',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './skill-usage-form-base-info.component.html',
})
export class SkillUsageFormBaseInfoComponent {
  skills = input.required<Skill[]>();
  skillId = input<number>(0);
  sourceType = input<SourceType>('project');
  sourceId = input<number>(0);
  level = input<number | null>(null);
  startedAt = input<string>('');
  endedAt = input<string>('');
  getSkillName = input.required<(skill: Skill) => string>();

  skillIdChange = output<number>();
  sourceTypeChange = output<SourceType>();
  sourceIdChange = output<number>();
  levelChange = output<number | null>();
  startedAtChange = output<string>();
  endedAtChange = output<string>();

  setLevel(value: number | null): void {
    this.levelChange.emit(value);
  }
}
