import { BaseEntity } from './base-entity.model';

/**
 * Competition translation for i18n support
 */
export interface CompetitionTranslation {
  id: number;
  competitions_id: number;
  language: string;
  name: string;
  description: string | null;
  result: string | null;
}

/**
 * Competition entity - represents competitions/hackathons participated in
 */
export interface Competition extends BaseEntity {
  organizer: string | null;
  date: string | null;
  // Translations (joined from competitions_translation)
  translations?: CompetitionTranslation[];
  // Convenience fields for current language
  name?: string;
  description?: string | null;
  result?: string | null;
}
