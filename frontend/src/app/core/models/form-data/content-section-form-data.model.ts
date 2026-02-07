import { ContentSectionKey } from '../entities/content-section.model';

/**
 * Content Section Translation form data
 */
export interface ContentSectionTranslationFormData {
  language: string;
  title: string;
  body: string;
}

/**
 * Content Section form data for create/update operations
 */
export interface ContentSectionFormData {
  entity_type: string;
  entity_id: number | null;
  section_key: ContentSectionKey;
  icon: string;
  position: number | null;
  is_archived: boolean;
  is_pinned: boolean;
  translations: ContentSectionTranslationFormData[];
}
