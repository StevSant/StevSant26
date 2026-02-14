import { Component, inject, signal } from '@angular/core';
import { TranslateService } from '@core/services/translate.service';
import { LanguageService } from '@core/services/language.service';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [MatIcon],
  templateUrl: './language-selector.component.html',
})
export class LanguageSelectorComponent {
  protected translateService = inject(TranslateService);
  private languageService = inject(LanguageService);

  isOpen = signal(false);

  languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
  ];

  toggleDropdown(): void {
    this.isOpen.update((v) => !v);
  }

  closeDropdown(): void {
    this.isOpen.set(false);
  }

  selectLanguage(code: string): void {
    this.translateService.setLanguage(code);
    this.languageService.setLanguage(code);
    this.closeDropdown();
  }
}
