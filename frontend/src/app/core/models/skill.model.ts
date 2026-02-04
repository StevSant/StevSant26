import { BaseEntity } from './base.model';
import { SkillCategory } from './skill-category.model';

/**
 * Skill entity - represents a specific skill/technology
 */
export interface Skill extends BaseEntity {
  name: string;
  description: string | null;
  skill_category_id: number | null;
  // Joined data
  skill_category?: SkillCategory;
}

export interface SkillFormData {
  name: string;
  description: string;
  skill_category_id: number | null;
}
