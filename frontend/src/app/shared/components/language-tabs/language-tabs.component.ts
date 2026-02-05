import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { Language } from '../../../core/models';

@Component({
  selector: 'app-language-tabs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex gap-2 border-b border-[var(--color-border-secondary)] mb-4">
      @for (lang of languages; track lang.code) {
        <button
          type="button"
          (click)="selectLanguage(lang.code)"
          class="px-4 py-2 text-sm font-medium transition-colors"
          [class.text-[var(--color-accent)]]="selectedLanguage === lang.code"
          [class.border-b-2]="selectedLanguage === lang.code"
          [class.border-[var(--color-accent)]]="selectedLanguage === lang.code"
          [class.text-[var(--color-text-muted)]]="selectedLanguage !== lang.code"
        >
          {{ lang.name }}
        </button>
      }
    </div>
  `,
})
export class LanguageTabsComponent {
  private languageService = inject(LanguageService);

  @Input() selectedLanguage: string = 'es';
  @Output() languageChange = new EventEmitter<string>();

  get languages(): Language[] {
    return this.languageService.supportedLanguages();
  }

  selectLanguage(code: string): void {
    this.languageChange.emit(code);
  }
}
