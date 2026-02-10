import { Language } from './language.model';
import { DEFAULT_LANGUAGE_CODE } from './default-language.const';

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
