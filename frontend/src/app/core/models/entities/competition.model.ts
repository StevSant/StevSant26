import { BaseEntity } from '../base';

/**
 * Competition Translation entity
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
 * Competition entity with optional translations
 */
export interface Competition extends BaseEntity {
  organizer: string | null;
  date: string | null;
  translations?: CompetitionTranslation[];
}
