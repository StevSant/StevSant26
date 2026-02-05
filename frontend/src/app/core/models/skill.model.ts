import { BaseEntity } from './base-entity.model';
import { SkillCategory } from './skill-category.model';

/**
 * Skill translation for i18n support
 */
export interface SkillTranslation {
  id: number;
  skill_id: number;
  language: string;
  name: string;
  description: string | null;
}

/**
 * Skill entity - represents a specific skill/technology
 */
export interface Skill extends BaseEntity {
  skill_category_id: number | null;
  skill_category?: SkillCategory;
  // Translations (joined from skill_translation)
  translations?: SkillTranslation[];
  // Convenience fields for current language
  name?: string;
  description?: string | null;
}
