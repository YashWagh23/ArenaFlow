import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { StadiumState, PredictionEvent, StadiumAnalytics, TimelineItem } from 'shared';

interface SocketContextType {
  socket: Socket | null;
  state: StadiumState | null;
  events: PredictionEvent[];
  analytics: StadiumAnalytics | null;
  timeline: TimelineItem[];
  isPlaying: boolean;
  selectedZoneId: string | null;
  setSelectedZoneId: (id: string | null) => void;
  setPlaying: (playing: boolean) => void;
  resetSim: () => void;
  scrubSim: (minute: number) => void;
  executeStep: (eventId: string, stepId: string) => void;
  triggerScenario: (scenarioId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const WS_URL = (import.meta as any).env.VITE_WS_URL || 'http://localhost:5000';

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [state, setState] = useState<StadiumState | null>(null);
  const [events, setEvents] = useState<PredictionEvent[]>([]);
  const [analytics, setAnalytics] = useState<StadiumAnalytics | null>(null);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

  useEffect(() => {
    const newSocket = io(WS_URL, {
      transports: ['websocket'],
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {});

    newSocket.on('telemetry_tick', (data: { 
      state: StadiumState; 
      events: PredictionEvent[]; 
      isPlaying: boolean; 
      analytics?: StadiumAnalytics;
      timeline?: TimelineItem[];
    }) => {
      setState(data.state);
      setEvents(data.events);
      setIsPlaying(data.isPlaying);
      if (data.analytics) setAnalytics(data.analytics);
      if (data.timeline) setTimeline(data.timeline);
    });

    newSocket.on('incident_added', (item: TimelineItem) => {
      setTimeline(prev => [item, ...prev]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const setPlaying = (playing: boolean) => {
    if (socket) {
      socket.emit('simulation_control', playing ? 'play' : 'pause');
    }
  };

  const resetSim = () => {
    if (socket) {
      socket.emit('simulation_control', 'reset');
    }
  };

  const scrubSim = (minute: number) => {
    if (socket) {
      socket.emit('scrub_timeline', minute);
    }
  };

  const executeStep = (eventId: string, stepId: string) => {
    if (socket) {
      socket.emit('execute_step', { eventId, stepId });
    }
  };

  const triggerScenario = (scenarioId: string) => {
    if (socket) {
      socket.emit('trigger_scenario', scenarioId);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
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
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useTelemetry() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useTelemetry must be used within a SocketProvider');
  }
  return context;
}
