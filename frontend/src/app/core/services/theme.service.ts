import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type ThemeId = 'dark-elegant' | 'light-elegant' | 'midnight-blue' | 'warm-sepia';

export type ThemeIconType = 'moon' | 'sun' | 'waves' | 'book';

export interface ThemeDefinition {
  id: ThemeId;
  nameKey: string;
  icon: string;
  iconType: ThemeIconType;
}

export const AVAILABLE_THEMES: ThemeDefinition[] = [
  { id: 'dark-elegant', nameKey: 'theme.darkElegant', icon: '🌑', iconType: 'moon' },
  { id: 'light-elegant', nameKey: 'theme.lightElegant', icon: '☀️', iconType: 'sun' },
  { id: 'midnight-blue', nameKey: 'theme.midnightBlue', icon: '🌊', iconType: 'waves' },
  { id: 'warm-sepia', nameKey: 'theme.warmSepia', icon: '📜', iconType: 'book' },
];

const STORAGE_KEY = 'portfolio-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  /** Current active theme */
  readonly currentTheme = signal<ThemeId>(this.loadSavedTheme());

  /** All available themes */
  readonly themes = AVAILABLE_THEMES;

  constructor() {
    // Apply theme whenever it changes
    effect(() => {
      const theme = this.currentTheme();
      if (this.isBrowser) {
        this.applyTheme(theme);
        localStorage.setItem(STORAGE_KEY, theme);
      }
    });
  }

  /** Set a new theme */
  setTheme(themeId: ThemeId): void {
    this.currentTheme.set(themeId);
  }

  /** Cycle to the next theme */
  cycleTheme(): void {
    const themes = AVAILABLE_THEMES;
    const currentIndex = themes.findIndex((t) => t.id === this.currentTheme());
    const nextIndex = (currentIndex + 1) % themes.length;
    this.currentTheme.set(themes[nextIndex].id);
  }

  /** Quick toggle between dark and light elegant */
  toggleDarkLight(): void {
    const current = this.currentTheme();
    if (current === 'dark-elegant') {
      this.setTheme('light-elegant');
    } else {
      this.setTheme('dark-elegant');
    }
  }

  private loadSavedTheme(): ThemeId {
    if (this.isBrowser) {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeId | null;
      if (saved && AVAILABLE_THEMES.some((t) => t.id === saved)) {
        return saved;
      }
    }
    return 'dark-elegant';
  }

  private applyTheme(themeId: ThemeId): void {
    if (!this.isBrowser) return;
    const html = document.documentElement;
    // Remove all theme classes
    AVAILABLE_THEMES.forEach((t) => html.classList.remove(`theme-${t.id}`));
    // Add current theme class
    html.classList.add(`theme-${themeId}`);
  }
}
