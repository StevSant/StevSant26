/**
 * Available theme identifiers
 */
export type ThemeId = 'dark-elegant' | 'light-elegant' | 'midnight-blue' | 'warm-sepia';

/**
 * Icon type categories for themes
 */
export type ThemeIconType = 'moon' | 'sun' | 'waves' | 'book';

/**
 * Definition structure for a theme option
 */
export interface ThemeDefinition {
  id: ThemeId;
  nameKey: string;
  icon: string;
  iconType: ThemeIconType;
}
