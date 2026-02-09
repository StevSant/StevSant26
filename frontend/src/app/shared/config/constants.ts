/**
 * Application-wide constants to replace magic numbers and hardcoded values.
 */

/** Duration in ms for success/info messages before auto-dismiss */
export const SUCCESS_MESSAGE_DURATION_MS = 3000;

/** Duration in ms for the "message sent" notification */
export const MESSAGE_SENT_DISPLAY_MS = 4000;

/** Debounce time in ms for location search input */
export const LOCATION_SEARCH_DEBOUNCE_MS = 400;

/** Maximum results returned by the geocoding API */
export const LOCATION_SEARCH_MAX_RESULTS = 6;

/** Maximum file sizes (in bytes) for uploads */
export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_DOCUMENT_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB
export const MAX_CV_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB

/** Nominatim geocoding API base URL */
export const NOMINATIM_API_URL = 'https://nominatim.openstreetmap.org/search';
