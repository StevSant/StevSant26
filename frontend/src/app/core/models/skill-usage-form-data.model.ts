import { SourceType } from './source-type.model';

/**
 * Form data interface for creating/updating skill usages
 */
export interface SkillUsageFormData {
  skill_id: number;
  source_id: number;
  source_type: SourceType;
  level: number | null;
  description: string;
  started_at: string;
  ended_at: string;
}
