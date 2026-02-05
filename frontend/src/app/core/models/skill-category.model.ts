import { BaseEntity } from './base-entity.model';

/**
 * Skill category translation for i18n support
 */
export interface SkillCategoryTranslation {
  id: number;
  skill_category_id: number;
  language: string;
  name: string;
  approach: string | null;
}

/**
 * Skill category entity - groups related skills together
 */
export interface SkillCategory extends BaseEntity {
  // Translations (joined from skill_category_translation)
  translations?: SkillCategoryTranslation[];
  // Convenience fields for current language
  name?: string;
  approach?: string | null;
}
