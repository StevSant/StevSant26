import { Component, inject, signal } from '@angular/core';
import { TranslateService } from '../../../core/services/translate.service';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  template: `
    <div class="relative">
      <button
        type="button"
        (click)="toggleDropdown()"
        class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-(--color-bg-tertiary) transition-colors text-(--color-text-secondary)"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
          />
        </svg>
        <span class="text-sm font-medium uppercase">{{ translateService.currentLang() }}</span>
        <svg
          class="w-4 h-4 transition-transform"
          [class.rotate-180]="isOpen()"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      @if (isOpen()) {
        <div
          class="absolute right-0 mt-2 w-40 bg-(--color-bg-secondary) border border-(--color-border-primary) rounded-lg shadow-lg z-50 py-1"
        >
          @for (lang of languages; track lang.code) {
            <button
              type="button"
              (click)="selectLanguage(lang.code)"
              class="w-full px-4 py-2 text-left text-sm hover:bg-(--color-bg-tertiary) transition-colors flex items-center gap-2"
              [class.text-(--color-accent)]="translateService.currentLang() === lang.code"
              [class.text-(--color-text-primary)]="translateService.currentLang() !== lang.code"
            >
              <span class="text-lg">{{ lang.flag }}</span>
              <span>{{ lang.name }}</span>
              @if (translateService.currentLang() === lang.code) {
                <svg class="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              }
            </button>
          }
        </div>
      }
    </div>

    <!-- Backdrop to close dropdown -->
    @if (isOpen()) {
      <div class="fixed inset-0 z-40" (click)="closeDropdown()"></div>
    }
  `,
})
export class LanguageSelectorComponent {
  protected translateService = inject(TranslateService);

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
    this.closeDropdown();
  }
}
