/**
 * Translation form data for skill category
 */
export interface SkillCategoryTranslationFormData {
  language: string;
  name: string;
  approach: string;
}

/**
 * Form data interface for creating/updating skill categories
 */
export interface SkillCategoryFormData {
  // Translations for each supported language
  translations: SkillCategoryTranslationFormData[];
}
