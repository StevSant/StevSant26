import { PolymorphicEntity } from './polymorphic-entity.model';

/**
 * Image entity - represents images associated with projects, experiences, competitions, or events
 */
export interface Image extends PolymorphicEntity {
  url: string;
  alt_text: string | null;
  created_at: string | null;
}
