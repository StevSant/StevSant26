/**
 * Utility functions for converting country names and language codes to flag emojis.
 */

/** Convert an ISO 3166-1 alpha-2 code to a flag emoji. */
export function countryCodeToFlag(code: string): string {
  return code
    .toUpperCase()
    .split('')
    .map((c) => String.fromCodePoint(c.charCodeAt(0) + 127397))
    .join('');
}

/** Map of common country names (lowercase) to ISO 3166-1 alpha-2 codes. */
const COUNTRY_NAME_TO_CODE: Record<string, string> = {
  afghanistan: 'AF', albania: 'AL', algeria: 'DZ', argentina: 'AR',
  australia: 'AU', austria: 'AT', bangladesh: 'BD', belgium: 'BE',
  bolivia: 'BO', brazil: 'BR', canada: 'CA', chile: 'CL',
  china: 'CN', colombia: 'CO', 'costa rica': 'CR', croatia: 'HR',
  cuba: 'CU', czechia: 'CZ', 'czech republic': 'CZ', denmark: 'DK',
  'dominican republic': 'DO', ecuador: 'EC', egypt: 'EG',
  'el salvador': 'SV', estonia: 'EE', ethiopia: 'ET', finland: 'FI',
  france: 'FR', germany: 'DE', ghana: 'GH', greece: 'GR',
  guatemala: 'GT', honduras: 'HN', 'hong kong': 'HK', hungary: 'HU',
  iceland: 'IS', india: 'IN', indonesia: 'ID', iran: 'IR', iraq: 'IQ',
  ireland: 'IE', israel: 'IL', italy: 'IT', jamaica: 'JM', japan: 'JP',
  jordan: 'JO', kenya: 'KE', 'south korea': 'KR', korea: 'KR',
  kuwait: 'KW', latvia: 'LV', lebanon: 'LB', libya: 'LY',
  lithuania: 'LT', luxembourg: 'LU', malaysia: 'MY', mexico: 'MX',
  morocco: 'MA', nepal: 'NP', netherlands: 'NL', 'new zealand': 'NZ',
  nicaragua: 'NI', nigeria: 'NG', norway: 'NO', pakistan: 'PK',
  panama: 'PA', paraguay: 'PY', peru: 'PE', philippines: 'PH',
  poland: 'PL', portugal: 'PT', 'puerto rico': 'PR', qatar: 'QA',
  romania: 'RO', russia: 'RU', 'saudi arabia': 'SA', serbia: 'RS',
  singapore: 'SG', slovakia: 'SK', slovenia: 'SI', 'south africa': 'ZA',
  spain: 'ES', 'sri lanka': 'LK', sweden: 'SE', switzerland: 'CH',
  taiwan: 'TW', thailand: 'TH', turkey: 'TR', ukraine: 'UA',
  'united arab emirates': 'AE', 'united kingdom': 'GB', 'united states': 'US',
  uruguay: 'UY', venezuela: 'VE', vietnam: 'VN',
};

/** Get a flag emoji from a country name. Returns empty string if not found. */
export function getCountryFlag(countryName: string): string {
  if (!countryName) return '';
  const code = COUNTRY_NAME_TO_CODE[countryName.toLowerCase().trim()];
  return code ? countryCodeToFlag(code) : '';
}

/** Map of language codes to representative flag ISO codes. */
const LANGUAGE_TO_FLAG: Record<string, string> = {
  en: 'US', es: 'ES', fr: 'FR', de: 'DE', pt: 'BR', it: 'IT',
  zh: 'CN', ja: 'JP', ko: 'KR', ru: 'RU', ar: 'SA', hi: 'IN',
  nl: 'NL', pl: 'PL', sv: 'SE', da: 'DK', fi: 'FI', no: 'NO',
  tr: 'TR', th: 'TH', vi: 'VN', id: 'ID', ms: 'MY', uk: 'UA',
  cs: 'CZ', ro: 'RO', hu: 'HU', el: 'GR', he: 'IL', ca: 'ES',
  bg: 'BG', hr: 'HR', sk: 'SK', sl: 'SI', sr: 'RS', lt: 'LT',
  lv: 'LV', et: 'EE', tl: 'PH', bn: 'BD', ta: 'IN', ur: 'PK',
  fa: 'IR', sw: 'KE',
};

/** Get a flag emoji for a language code (e.g., "en" → 🇺🇸). */
export function getLanguageFlag(langCode: string): string {
  if (!langCode) return '';
  const base = langCode.split('-')[0].toLowerCase();
  const flagCode = LANGUAGE_TO_FLAG[base];
  return flagCode ? countryCodeToFlag(flagCode) : '';
}
