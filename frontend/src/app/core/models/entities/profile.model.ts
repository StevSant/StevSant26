import { Language } from '../base/language.model';

/**
 * Profile Translation entity
 */
export interface ProfileTranslation {
  id: number;
  profile_id: string;
  language_id: number;
  about: string;
  language?: Language;
}

/**
 * Profile entity with optional translations
 */
export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  nickname: string | null;
  translations?: ProfileTranslation[];
}
