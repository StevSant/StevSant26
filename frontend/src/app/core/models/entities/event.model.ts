import { BaseEntity } from '../base';

/**
 * Event Translation entity
 */
export interface EventTranslation {
  id: number;
  event_id: number;
  language: string;
  name: string;
  description: string | null;
}

/**
 * Event entity with optional translations
 */
export interface Event extends BaseEntity {
  date: string | null;
  location: string | null;
  url: string | null;
  translations?: EventTranslation[];
}
