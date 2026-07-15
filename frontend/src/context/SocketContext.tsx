import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { StadiumState, PredictionEvent, StadiumAnalytics, AppNotification, TimelineItem } from 'shared';

interface SocketContextType {
  socket: Socket | null;
  state: StadiumState | null;
  events: PredictionEvent[];
  analytics: StadiumAnalytics | null;
  notifications: AppNotification[];
  timeline: TimelineItem[];
  briefingText: string;
  briefingLoading: boolean;
  isPlaying: boolean;
  selectedZoneId: string | null;
  isReplaying: boolean;
  setSelectedZoneId: (id: string | null) => void;
  setPlaying: (playing: boolean) => void;
  resetSim: () => void;
  scrubSim: (minute: number) => void;
  executeStep: (eventId: string, stepId: string) => void;
  triggerScenario: (scenarioId: string) => void;
  requestBriefing: () => void;
  clearBriefing: () => void;
  markNotificationsRead: () => void;
  startMissionReplay: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const WS_URL = (import.meta as any).env.VITE_WS_URL || 'http://localhost:5000';

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [state, setState] = useState<StadiumState | null>(null);
  const [events, setEvents] = useState<PredictionEvent[]>([]);
  const [analytics, setAnalytics] = useState<StadiumAnalytics | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [briefingText, setBriefingText] = useState('');
  const [briefingLoading, setBriefingLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [isReplaying, setIsReplaying] = useState(false);

  useEffect(() => {
    const newSocket = io(WS_URL, {
      transports: ['websocket'],
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Telemetry link active:', newSocket.id);
    });

    newSocket.on('telemetry_tick', (data: { 
      state: StadiumState; 
      events: PredictionEvent[]; 
      isPlaying: boolean; 
      analytics?: StadiumAnalytics;
      notifications?: AppNotification[];
      timeline?: TimelineItem[];
    }) => {
      setState(data.state);
      setEvents(data.events);
      setIsPlaying(data.isPlaying);
      if (data.analytics) setAnalytics(data.analytics);
      if (data.notifications) setNotifications(data.notifications);
      if (data.timeline) setTimeline(data.timeline);
    });

    newSocket.on('new_notification', (notif: AppNotification) => {
      setNotifications(prev => [notif, ...prev]);
    });

    newSocket.on('incident_added', (item: TimelineItem) => {
      setTimeline(prev => [item, ...prev]);
    });

    newSocket.on('briefing_generated', (briefing: string) => {
      setBriefingText(briefing);
      setBriefingLoading(false);
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

  const requestBriefing = () => {
    if (socket) {
      setBriefingLoading(true);
      socket.emit('request_briefing');
    }
  };

  const clearBriefing = () => {
    setBriefingText('');
  };

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  const startMissionReplay = () => {
    if (isReplaying) return;
    setIsReplaying(true);
    setPlaying(false); // Pause live timeline during playback

    const steps = [
      { minute: 0, delay: 0 },
      { minute: 15, delay: 2000 },
      { minute: 20, delay: 4000 },
      { minute: 30, delay: 6000 },
      { minute: 40, delay: 8000 },
      { minute: 65, delay: 10000 },
    ];

    steps.forEach(({ minute, delay }) => {
      setTimeout(() => {
        scrubSim(minute);
        if (minute === 15) setSelectedZoneId('transit-station');
        if (minute === 20 || minute === 30) setSelectedZoneId('gate-c');
        if (minute === 65) setSelectedZoneId(null);
      }, delay);
    });

    setTimeout(() => {
      setIsReplaying(false);
      setPlaying(true);
    }, 12500);
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        state,
        events,
        analytics,
        notifications,
        timeline,
        briefingText,
        briefingLoading,
        isPlaying,
        selectedZoneId,
        isReplaying,
        setSelectedZoneId,
        setPlaying,
        resetSim,
        scrubSim,
        executeStep,
        triggerScenario,
        requestBriefing,
        clearBriefing,
        markNotificationsRead,
        startMissionReplay,
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
