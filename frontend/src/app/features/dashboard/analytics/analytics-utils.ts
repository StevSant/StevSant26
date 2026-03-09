import { getCountryFlag, getLanguageFlag } from '@shared/utils/flag-utils';

/**
 * Format seconds into a human-readable duration (e.g. "2m 30s").
 */
export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '0s';
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

/**
 * Get an icon class based on device type.
 */
export function getDeviceIcon(type: string): string {
  switch (type) {
    case 'desktop':
      return 'desktop_windows';
    case 'mobile':
      return 'smartphone';
    case 'tablet':
      return 'tablet';
    default:
      return 'help_outline';
  }
}

/**
 * Format a page path for display.
 */
export function formatPagePath(path: string): string {
  if (path === '/' || path === '') return 'Home';
  return path.replace(/^\//, '').replace(/-/g, ' ').replace(/\//g, ' / ');
}

/**
 * Format a browser language tag (e.g., "es", "en-US") into a readable label.
 */
export function formatLanguageTag(tag: string): string {
  if (!tag || tag === 'unknown') return 'Unknown';
  try {
    const names = new Intl.DisplayNames(['en'], { type: 'language' });
    return names.of(tag) || tag;
  } catch {
    return tag;
  }
}

/**
 * Get a flag emoji for a language code.
 */
export function getLanguageFlagEmoji(tag: string): string {
  return getLanguageFlag(tag);
}

/**
 * Get a flag emoji for a country name.
 */
export function getCountryFlagEmoji(country: string): string {
  return getCountryFlag(country);
}

/**
 * Returns a badge config (label + color classes) based on referrer source.
 * Returns null if no special badge applies.
 */
export function getReferrerBadge(source: string): { label: string; classes: string } | null {
  const s = source.toLowerCase();
  if (s.includes('linkedin')) {
    return {
      label: 'LinkedIn',
      classes: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    };
  }
  if (s.includes('cv') || s.includes('curriculum') || s.includes('resume')) {
    return {
      label: 'CV',
      classes: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    };
  }
  if (s.includes('github')) {
    return {
      label: 'GitHub',
      classes: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
    };
  }
  if (s.includes('google')) {
    return {
      label: 'Google',
      classes: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    };
  }
  if (s.includes('indeed')) {
    return {
      label: 'Indeed',
      classes: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
    };
  }
  if (s.includes('glassdoor')) {
    return {
      label: 'Glassdoor',
      classes: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    };
  }
  if (s.includes('twitter') || s.includes('x.com')) {
    return {
      label: 'X / Twitter',
      classes: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300',
    };
  }
  if (s.includes('instagram')) {
    return {
      label: 'Instagram',
      classes: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
    };
  }
  if (s.includes('facebook')) {
    return {
      label: 'Facebook',
      classes: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    };
  }
  return null;
}
