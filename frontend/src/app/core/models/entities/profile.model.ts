/**
 * Profile Translation entity
 */
export interface ProfileTranslation {
  id: number;
  profile_id: number;
  language: string;
  bio: string | null;
  headline: string | null;
}

/**
 * Profile entity with optional translations
 */
export interface Profile {
  id: number;
  email: string | null;
  avatar_url: string | null;
  cv_url: string | null;
  website_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  twitter_url: string | null;
  youtube_url: string | null;
  translations?: ProfileTranslation[];
}
