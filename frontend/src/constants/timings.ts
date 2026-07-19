/** Splash screen step advance interval (ms) */
export const SPLASH_STEP_DELAY_MS = 440;
/** Number of splash loading steps */
export const SPLASH_STEPS = 5;
/** Total splash duration = SPLASH_STEPS × SPLASH_STEP_DELAY_MS + buffer */
export const SPLASH_TOTAL_MS = SPLASH_STEPS * SPLASH_STEP_DELAY_MS + 300;
/** Page route transition duration (seconds, for framer-motion) */
export const PAGE_TRANSITION_DURATION_S = 0.35;
/** Clock tick interval (ms) */
export const CLOCK_TICK_MS = 1_000;
