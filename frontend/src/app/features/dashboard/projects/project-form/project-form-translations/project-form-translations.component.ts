import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { LanguageTabsComponent } from '@shared/components/language-tabs/language-tabs.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-project-form-translations',
  standalone: true,
  imports: [FormsModule, UpperCasePipe, TranslatePipe, LanguageTabsComponent, MatIcon],
  templateUrl: './project-form-translations.component.html',
})
export class ProjectFormTranslationsComponent {
  currentEditLanguage = input.required<string>();
  currentTranslation = input.required<{ title: string; description: string }>();

  languageChange = output<string>();
  translationChange = output<{ field: 'title' | 'description'; value: string }>();

  onLanguageChange(lang: string): void {
    this.languageChange.emit(lang);
  }

  onFieldChange(field: 'title' | 'description', value: string): void {
    this.translationChange.emit({ field, value });
  }
}
