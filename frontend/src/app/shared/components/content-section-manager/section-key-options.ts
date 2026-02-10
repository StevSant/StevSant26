import { ContentSectionKey } from '@core/models/entities/content-section.model';

/**
 * Available section key option for the dropdown selector
 */
export interface SectionKeyOption {
  value: ContentSectionKey;
  labelKey: string;
  icon: string;
}

/**
 * Detects whether an icon string is a Material Symbols name (ASCII lowercase with underscores)
 * vs. an emoji or other Unicode character.
 */
export function isMaterialIcon(icon: string | null | undefined): boolean {
  if (!icon) return false;
  return /^[a-z][a-z0-9_]*$/.test(icon);
}

/**
 * Predefined section key options with icons and translation keys.
 * Icons can be emojis or Material Symbols Outlined names.
 */
export const SECTION_KEY_OPTIONS: SectionKeyOption[] = [
  { value: 'overview', labelKey: 'contentSections.keys.overview', icon: 'info' },
  { value: 'problem', labelKey: 'contentSections.keys.problem', icon: 'gps_fixed' },
  { value: 'mistakes', labelKey: 'contentSections.keys.mistakes', icon: 'error' },
  { value: 'technical_decisions', labelKey: 'contentSections.keys.technical_decisions', icon: 'settings' },
  { value: 'tradeoffs', labelKey: 'contentSections.keys.tradeoffs', icon: 'balance' },
  { value: 'impact', labelKey: 'contentSections.keys.impact', icon: 'bar_chart' },
  { value: 'lessons_learned', labelKey: 'contentSections.keys.lessons_learned', icon: 'school' },
  { value: 'architecture', labelKey: 'contentSections.keys.architecture', icon: 'account_tree' },
  { value: 'challenges', labelKey: 'contentSections.keys.challenges', icon: 'warning' },
  { value: 'results', labelKey: 'contentSections.keys.results', icon: 'check_circle' },
  { value: 'methodology', labelKey: 'contentSections.keys.methodology', icon: 'description' },
  { value: 'tech_stack', labelKey: 'contentSections.keys.tech_stack', icon: 'layers' },
  { value: 'features', labelKey: 'contentSections.keys.features', icon: 'star' },
  { value: 'testing', labelKey: 'contentSections.keys.testing', icon: 'bug_report' },
  { value: 'api', labelKey: 'contentSections.keys.api', icon: 'api' },
  { value: 'deployment', labelKey: 'contentSections.keys.deployment', icon: 'cloud' },
  { value: 'infrastructure', labelKey: 'contentSections.keys.infrastructure', icon: 'dns' },
  { value: 'workflow', labelKey: 'contentSections.keys.workflow', icon: 'route' },
  { value: 'how_it_works', labelKey: 'contentSections.keys.how_it_works', icon: 'sync' },
  { value: 'motivation', labelKey: 'contentSections.keys.motivation', icon: 'gps_fixed' },
  { value: 'ui_ux', labelKey: 'contentSections.keys.ui_ux', icon: 'palette' },
  { value: 'i18n', labelKey: 'contentSections.keys.i18n', icon: 'translate' },
  { value: 'custom', labelKey: 'contentSections.keys.custom', icon: 'edit_note' },
];
