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
 * Predefined section key options with icons and translation keys
 */
export const SECTION_KEY_OPTIONS: SectionKeyOption[] = [
  { value: 'problem', labelKey: 'contentSections.keys.problem', icon: '🎯' },
  { value: 'mistakes', labelKey: 'contentSections.keys.mistakes', icon: '❌' },
  { value: 'technical_decisions', labelKey: 'contentSections.keys.technical_decisions', icon: '⚙️' },
  { value: 'tradeoffs', labelKey: 'contentSections.keys.tradeoffs', icon: '⚖️' },
  { value: 'impact', labelKey: 'contentSections.keys.impact', icon: '📊' },
  { value: 'lessons_learned', labelKey: 'contentSections.keys.lessons_learned', icon: '📚' },
  { value: 'architecture', labelKey: 'contentSections.keys.architecture', icon: '🏗️' },
  { value: 'challenges', labelKey: 'contentSections.keys.challenges', icon: '🧩' },
  { value: 'results', labelKey: 'contentSections.keys.results', icon: '✅' },
  { value: 'methodology', labelKey: 'contentSections.keys.methodology', icon: '📋' },
  { value: 'custom', labelKey: 'contentSections.keys.custom', icon: '📝' },
];
