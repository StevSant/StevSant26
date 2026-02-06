import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UpperCasePipe } from '@angular/common';
import { Language } from '@core/models';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-profile-translations-card',
  standalone: true,
  imports: [FormsModule, UpperCasePipe, TranslatePipe],
  templateUrl: './profile-translations-card.component.html',
})
export class ProfileTranslationsCardComponent {
  /** Available languages */
  supportedLanguages = input.required<Language[]>();

  /** Currently selected language code */
  currentEditLanguage = input.required<string>();

  /** Current translation being edited */
  currentTranslation = input.required<{ about: string }>();

  /** Emitted when user switches language tab */
  editLanguageChange = output<string>();

  /** Emitted when translation field changes */
  translationChange = output<{ field: 'about'; value: string }>();

  setEditLanguage(langCode: string): void {
    this.editLanguageChange.emit(langCode);
  }

  onTranslationChange(field: 'about', value: string): void {
    this.translationChange.emit({ field, value });
  }
}
