import { BaseEntity } from './base-entity.model';

/**
 * Competition entity - represents competitions/hackathons participated in
 */
export interface Competition extends BaseEntity {
  name: string;
  organizer: string | null;
  date: string | null;
  description: string | null;
  result: string | null;
}
