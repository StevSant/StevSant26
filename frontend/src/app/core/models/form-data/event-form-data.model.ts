/**
 * Event Translation form data
 */
export interface EventTranslationFormData {
  language: string;
  name: string;
  description: string;
}

/**
 * Event form data for create/update operations
 */
export interface EventFormData {
  date: string;
  location: string;
  url: string;
  is_archived: boolean;
  is_pinned: boolean;
  position: number | null;
  translations: EventTranslationFormData[];
}
