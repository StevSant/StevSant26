/**
 * Language entity from the database
 */
export interface Language {
  id: number;
  code: string; // 'es', 'en', 'fr'
  name: string; // 'Español', 'English', 'Français'
}
