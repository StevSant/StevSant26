import { PolymorphicEntity } from './polymorphic-entity.model';

/**
 * Project entity - represents portfolio projects (polymorphic, can be linked to experience, competition, or event)
 */
export interface Project extends PolymorphicEntity {
  title: string;
  description: string | null;
  url: string | null;
  created_at: string | null;
  parent_project_id: number | null;
  parent_project?: Project;
}
