import { Injectable, signal, computed, inject, PLATFORM_ID, ApplicationRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { LoggerService } from './logger.service';

export type TranslationData = Record<string, unknown>;

const STORAGE_KEY = 'app_language';
const DEFAULT_LANG = 'es';
const SUPPORTED_LANGS = ['es', 'en'];

@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private appRef = inject(ApplicationRef);
  private logger = inject(LoggerService);

  private translations = signal<Map<string, TranslationData>>(new Map());
  private currentLangSignal = signal<string>(DEFAULT_LANG);
  private loadedLanguages = signal<Set<string>>(new Set());
  private loadingSignal = signal<boolean>(false);
  private translationsVersion = signal<number>(0);

  /** Current language code */
  readonly currentLang = this.currentLangSignal.asReadonly();

  /** Whether translations are loading */
  readonly loading = this.loadingSignal.asReadonly();

  /** Version counter that increments when translations change - useful for reactivity */
  readonly version = this.translationsVersion.asReadonly();

  /** Supported languages */
  readonly supportedLanguages = SUPPORTED_LANGS;

  /** Default language */
  readonly defaultLanguage = DEFAULT_LANG;

  constructor() {
    this.initializeLanguage();
  }

  private initializeLanguage(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedLang = localStorage.getItem(STORAGE_KEY);
      const browserLang = navigator.language?.split('-')[0];
      const initialLang = savedLang || (SUPPORTED_LANGS.includes(browserLang) ? browserLang : DEFAULT_LANG);
      this.setLanguage(initialLang);
    } else {
      // SSR: just set the default language without loading translations
      // Translations will be loaded on the client side
      this.currentLangSignal.set(DEFAULT_LANG);
    }
  }

  /**
   * Set the current language and load translations if needed
   */
  async setLanguage(lang: string): Promise<void> {
    if (!SUPPORTED_LANGS.includes(lang)) {
      this.logger.warn(`Language "${lang}" is not supported. Using default.`);
      lang = DEFAULT_LANG;
    }

    if (!this.loadedLanguages().has(lang)) {
      await this.loadTranslations(lang);
    }

    this.currentLangSignal.set(lang);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(STORAGE_KEY, lang);
    }
  }

  /**
   * Load translations for a specific language
   */
  private async loadTranslations(lang: string): Promise<void> {
    if (this.loadedLanguages().has(lang)) {
      return;
    }

    this.loadingSignal.set(true);

    try {
      const data = await firstValueFrom(
        this.http.get<TranslationData>(`/assets/i18n/${lang}.json`)
      );

      this.translations.update((map) => {
        const newMap = new Map(map);
        newMap.set(lang, data);
        return newMap;
      });

      this.loadedLanguages.update((set) => {
        const newSet = new Set(set);
        newSet.add(lang);
        return newSet;
      });

      // Increment version to trigger reactivity
      this.translationsVersion.update((v) => v + 1);

      // Force change detection to update all pipes
      this.appRef.tick();
    } catch (error) {
      this.logger.error(`Failed to load translations for "${lang}":`, error);
    } finally {
      this.loadingSignal.set(false);
    }
  }

  /**
   * Get a translation by key path (e.g., "common.save")
   * Supports interpolation with {{ param }} syntax
   */
  instant(key: string, params?: Record<string, string | number>): string {
    const lang = this.currentLangSignal();
    const langTranslations = this.translations().get(lang);

    if (!langTranslations) {
      return key;
    }

    const value = this.getNestedValue(langTranslations, key);

    if (typeof value !== 'string') {
      return key;
    }

    if (params) {
      return this.interpolate(value, params);
    }

    return value;
  }

  /**
   * Create a computed signal for a translation key
   * This will automatically update when language changes
   */
  get(key: string, params?: Record<string, string | number>) {
    return computed(() => this.instant(key, params));
  }

  /**
   * Get nested value from object by dot-notation path
   */
  private getNestedValue(obj: TranslationData, path: string): unknown {
    return path.split('.').reduce((current: unknown, key) => {
      if (current && typeof current === 'object' && key in current) {
        return (current as Record<string, unknown>)[key];
      }
      return undefined;
    }, obj);
  }

  /**
   * Interpolate parameters in translation string
   */
  private interpolate(str: string, params: Record<string, string | number>): string {
    return str.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
      return params[key]?.toString() ?? `{{${key}}}`;
    });
  }
}
