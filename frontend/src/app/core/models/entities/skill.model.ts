import { BaseEntity } from '../base';

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
 * Skill entity with optional translations
 */
export interface Skill extends BaseEntity {
  category_id: number | null;
  icon_url: string | null;
  translations?: SkillTranslation[];
}
