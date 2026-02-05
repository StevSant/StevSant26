import { SourceType } from './source-type.model';

/**
 * Translation form data for skill usage
 */
export interface SkillUsageTranslationFormData {
  language: string;
  notes: string;
}

/**
 * Form data interface for creating/updating skill usages
 */
export interface SkillUsageFormData {
  skill_id: number;
  source_id: number;
  source_type: SourceType;
  level: number | null;
  started_at: string;
  ended_at: string;
  // Translations for each supported language
  translations: SkillUsageTranslationFormData[];
}
