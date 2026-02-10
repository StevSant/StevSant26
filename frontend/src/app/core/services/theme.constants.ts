import { ThemeDefinition } from './theme.types';

/**
 * All themes available in the application
 */
export const AVAILABLE_THEMES: ThemeDefinition[] = [
  { id: 'dark-elegant', nameKey: 'theme.darkElegant', icon: '🌑', iconType: 'moon' },
  { id: 'light-elegant', nameKey: 'theme.lightElegant', icon: '☀️', iconType: 'sun' },
  { id: 'midnight-blue', nameKey: 'theme.midnightBlue', icon: '🌊', iconType: 'waves' },
  { id: 'warm-sepia', nameKey: 'theme.warmSepia', icon: '📜', iconType: 'book' },
];
