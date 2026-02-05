/**
 * SkillCategory Translation form data
 */
export interface SkillCategoryTranslationFormData {
  language: string;
  name: string;
  approach: string;
}

/**
 * SkillCategory form data for create/update operations
 */
export interface SkillCategoryFormData {
  is_archived: boolean;
  is_pinned: boolean;
  position: number | null;
  translations: SkillCategoryTranslationFormData[];
}
