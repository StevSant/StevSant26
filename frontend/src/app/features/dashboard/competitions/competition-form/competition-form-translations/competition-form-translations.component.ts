import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';
import { TranslatePipe } from '@shared/pipes/translate.pipe';
import { LanguageTabsComponent } from '@shared/components/language-tabs/language-tabs.component';

@Component({
  selector: 'app-competition-form-translations',
  standalone: true,
  imports: [FormsModule, UpperCasePipe, TranslatePipe, LanguageTabsComponent],
  templateUrl: './competition-form-translations.component.html',
})
export class CompetitionFormTranslationsComponent {
  currentEditLanguage = input.required<string>();
  currentTranslation = input.required<{ name: string; description: string; result: string }>();
  languageChange = output<string>();
  translationChange = output<{ field: 'name' | 'description' | 'result'; value: string }>();

  onFieldChange(field: 'name' | 'description' | 'result', value: string): void {
    this.translationChange.emit({ field, value });
  }
}
