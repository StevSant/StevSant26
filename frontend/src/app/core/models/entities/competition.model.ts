import { BaseEntity } from '../base';

/**
 * Competition Translation entity
 */
export interface CompetitionTranslation {
  id: number;
  competition_id: number;
  language: string;
  name: string;
  description: string | null;
  result: string | null;
}

/**
 * Competition entity with optional translations
 */
export interface Competition extends BaseEntity {
  date: string | null;
  location: string | null;
  url: string | null;
  translations?: CompetitionTranslation[];
}
