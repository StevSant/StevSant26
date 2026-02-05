import { SourceType } from '../base';

/**
 * Project Translation form data
 */
export interface ProjectTranslationFormData {
  language: string;
  title: string;
  description: string;
}

/**
 * Project form data for create/update operations
 */
export interface ProjectFormData {
  url: string;
  github_url: string;
  start_date: string;
  end_date: string;
  source_id: number | null;
  source_type: SourceType | null;
  is_archived: boolean;
  is_pinned: boolean;
  position: number | null;
  translations: ProjectTranslationFormData[];
}
