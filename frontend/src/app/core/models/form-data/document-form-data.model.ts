import { SourceType } from '../base';

export interface DocumentFormData {
  url: string;
  file_name: string;
  file_type: string;
  file_size: number;
  label: string;
  source_id: number;
  source_type: SourceType;
  is_archived: boolean;
  is_pinned: boolean;
  position: number | null;
}
