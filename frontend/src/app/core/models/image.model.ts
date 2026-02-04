import { PolymorphicEntity, SourceType } from './base.model';

/**
 * Image entity - represents images associated with projects, experiences, competitions, or events
 */
export interface Image extends PolymorphicEntity {
  url: string;
  alt_text: string | null;
  created_at: string | null; // ISO timestamp string
}

export interface ImageFormData {
  url: string;
  alt_text: string;
  source_id: number;
  source_type: SourceType;
}
