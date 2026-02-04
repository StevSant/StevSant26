import { SourceType } from './source-type.model';

/**
 * Form data interface for creating/updating projects
 */
export interface ProjectFormData {
  title: string;
  description: string;
  url: string;
  created_at: string;
  parent_project_id: number | null;
  source_id: number | null;
  source_type: SourceType | null;
}
