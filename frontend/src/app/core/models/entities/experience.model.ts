import { BaseEntity } from '../base';

/**
 * Experience Translation entity
 */
export interface ExperienceTranslation {
  id: number;
  experience_id: number;
  language: string;
  role: string;
  description: string | null;
}

/**
 * Experience entity with optional translations
 */
export interface Experience extends BaseEntity {
  company: string;
  start_date: string | null;
  end_date: string | null;
  translations?: ExperienceTranslation[];
}
