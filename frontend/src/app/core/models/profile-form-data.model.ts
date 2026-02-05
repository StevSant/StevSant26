/**
 * Translation form data for profile
 */
export interface ProfileTranslationFormData {
  language: string;
  about: string;
}

/**
 * Form data interface for creating/updating profiles
 */
export interface ProfileFormData {
  first_name: string;
  last_name: string;
  nickname: string;
  // Translations for each supported language
  translations: ProfileTranslationFormData[];
}
