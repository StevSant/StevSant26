/**
 * Experience Translation form data
 */
export interface ExperienceTranslationFormData {
  language: string;
  role: string;
  description: string;
}

/**
 * Experience form data for create/update operations
 */
export interface ExperienceFormData {
  company: string;
  start_date: string;
  end_date: string;
  is_archived: boolean;
  is_pinned: boolean;
  position: number | null;
  translations: ExperienceTranslationFormData[];
}
