import { PolymorphicEntity, SourceType } from '../base';

/**
 * Skill Usage Translation entity
 */
export interface SkillUsageTranslation {
  id: number;
  skill_usage_id: number;
  language: string;
  notes: string | null;
}

/**
 * SkillUsage entity with optional translations
 */
export interface SkillUsage extends PolymorphicEntity {
  skill_id: number;
  source_id: number;
  source_type: SourceType;
  translations?: SkillUsageTranslation[];
}
