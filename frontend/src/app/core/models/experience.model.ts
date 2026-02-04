import { BaseEntity } from './base.model';

/**
 * Experience entity - represents work/professional experience
 */
export interface Experience extends BaseEntity {
  company: string;
  role: string;
  start_date: string | null; // ISO date string
  end_date: string | null; // ISO date string (null = current)
  description: string | null;
}

export interface ExperienceFormData {
  company: string;
  role: string;
  start_date: string;
  end_date: string;
  description: string;
}
