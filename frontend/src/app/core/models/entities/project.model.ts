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
  github_url: string | null;
  start_date: string | null;
  end_date: string | null;
  translations?: ProjectTranslation[];
}
