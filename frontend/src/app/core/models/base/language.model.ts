/**
 * Language entity from the database
 */
export interface Language {
  id: number;
  code: string; // 'es', 'en', 'fr'
  name: string; // 'Español', 'English', 'Français'
}

/**
 * Language code type for convenience
 */
export type LanguageCode = string;

/**
 * Default language code for the application
 */
export const DEFAULT_LANGUAGE_CODE = 'es';

/**
 * Helper function to get translation for current language from an array of translations
 */
export function getTranslation<T extends { language?: Language }>(
  translations: T[] | undefined,
  languageCode: string,
  fallbackLanguageCode: string = DEFAULT_LANGUAGE_CODE
): T | undefined {
  if (!translations || translations.length === 0) {
    return undefined;
  }

  // Try to find translation for requested language
  const translation = translations.find((t) => t.language?.code === languageCode);
  if (translation) {
    return translation;
  }

  // Fallback to default language
  const fallback = translations.find((t) => t.language?.code === fallbackLanguageCode);
  if (fallback) {
    return fallback;
  }

  // Return first available translation
  return translations[0];
}
