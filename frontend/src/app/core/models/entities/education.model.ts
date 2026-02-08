import { BaseEntity, Language } from '../base';

/**
 * Education type discriminator
 * - 'formal': University, college, high school
 * - 'course': Online courses, bootcamps, workshops
 * - 'certification': Professional certifications
 */
export type EducationType = 'formal' | 'course' | 'certification';

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
  education_type: EducationType;
  institution: string;
  institution_image_url?: string | null;
  start_date: string | null;
  end_date: string | null;
  credential_url?: string | null;
  credential_id?: string | null;
  translations?: EducationTranslation[];
}
