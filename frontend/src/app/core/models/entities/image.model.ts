import { PolymorphicEntity } from '../base';

/**
 * Image entity for polymorphic image uploads
 */
export interface Image extends PolymorphicEntity {
  url: string;
  alt_text: string | null;
}
