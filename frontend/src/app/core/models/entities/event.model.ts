import { BaseEntity, Language } from '../base';

/**
 * Event Translation entity
 */
export interface EventTranslation {
  id: number;
  event_id: number;
  language_id: number;
  name: string;
  description: string | null;
  language?: Language;
}

/**
 * Event entity with optional translations
 */
export interface Event extends BaseEntity {
  assisted_at: string | null;
  translations?: EventTranslation[];
}
