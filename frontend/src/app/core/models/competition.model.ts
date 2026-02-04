import { BaseEntity } from './base.model';

/**
 * Competition entity - represents competitions/hackathons participated in
 */
export interface Competition extends BaseEntity {
  name: string;
  organizer: string | null;
  date: string | null; // ISO date string
  description: string | null;
  result: string | null;
}

export interface CompetitionFormData {
  name: string;
  organizer: string;
  date: string;
  description: string;
  result: string;
}
