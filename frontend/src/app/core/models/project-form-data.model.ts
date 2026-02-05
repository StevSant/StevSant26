import { SourceType } from './source-type.model';

/**
 * Translation form data for project
 */
export interface ProjectTranslationFormData {
  language: string;
  title: string;
  description: string;
}

/**
 * Form data interface for creating/updating projects
 */
export interface ProjectFormData {
  url: string;
  created_at: string;
  parent_project_id: number | null;
  source_id: number | null;
  source_type: SourceType | null;
  // Translations for each supported language
  translations: ProjectTranslationFormData[];
}
