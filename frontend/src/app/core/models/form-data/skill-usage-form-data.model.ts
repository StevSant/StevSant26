import { SourceType } from '../base';

/**
 * SkillUsage Translation form data
 */
export interface SkillUsageTranslationFormData {
  language: string;
  notes: string;
}

/**
 * SkillUsage form data for create/update operations
 */
export interface SkillUsageFormData {
  skill_id: number;
  source_id: number;
  source_type: SourceType;
  is_archived: boolean;
  is_pinned: boolean;
  position: number | null;
  translations: SkillUsageTranslationFormData[];
}
