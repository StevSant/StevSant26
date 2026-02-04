import { BaseEntity } from './base-entity.model';

/**
 * Experience entity - represents work/professional experience
 */
export interface Experience extends BaseEntity {
  company: string;
  role: string;
  start_date: string | null;
  end_date: string | null;
  description: string | null;
}
