import { Language } from '../base/language.model';

/**
 * CV Document entity — represents a single uploaded CV file
 */
export interface CvDocument {
  id: number;
  profile_id: string;
  url: string;
  file_name: string | null;
  label: string | null;
  language_id: number | null;
  language?: Language;
  position: number;
  created_at: string;
}
