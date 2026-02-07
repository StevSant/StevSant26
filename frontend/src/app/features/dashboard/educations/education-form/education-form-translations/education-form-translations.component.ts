import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { LanguageTabsComponent } from '@shared/components/language-tabs/language-tabs.component';

@Component({
  selector: 'app-education-form-translations',
  standalone: true,
  imports: [FormsModule, UpperCasePipe, TranslatePipe, LanguageTabsComponent],
  templateUrl: './education-form-translations.component.html',
})
export class EducationFormTranslationsComponent {
  currentEditLanguage = input.required<string>();
  currentTranslation = input.required<{ degree: string; field_of_study: string; description: string }>();
  languageChange = output<string>();
  translationChange = output<{ field: 'degree' | 'field_of_study' | 'description'; value: string }>();

  onFieldChange(field: 'degree' | 'field_of_study' | 'description', value: string): void {
    this.translationChange.emit({ field, value });
  }
}
