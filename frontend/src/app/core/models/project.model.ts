import { PolymorphicEntity, SourceType } from './base.model';

/**
 * Project entity - represents portfolio projects (polymorphic, can be linked to experience, competition, or event)
 */
export interface Project extends PolymorphicEntity {
  title: string;
  description: string | null;
  url: string | null;
  created_at: string | null; // ISO date string
  parent_project_id: number | null;
  // Joined data
  parent_project?: Project;
}

export interface ProjectFormData {
  title: string;
  description: string;
  url: string;
  created_at: string;
  parent_project_id: number | null;
  source_id: number | null;
  source_type: SourceType | null;
}
