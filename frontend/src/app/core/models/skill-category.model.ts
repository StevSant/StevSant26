import { BaseEntity } from './base-entity.model';

/**
 * Skill category entity - groups related skills together
 */
export interface SkillCategory extends BaseEntity {
  name: string;
  approach: string | null;
}
