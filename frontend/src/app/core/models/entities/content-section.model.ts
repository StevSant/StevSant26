import { BaseEntity, Language } from '../base';
import { SourceType } from '../base/source-type.model';

/**
 * Content Section Translation entity
 */
export interface ContentSectionTranslation {
  id: number;
  content_section_id: number;
  language_id: number;
  title: string;
  body: string;
  language?: Language;
}

/**
 * Predefined section keys for structured content
 */
export type ContentSectionKey =
  | 'problem'
  | 'technical_decisions'
  | 'tradeoffs'
  | 'impact'
  | 'lessons_learned'
  | 'architecture'
  | 'challenges'
  | 'results'
  | 'methodology'
  | 'custom';

/**
 * Content Section entity — flexible rich content blocks
 * attached to any entity via entity_type + entity_id
 */
export interface ContentSection extends BaseEntity {
  entity_type: SourceType;
  entity_id: number;
  section_key: ContentSectionKey;
  icon: string | null;
  created_at?: string;
  updated_at?: string;
  translations?: ContentSectionTranslation[];
}
