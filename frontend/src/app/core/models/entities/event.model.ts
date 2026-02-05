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
  assisted_at: string | null;
  translations?: EventTranslation[];
}
