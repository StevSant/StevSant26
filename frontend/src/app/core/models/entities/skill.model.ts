import { BaseEntity, Language } from '../base';
import { SkillCategory, SkillCategoryTranslation } from './skill-category.model';

/**
 * Skill Translation entity
 */
export interface SkillTranslation {
  id: number;
  skill_id: number;
  language_id: number;
  name: string;
  description: string | null;
  language?: Language;
}

/**
 * Skill entity with optional translations and category
 */
export interface Skill extends BaseEntity {
  skill_category_id: number | null;
  icon_url?: string | null;
  skill_category?: SkillCategory;
  translations?: SkillTranslation[];
}
