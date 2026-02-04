import { BaseEntity } from './base-entity.model';
import { SourceType } from './source-type.model';

/**
 * Base interface for polymorphic entities
 */
export interface PolymorphicEntity extends BaseEntity {
  source_id: number | null;
  source_type: SourceType | null;
}
