import { BaseEntity } from './base-entity.model';
import { SkillCategory } from './skill-category.model';

/**
 * Skill entity - represents a specific skill/technology
 */
export interface Skill extends BaseEntity {
  name: string;
  description: string | null;
  skill_category_id: number | null;
  skill_category?: SkillCategory;
}
