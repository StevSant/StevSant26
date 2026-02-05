/**
 * Translation form data for skill
 */
export interface SkillTranslationFormData {
  language: string;
  name: string;
  description: string;
}

/**
 * Form data interface for creating/updating skills
 */
export interface SkillFormData {
  skill_category_id: number | null;
  // Translations for each supported language
  translations: SkillTranslationFormData[];
}
