/**
 * Competition Translation form data
 */
export interface CompetitionTranslationFormData {
  language: string;
  name: string;
  description: string;
  result: string;
}

/**
 * Competition form data for create/update operations
 */
export interface CompetitionFormData {
  date: string;
  location: string;
  url: string;
  is_archived: boolean;
  is_pinned: boolean;
  position: number | null;
  translations: CompetitionTranslationFormData[];
}
