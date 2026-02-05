import { BaseEntity } from './base-entity.model';

/**
 * Event translation for i18n support
 */
export interface EventTranslation {
  id: number;
  event_id: number;
  language: string;
  name: string;
  description: string | null;
}

/**
 * Event entity - represents events/conferences attended
 */
export interface Event extends BaseEntity {
  assisted_at: string | null;
  // Translations (joined from event_translation)
  translations?: EventTranslation[];
  // Convenience fields for current language
  name?: string;
  description?: string | null;
}
