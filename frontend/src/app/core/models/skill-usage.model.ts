import { PolymorphicEntity, SourceType } from './base.model';
import { Skill } from './skill.model';

/**
 * Skill usage entity - represents a skill used in a project, experience, competition, or event
 */
export interface SkillUsage extends PolymorphicEntity {
  skill_id: number;
  level: number | null; // 1-5 proficiency level
  description: string | null;
  started_at: string | null; // ISO date string
  ended_at: string | null; // ISO date string
  // Joined data
  skill?: Skill;
}

export interface SkillUsageFormData {
  skill_id: number;
  source_id: number;
  source_type: SourceType;
  level: number | null;
  description: string;
  started_at: string;
  ended_at: string;
}
