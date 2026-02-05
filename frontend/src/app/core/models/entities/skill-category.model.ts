import { BaseEntity } from '../base';

/**
 * Skill Category Translation entity
 */
export interface SkillCategoryTranslation {
  id: number;
  skill_category_id: number;
  language: string;
  name: string;
  approach: string | null;
}

/**
 * SkillCategory entity with optional translations
 */
export interface SkillCategory extends BaseEntity {
  translations?: SkillCategoryTranslation[];
}
