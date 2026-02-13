import { PolymorphicEntity } from '../base/polymorphic-entity.model';
import { Language } from '../base/language.model';

export interface DocumentTranslation {
  id: number;
  document_id: number;
  language_id: number;
  label: string | null;
  description: string | null;
  language?: Language;
}

export interface Document extends PolymorphicEntity {
  url: string;
  file_name: string | null;
  file_type: string | null;
  file_size: number | null;
  label: string | null;
  language_id: number | null;
  language?: Language;
  created_at: string | null;
  translations?: DocumentTranslation[];
}
