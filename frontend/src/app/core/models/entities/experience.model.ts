import { BaseEntity, Language } from '../base';

/**
 * Experience Translation entity
 */
export interface ExperienceTranslation {
  id: number;
  experience_id: number;
  language_id: number;
  role: string;
  description: string | null;
  language?: Language;
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
