import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Language, DEFAULT_LANGUAGE_CODE, getTranslation } from '../models';
import { LoggerService } from './logger.service';
import { CrudService } from './crud.service';

const LANGUAGE_STORAGE_KEY = 'portfolio_language';

/**
 * Service to manage the current language and translations
 * Following Clean Architecture as an infrastructure adapter
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private platformId = inject(PLATFORM_ID);
  private crudService = inject(CrudService);
  private logger = inject(LoggerService);

  // Current language code signal
  currentLanguageCode = signal<string>(DEFAULT_LANGUAGE_CODE);

  // Available languages from database
  supportedLanguages = signal<Language[]>([]);

  // Loading state
  loading = signal<boolean>(true);

  readonly defaultLanguageCode = DEFAULT_LANGUAGE_CODE;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize the service - load languages and restore saved preference
   */
  private async initialize(): Promise<void> {
    // Only load from database in browser environment
    if (isPlatformBrowser(this.platformId)) {
      await this.loadLanguages();
      this.loadSavedLanguage();
    }
    this.loading.set(false);
  }

  /**
   * Load available languages from the database
   */
  async loadLanguages(): Promise<void> {
    try {
      const { data, error } = await this.crudService.getAll<Language>('language', 'id', true);
      if (error) {
        this.logger.error('Error loading languages:', error);
        return;
      }
      if (data) {
        this.supportedLanguages.set(data);
      }
    } catch (err) {
      this.logger.error('Error loading languages:', err);
    }
  }

  /**
   * Load saved language from localStorage
   */
  private loadSavedLanguage(): void {
    // First check own storage key
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved && this.isValidLanguage(saved)) {
      this.currentLanguageCode.set(saved);
      return;
    }

    // Fall back to TranslateService's storage key for synchronization
    const appLang = localStorage.getItem('app_language');
    if (appLang && (this.isValidLanguage(appLang) || ['es', 'en'].includes(appLang))) {
      this.currentLanguageCode.set(appLang);
      localStorage.setItem(LANGUAGE_STORAGE_KEY, appLang);
      return;
    }

    // Try to detect browser language
    const browserLang = navigator.language.split('-')[0];
    if (this.isValidLanguage(browserLang)) {
      this.currentLanguageCode.set(browserLang);
    }
  }

  /**
   * Check if a language code is valid (exists in supported languages)
   */
  private isValidLanguage(langCode: string): boolean {
    return this.supportedLanguages().some((l) => l.code === langCode);
  }

  /**
   * Set the current language
   */
  setLanguage(languageCode: string): void {
    // If supported languages are loaded, validate; otherwise accept 'es' and 'en' as known codes
    const isValid = this.supportedLanguages().length > 0
      ? this.isValidLanguage(languageCode)
      : ['es', 'en'].includes(languageCode);

    if (isValid) {
      this.currentLanguageCode.set(languageCode);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode);
      }
    }
  }

  /**
   * Get the current language object
   */
  getCurrentLanguage(): Language | undefined {
    return this.supportedLanguages().find((l) => l.code === this.currentLanguageCode());
  }

  /**
   * Get translation from an entity's translations array
   */
  getTranslation<T extends { language?: Language }>(translations: T[] | undefined): T | undefined {
    return getTranslation(translations, this.currentLanguageCode(), this.defaultLanguageCode);
  }

  /**
   * Get the display name of the current language
   */
  getCurrentLanguageName(): string {
    const lang = this.getCurrentLanguage();
    return lang?.name || this.currentLanguageCode();
  }
}
