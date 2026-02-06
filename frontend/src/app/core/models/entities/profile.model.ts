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
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  instagram_url: string | null;
  whatsapp: string | null;
  cv_url: string | null;
  translations?: ProfileTranslation[];
}
