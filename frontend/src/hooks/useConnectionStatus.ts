import { useTelemetry } from '../context/SocketContext';

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface ConnectionStatusResult {
  status: ConnectionStatus;
  socketUrl: string;
  /** True if the connection is currently usable */
  isConnected: boolean;
  /** True if connection has permanently failed (error state) */
  hasError: boolean;
}

/**
 * Derives a typed connection status from the raw SocketContext.
 * Components use this instead of accessing connectionError directly.
 */
export function useConnectionStatus(): ConnectionStatusResult {
  const { connectionError, socketUrl, state } = useTelemetry();

  let status: ConnectionStatus;
  if (connectionError) {
    status = 'error';
  } else if (!state) {
    status = 'connecting';
  } else {
    status = 'connected';
  }

  return {
    status,
    socketUrl,
    isConnected: status === 'connected',
    hasError: status === 'error',
  };
}
