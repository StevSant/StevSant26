/**
 * Base interface for entities with common fields for ordering, archiving and pinning
 */
export interface BaseEntity {
  id: number;
  is_archived: boolean;
  is_pinned: boolean;
  position: number | null;
}
