import { io, Socket } from 'socket.io-client';
import {
  SOCKET_RECONNECT_ATTEMPTS,
  SOCKET_RECONNECT_DELAY_MS,
  SOCKET_RECONNECT_DELAY_MAX_MS,
  SOCKET_RECONNECT_FACTOR,
  SOCKET_TIMEOUT_MS,
  SOCKET_TRANSPORTS,
} from '../constants/socket';
import { logger } from '../utils/logger';

// ---------------------------------------------------------------------------
// URL resolution — same sanitize logic as original SocketContext
// ---------------------------------------------------------------------------

const isDev = import.meta.env.DEV;

function sanitizeUrl(url: string | undefined, fallback: string): string {
  if (!url) return fallback;
  let clean = url.trim();
  // Guard against env var contamination (e.g. "VITE_SOCKET_URLhttps://...")
  const prefixes = ['VITE_SOCKET_URL', 'vite_socket_url', 'VITE_API_URL', 'vite_api_url'];
  for (const prefix of prefixes) {
    if (clean.startsWith(prefix)) {
      clean = clean.substring(prefix.length);
      break;
    }
  }
  return clean;
}

const SOCKET_URL = sanitizeUrl(
  import.meta.env.VITE_SOCKET_URL ?? import.meta.env.VITE_WS_URL,
  isDev ? 'http://localhost:5000' : 'https://arena-flow-backend.vercel.app'
);

// ---------------------------------------------------------------------------
// Singleton socket instance
// ---------------------------------------------------------------------------

let _socket: Socket | null = null;

function getSocket(): Socket {
  if (!_socket) {
    _socket = io(SOCKET_URL, {
      transports: SOCKET_TRANSPORTS,
      reconnectionAttempts: SOCKET_RECONNECT_ATTEMPTS,
      reconnectionDelay: SOCKET_RECONNECT_DELAY_MS,
      reconnectionDelayMax: SOCKET_RECONNECT_DELAY_MAX_MS,
      timeout: SOCKET_TIMEOUT_MS,
      autoConnect: false,
    });
    logger.info('Socket instance created', SOCKET_URL);
  }
  return _socket;
}

function connect(): void {
  getSocket().connect();
}

function disconnect(): void {
  _socket?.disconnect();
  _socket = null;
}

function isConnected(): boolean {
  return _socket?.connected ?? false;
}

function onEvent<T>(event: string, handler: (data: T) => void): () => void {
  const socket = getSocket();
  socket.on(event, handler);
  return () => socket.off(event, handler);
}

function onceEvent<T>(event: string, handler: (data: T) => void): void {
  getSocket().once(event, handler);
}

function emitEvent(event: string, payload?: unknown): void {
  const socket = getSocket();
  if (!socket.connected) {
    logger.warn('Attempted to emit while disconnected', { event });
    return;
  }
  try {
    socket.emit(event, payload);
  } catch (err) {
    logger.error('Socket emit failed', { event, err });
  }
}

export const socketService = {
  getSocket,
  connect,
  disconnect,
  isConnected,
  onEvent,
  onceEvent,
  emit: emitEvent,
  get url(): string { return SOCKET_URL; },
};
