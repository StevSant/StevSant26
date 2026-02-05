import { Language, PolymorphicEntity, SourceType } from '../base';
import { Skill } from './skill.model';

/**
 * Skill Usage Translation entity
 */
export interface SkillUsageTranslation {
  id: number;
  skill_usages_id: number;
  language_id: number;
  notes: string | null;
  language?: Language;
}

/**
 * SkillUsage entity with optional translations
 */
export interface SkillUsage extends PolymorphicEntity {
  skill_id: number;
  level: number | null;
  started_at: string | null;
  ended_at: string | null;
  skill?: Skill;
  translations?: SkillUsageTranslation[];
}
