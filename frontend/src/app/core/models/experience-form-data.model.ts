/**
 * Translation form data for experience
 */
export interface ExperienceTranslationFormData {
  language: string;
  role: string;
  description: string;
}

/**
 * Form data interface for creating/updating experiences
 */
export interface ExperienceFormData {
  company: string;
  start_date: string;
  end_date: string;
  // Translations for each supported language
  translations: ExperienceTranslationFormData[];
}
