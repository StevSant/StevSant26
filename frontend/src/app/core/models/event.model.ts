import { BaseEntity } from './base-entity.model';

/**
 * Event entity - represents events/conferences attended
 */
export interface Event extends BaseEntity {
  name: string;
  description: string | null;
  assisted_at: string | null;
}
