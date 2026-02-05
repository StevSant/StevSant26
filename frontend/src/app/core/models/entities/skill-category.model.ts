import { BaseEntity, Language } from '../base';

/**
 * Skill Category Translation entity
 */
export interface SkillCategoryTranslation {
  id: number;
  skill_category_id: number;
  language_id: number;
  name: string;
  approach: string | null;
  language?: Language;
}

/**
 * SkillCategory entity with optional translations
 */
export interface SkillCategory extends BaseEntity {
  translations?: SkillCategoryTranslation[];
}
