/**
 * Profile Translation form data
 */
export interface ProfileTranslationFormData {
  language: string;
  bio: string;
  headline: string;
}

/**
 * Profile form data for create/update operations
 */
export interface ProfileFormData {
  email: string;
  avatar_url: string;
  cv_url: string;
  website_url: string;
  linkedin_url: string;
  github_url: string;
  twitter_url: string;
  youtube_url: string;
  translations: ProfileTranslationFormData[];
}
