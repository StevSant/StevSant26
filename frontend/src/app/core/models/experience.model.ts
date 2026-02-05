import { BaseEntity } from './base-entity.model';

/**
 * Experience translation for i18n support
 */
export interface ExperienceTranslation {
  id: number;
  experience_id: number;
  language: string;
  role: string;
  description: string | null;
}

/**
 * Experience entity - represents work/professional experience
 */
export interface Experience extends BaseEntity {
  company: string;
  start_date: string | null;
  end_date: string | null;
  // Translations (joined from experience_translation)
  translations?: ExperienceTranslation[];
  // Convenience fields for current language
  role?: string;
  description?: string | null;
}
