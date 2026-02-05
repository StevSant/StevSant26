/**
 * Profile translation for i18n support
 */
export interface ProfileTranslation {
  id: number;
  profile_id: string;
  language: string;
  about: string;
}

/**
 * Profile entity - represents the portfolio owner's personal information
 */
export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  nickname: string | null;
  // Translations (joined from profile_translation)
  translations?: ProfileTranslation[];
  // Convenience field for current language
  about?: string | null;
}
