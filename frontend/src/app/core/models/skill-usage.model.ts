import { PolymorphicEntity } from './polymorphic-entity.model';
import { Skill } from './skill.model';

/**
 * Skill usage translation for i18n support
 */
export interface SkillUsageTranslation {
  id: number;
  skill_usages_id: number;
  language: string;
  notes: string | null;
}

/**
 * Skill usage entity - represents a skill used in a project, experience, competition, or event
 */
export interface SkillUsage extends PolymorphicEntity {
  skill_id: number;
  level: number | null;
  started_at: string | null;
  ended_at: string | null;
  skill?: Skill;
  // Translations (joined from skill_usages_translation)
  translations?: SkillUsageTranslation[];
  // Convenience field for current language
  notes?: string | null;
}
