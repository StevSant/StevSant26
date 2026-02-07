import { ContentSectionKey } from '@core/models/entities/content-section.model';

/**
 * Internal representation of a content section item within the manager.
 * Uses a Map for translations keyed by language code.
 */
export interface ContentSectionItem {
  id?: number;
  section_key: ContentSectionKey;
  icon: string;
  position: number;
  translations: Map<string, { title: string; body: string }>;
  isNew?: boolean;
  isEditing?: boolean;
}
