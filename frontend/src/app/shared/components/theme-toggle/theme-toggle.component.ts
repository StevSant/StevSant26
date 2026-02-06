import { Component, inject, signal } from '@angular/core';
import { ThemeService, AVAILABLE_THEMES, ThemeId, ThemeIconType } from '@core/services/theme.service';
import { TranslatePipe } from '@shared/pipes/translate.pipe';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './theme-toggle.component.html',
})
export class ThemeToggleComponent {
  protected themeService = inject(ThemeService);

  isOpen = signal(false);
  themes = AVAILABLE_THEMES;

  currentIconType(): ThemeIconType {
    const current = this.themeService.currentTheme();
    const theme = AVAILABLE_THEMES.find(t => t.id === current);
    return theme?.iconType || 'moon';
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
