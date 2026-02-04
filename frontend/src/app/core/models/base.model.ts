/**
 * Base interface for entities with common fields for ordering, archiving and pinning
 */
export interface BaseEntity {
  id: number;
  is_archived: boolean;
  is_pinned: boolean;
  position: number | null;
}

/**
 * Polymorphic source types used across project, image, and skill_usages tables
 */
export type SourceType = 'project' | 'experience' | 'competition' | 'event';

/**
 * Base interface for polymorphic entities
 */
export interface PolymorphicEntity extends BaseEntity {
  source_id: number | null;
  source_type: SourceType | null;
}
