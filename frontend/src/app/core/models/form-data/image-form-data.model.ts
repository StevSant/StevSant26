import { SourceType } from '../base';

/**
 * Image form data for create/update operations
 */
export interface ImageFormData {
  url: string;
  alt_text: string;
  source_id: number;
  source_type: SourceType;
  is_archived: boolean;
  is_pinned: boolean;
  position: number | null;
}
