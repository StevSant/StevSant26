import { BaseEntity } from '../base';
import { SkillCategory, SkillCategoryTranslation } from './skill-category.model';

/**
 * Skill Translation entity
 */
export interface SkillTranslation {
  id: number;
  skill_id: number;
  language: string;
  name: string;
  description: string | null;
}

/**
 * Skill entity with optional translations and category
 */
export interface Skill extends BaseEntity {
  skill_category_id: number | null;
  skill_category?: SkillCategory;
  translations?: SkillTranslation[];
}
