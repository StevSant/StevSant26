import { BaseEntity } from './base.model';

/**
 * Event entity - represents events/conferences attended
 */
export interface Event extends BaseEntity {
  name: string;
  description: string | null;
  assisted_at: string | null; // ISO date string
}

export interface EventFormData {
  name: string;
  description: string;
  assisted_at: string;
}
