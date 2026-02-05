import { BaseEntity, Language } from '../base';

/**
 * Competition Translation entity
 */
export interface CompetitionTranslation {
  id: number;
  competitions_id: number;
  language_id: number;
  name: string;
  description: string | null;
  result: string | null;
  language?: Language;
}

/**
 * Competition entity with optional translations
 */
export interface Competition extends BaseEntity {
  organizer: string | null;
  date: string | null;
  translations?: CompetitionTranslation[];
}
