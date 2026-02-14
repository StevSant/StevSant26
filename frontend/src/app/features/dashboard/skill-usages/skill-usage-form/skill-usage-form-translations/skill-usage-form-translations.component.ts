import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';
import { LanguageTabsComponent } from '@shared/components/language-tabs/language-tabs.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-skill-usage-form-translations',
  standalone: true,
  imports: [FormsModule, UpperCasePipe, LanguageTabsComponent, MatIcon],
  templateUrl: './skill-usage-form-translations.component.html',
})
export class SkillUsageFormTranslationsComponent {
  currentEditLanguage = input.required<string>();
  currentTranslation = input.required<{ notes: string }>();
  languageChange = output<string>();
  notesChange = output<string>();
}
