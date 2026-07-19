/** Maximum reconnection attempts before giving up. Infinity = always retry. */
export const SOCKET_RECONNECT_ATTEMPTS = Infinity;
/** Base delay between reconnect attempts (ms) */
export const SOCKET_RECONNECT_DELAY_MS = 1_000;
/** Maximum delay cap for exponential backoff (ms) */
export const SOCKET_RECONNECT_DELAY_MAX_MS = 10_000;
/** Exponential backoff multiplier */
export const SOCKET_RECONNECT_FACTOR = 1.5;
/** Initial connection timeout (ms) */
export const SOCKET_TIMEOUT_MS = 10_000;
/** Socket transports — websocket only, no long-polling fallback */
export const SOCKET_TRANSPORTS = ['websocket'];
