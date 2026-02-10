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
 * Predefined section keys for structured content.
 * Accepts any string to support custom/project-specific keys from the database.
 */
export type ContentSectionKey =
  | 'problem'
  | 'mistakes'
  | 'technical_decisions'
  | 'tradeoffs'
  | 'impact'
  | 'lessons_learned'
  | 'architecture'
  | 'challenges'
  | 'results'
  | 'methodology'
  | 'custom'
  | 'overview'
  | 'tech_stack'
  | 'features'
  | 'testing'
  | 'api'
  | 'deployment'
  | 'infrastructure'
  | 'workflow'
  | 'how_it_works'
  | 'motivation'
  | 'ui_ux'
  | 'i18n'
  | (string & {});

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
