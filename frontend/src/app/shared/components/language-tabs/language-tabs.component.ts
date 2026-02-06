import { Component, input, output, inject } from '@angular/core';
import { LanguageService } from '@core/services/language.service';

@Component({
  selector: 'app-language-tabs',
  standalone: true,
  templateUrl: './language-tabs.component.html',
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
