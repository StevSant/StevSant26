/**
 * Translation form data for competition
 */
export interface CompetitionTranslationFormData {
  language: string;
  name: string;
  description: string;
  result: string;
}

/**
 * Form data interface for creating/updating competitions
 */
export interface CompetitionFormData {
  organizer: string;
  date: string;
  // Translations for each supported language
  translations: CompetitionTranslationFormData[];
}
