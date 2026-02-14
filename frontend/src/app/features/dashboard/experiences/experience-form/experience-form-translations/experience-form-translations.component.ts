import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { LanguageTabsComponent } from '@shared/components/language-tabs/language-tabs.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-experience-form-translations',
  standalone: true,
  imports: [FormsModule, UpperCasePipe, TranslatePipe, LanguageTabsComponent, MatIcon],
  templateUrl: './experience-form-translations.component.html',
})
export class ExperienceFormTranslationsComponent {
  currentEditLanguage = input.required<string>();
  currentTranslation = input.required<{ role: string; description: string }>();
  languageChange = output<string>();
  translationChange = output<{ field: 'role' | 'description'; value: string }>();

  onFieldChange(field: 'role' | 'description', value: string): void {
    this.translationChange.emit({ field, value });
  }
}
