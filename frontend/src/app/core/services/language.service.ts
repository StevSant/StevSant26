import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Language, DEFAULT_LANGUAGE_CODE, getTranslation } from '../models';
import { SupabaseService } from './supabase.service';

const LANGUAGE_STORAGE_KEY = 'portfolio_language';

/**
 * Service to manage the current language and translations
 * Following Clean Architecture as an infrastructure adapter
 */
@Injectable({ providedIn: 'root' })
export class LanguageService {
  private platformId = inject(PLATFORM_ID);
  private supabase = inject(SupabaseService);

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
    await this.loadLanguages();
    if (isPlatformBrowser(this.platformId)) {
      this.loadSavedLanguage();
    }
    this.loading.set(false);
  }

  /**
   * Load available languages from the database
   */
  async loadLanguages(): Promise<void> {
    try {
      const { data, error } = await this.supabase.getAll<Language>('language', 'id', true);
      if (error) {
        console.error('Error loading languages:', error);
        return;
      }
      if (data) {
        this.supportedLanguages.set(data);
      }
    } catch (err) {
      console.error('Error loading languages:', err);
    }
  }

  /**
   * Load saved language from localStorage
   */
  private loadSavedLanguage(): void {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved && this.isValidLanguage(saved)) {
      this.currentLanguageCode.set(saved);
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split('-')[0];
      if (this.isValidLanguage(browserLang)) {
        this.currentLanguageCode.set(browserLang);
      }
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
    if (this.isValidLanguage(languageCode)) {
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
