import { PolymorphicEntity } from './polymorphic-entity.model';

/**
 * Project translation for i18n support
 */
export interface ProjectTranslation {
  id: number;
  project_id: number;
  language: string;
  title: string;
  description: string | null;
}

/**
 * Project entity - represents portfolio projects (polymorphic, can be linked to experience, competition, or event)
 */
export interface Project extends PolymorphicEntity {
  url: string | null;
  created_at: string | null;
  parent_project_id: number | null;
  parent_project?: Project;
  // Translations (joined from project_translation)
  translations?: ProjectTranslation[];
  // Convenience fields for current language
  title?: string;
  description?: string | null;
}
