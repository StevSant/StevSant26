/**
 * Translation form data for event
 */
export interface EventTranslationFormData {
  language: string;
  name: string;
  description: string;
}

/**
 * Form data interface for creating/updating events
 */
export interface EventFormData {
  assisted_at: string;
  // Translations for each supported language
  translations: EventTranslationFormData[];
}
