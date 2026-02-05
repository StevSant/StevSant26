import { Component, input, output, inject } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-language-tabs',
  standalone: true,
  template: `
    <div class="flex gap-2 border-b border-(--color-border-secondary) mb-4">
      @for (lang of languages(); track lang.code) {
        <button
          type="button"
          (click)="selectLanguage(lang.code)"
          class="px-4 py-2 text-sm font-medium transition-colors"
          [class.text-(--color-accent)]="selectedLanguage() === lang.code"
          [class.border-b-2]="selectedLanguage() === lang.code"
          [class.border-(--color-accent)]="selectedLanguage() === lang.code"
          [class.text-(--color-text-muted)]="selectedLanguage() !== lang.code"
        >
          {{ lang.name }}
        </button>
      }
    </div>
  `,
})
export class LanguageTabsComponent {
  private languageService = inject(LanguageService);

  selectedLanguage = input<string>('es');
  languageChange = output<string>();

  languages = this.languageService.supportedLanguages;

  selectLanguage(code: string): void {
    this.languageChange.emit(code);
  }
}
