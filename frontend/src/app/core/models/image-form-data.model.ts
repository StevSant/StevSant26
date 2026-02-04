import { SourceType } from './source-type.model';

/**
 * Form data interface for creating/updating images
 */
export interface ImageFormData {
  url: string;
  alt_text: string;
  source_id: number;
  source_type: SourceType;
}
