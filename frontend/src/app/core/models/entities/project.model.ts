import { PolymorphicEntity } from '../base';

/**
 * Project Translation entity
 */
export interface ProjectTranslation {
  id: number;
  project_id: number;
  language: string;
  title: string;
  description: string | null;
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
