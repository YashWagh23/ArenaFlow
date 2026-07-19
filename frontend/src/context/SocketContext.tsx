import React, { createContext, useContext, useEffect, useState } from 'react';
import type { StadiumState, PredictionEvent, StadiumAnalytics, TimelineItem } from 'shared';
import { socketService } from '../services/socket.service';
import { telemetryService } from '../services/telemetry.service';
import { analyticsService } from '../services/analytics.service';
import { logger } from '../utils/logger';

// ---------------------------------------------------------------------------
// Context shape — backward-compatible with all existing consumers
// ---------------------------------------------------------------------------

interface SocketContextType {
  state: StadiumState | null;
  events: PredictionEvent[];
  analytics: StadiumAnalytics | null;
  timeline: TimelineItem[];
  isPlaying: boolean;
  selectedZoneId: string | null;
  setSelectedZoneId: (id: string | null) => void;
  /** @deprecated Use useSimulation() hook instead */
  setPlaying: (playing: boolean) => void;
  /** @deprecated Use useSimulation() hook instead */
  resetSim: () => void;
  /** @deprecated Use useSimulation() hook instead */
  scrubSim: (minute: number) => void;
  /** @deprecated Use usePlaybookExecution() hook instead */
  executeStep: (eventId: string, stepId: string) => void;
  /** @deprecated Use useScenario() hook instead */
  triggerScenario: (scenarioId: string) => void;
  connectionError: boolean;
  socketUrl: string;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StadiumState | null>(null);
  const [events, setEvents] = useState<PredictionEvent[]>([]);
  const [analytics, setAnalytics] = useState<StadiumAnalytics | null>(null);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    logger.info('Connecting to telemetry server', socketService.url);

    socketService.connect();

    const unsubscribeFns: Array<() => void> = [];

    // Connection lifecycle
    const socket = socketService.getSocket();

    const onConnect = () => {
      logger.info('Socket connected');
      setConnectionError(false);
    };
    const onConnectError = (err: Error) => {
      logger.warn('Socket connection error', err.message);
      setConnectionError(true);
    };
    const onReconnect = () => {
      logger.info('Socket reconnected');
      setConnectionError(false);
    };
    const onReconnectFailed = () => {
      logger.error('Socket reconnect failed — all attempts exhausted');
      setConnectionError(true);
    };
    const onDisconnect = (reason: string) => {
      logger.warn('Socket disconnected', reason);
    };

    socket.on('connect', onConnect);
    socket.on('connect_error', onConnectError);
    socket.on('reconnect', onReconnect);
    socket.on('reconnect_failed', onReconnectFailed);
    socket.on('disconnect', onDisconnect);

    // Telemetry tick
    const unsubTick = telemetryService.onTick((data) => {
      setState(data.state);
      setEvents(data.events);
      setIsPlaying(data.isPlaying);
      if (data.timeline) setTimeline(data.timeline);
      setConnectionError(false);
    });
    unsubscribeFns.push(unsubTick);

    // Analytics updates (embedded in tick payload via analyticsService)
    const unsubAnalytics = analyticsService.onAnalyticsUpdate((a) => setAnalytics(a));
    unsubscribeFns.push(unsubAnalytics);

    // Incident additions
    const unsubIncident = telemetryService.onIncidentAdded((item) =>
      setTimeline((prev) => [item, ...prev])
    );
    unsubscribeFns.push(unsubIncident);

    return () => {
      socket.off('connect', onConnect);
      socket.off('connect_error', onConnectError);
      socket.off('reconnect', onReconnect);
      socket.off('reconnect_failed', onReconnectFailed);
      socket.off('disconnect', onDisconnect);
      unsubscribeFns.forEach((fn) => fn());
      socketService.disconnect();
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Legacy action methods — kept for backward compatibility
  // New code should use useSimulation(), useScenario(), usePlaybookExecution()
  // ---------------------------------------------------------------------------

  const setPlaying = (playing: boolean) => {
    socketService.emit('simulation_control', playing ? 'play' : 'pause');
  };

  const resetSim = () => {
    socketService.emit('simulation_control', 'reset');
  };

  const scrubSim = (minute: number) => {
    socketService.emit('scrub_timeline', minute);
  };

  const executeStep = (eventId: string, stepId: string) => {
    socketService.emit('execute_step', { eventId, stepId });
  };

  const triggerScenario = (scenarioId: string) => {
    socketService.emit('trigger_scenario', scenarioId);
  };

  return (
    <SocketContext.Provider
      value={{
        state,
        events,
        analytics,
        timeline,
        isPlaying,
        selectedZoneId,
        setSelectedZoneId,
        setPlaying,
        resetSim,
        scrubSim,
        executeStep,
        triggerScenario,
        connectionError,
        socketUrl: socketService.url,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useTelemetry() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useTelemetry must be used within a SocketProvider');
  }
  return context;
}
