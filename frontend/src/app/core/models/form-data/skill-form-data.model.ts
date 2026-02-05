/**
 * Skill Translation form data
 */
export interface SkillTranslationFormData {
  language: string;
  name: string;
  description: string;
}

/**
 * Skill form data for create/update operations
 */
export interface SkillFormData {
  category_id: number | null;
  icon_url: string;
  is_archived: boolean;
  is_pinned: boolean;
  position: number | null;
  translations: SkillTranslationFormData[];
}
