/** How long (ms) before a visitor is considered inactive */
export const ACTIVE_VISITOR_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

/** Polling interval (ms) for active visitor count when Realtime is unavailable */
export const ACTIVE_VISITOR_POLL_INTERVAL_MS = 30 * 1000; // 30 seconds

/** Number of page views in the spike window to trigger a traffic spike alert */
export const TRAFFIC_SPIKE_THRESHOLD = 5;

/** Time window (ms) for traffic spike detection */
export const TRAFFIC_SPIKE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

/** Cooldown (ms) between traffic spike alerts */
export const TRAFFIC_SPIKE_COOLDOWN_MS = 15 * 60 * 1000; // 15 minutes

/** How long (ms) a toast stays visible before auto-dismissing */
export const TOAST_AUTO_DISMISS_MS = 8 * 1000; // 8 seconds

/** Maximum number of visible toasts at once */
export const TOAST_MAX_VISIBLE = 3;

/** How long (ms) the changes banner stays visible before auto-hiding */
export const BANNER_AUTO_HIDE_MS = 60 * 1000; // 60 seconds

/** Interval (ms) for saving dashboard visit snapshot while tab is active */
export const SNAPSHOT_SAVE_INTERVAL_MS = 30 * 1000; // 30 seconds
