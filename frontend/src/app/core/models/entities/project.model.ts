import { Language, PolymorphicEntity } from '../base';

/**
 * Project Translation entity
 */
export interface ProjectTranslation {
  id: number;
  project_id: number;
  language_id: number;
  title: string;
  description: string | null;
  language?: Language;
}

/**
 * Project entity with optional translations
 */
export interface Project extends PolymorphicEntity {
  url: string | null;
  created_at: string | null;
  parent_project_id: number | null;
  translations?: ProjectTranslation[];
}
