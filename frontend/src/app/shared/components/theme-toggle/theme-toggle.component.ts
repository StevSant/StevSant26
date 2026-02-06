import { Component, inject, signal } from '@angular/core';
import { ThemeService, AVAILABLE_THEMES, ThemeId } from '@core/services/theme.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <div class="relative">
      <!-- Toggle Button -->
      <button
        type="button"
        (click)="toggleDropdown()"
        class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-(--color-bg-tertiary) transition-all text-(--color-text-secondary)"
        [attr.aria-label]="'theme.switchTheme' | translate"
      >
        <!-- Sun/Moon icon based on current theme -->
        @if (isDarkTheme()) {
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        } @else {
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        }
        <svg
          class="w-3.5 h-3.5 transition-transform"
          [class.rotate-180]="isOpen()"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <!-- Dropdown -->
      @if (isOpen()) {
        <div
          class="absolute right-0 mt-2 w-48 bg-(--color-bg-secondary) border border-(--color-border-primary) rounded-lg shadow-xl z-50 py-1 overflow-hidden"
        >
          <div class="px-3 py-2 border-b border-(--color-border-primary)">
            <p class="text-xs font-medium uppercase tracking-wider text-(--color-text-muted)">
              {{ 'theme.switchTheme' | translate }}
            </p>
          </div>
          @for (theme of themes; track theme.id) {
            <button
              type="button"
              (click)="selectTheme(theme.id)"
              class="w-full px-4 py-2.5 text-left text-sm hover:bg-(--color-bg-tertiary) transition-colors flex items-center gap-3"
              [class.text-(--color-accent)]="themeService.currentTheme() === theme.id"
              [class.text-(--color-text-primary)]="themeService.currentTheme() !== theme.id"
            >
              <span class="text-base">{{ theme.icon }}</span>
              <span class="flex-1">{{ theme.nameKey | translate }}</span>
              @if (themeService.currentTheme() === theme.id) {
                <svg class="w-4 h-4 text-(--color-accent)" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
              }
            </button>
          }
        </div>
      }
    </div>

    <!-- Backdrop -->
    @if (isOpen()) {
      <div class="fixed inset-0 z-40" (click)="closeDropdown()"></div>
    }
  `,
})
export class ThemeToggleComponent {
  protected themeService = inject(ThemeService);

  isOpen = signal(false);
  themes = AVAILABLE_THEMES;

  isDarkTheme(): boolean {
    return this.themeService.currentTheme() !== 'light-elegant';
  }

  toggleDropdown(): void {
    this.isOpen.update((v) => !v);
  }

  closeDropdown(): void {
    this.isOpen.set(false);
  }

  selectTheme(themeId: ThemeId): void {
    this.themeService.setTheme(themeId);
    this.closeDropdown();
  }
}
