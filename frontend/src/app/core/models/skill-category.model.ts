import { BaseEntity } from './base.model';

/**
 * Skill category entity - groups related skills together
 */
export interface SkillCategory extends BaseEntity {
  name: string;
  approach: string | null;
}

export interface SkillCategoryFormData {
  name: string;
  approach: string;
}
