import { BaseEntity, Language } from '../base';

/**
 * Education Translation entity
 */
export interface EducationTranslation {
  id: number;
  education_id: number;
  language_id: number;
  degree: string;
  field_of_study: string | null;
  description: string | null;
  language?: Language;
}

/**
 * Education entity with optional translations
 */
export interface Education extends BaseEntity {
  institution: string;
  institution_image_url?: string | null;
  start_date: string | null;
  end_date: string | null;
  translations?: EducationTranslation[];
}
