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
  first_name?: string;
  last_name?: string;
  nickname?: string;
  email?: string;
  phone?: string;
  linkedin_url?: string;
  github_url?: string;
  instagram_url?: string;
  whatsapp?: string;
  cv_url?: string;
  translations?: ProfileTranslationFormData[];
}
