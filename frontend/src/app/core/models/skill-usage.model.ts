import { PolymorphicEntity } from './polymorphic-entity.model';
import { Skill } from './skill.model';

/**
 * Skill usage entity - represents a skill used in a project, experience, competition, or event
 */
export interface SkillUsage extends PolymorphicEntity {
  skill_id: number;
  level: number | null;
  description: string | null;
  started_at: string | null;
  ended_at: string | null;
  skill?: Skill;
}
