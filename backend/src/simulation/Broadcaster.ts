import { Server as SocketServer } from 'socket.io';
import { StadiumState, PredictionEvent, StadiumAnalytics } from 'shared';
import { calculateAnalytics } from './AnalyticsEngine.js';
import { IncidentManager } from './IncidentManager.js';

/**
 * Single responsibility: emit telemetry_tick to all connected clients.
 * Calls calculateAnalytics exactly once per broadcast.
 */
export class Broadcaster {
  private lastAnalytics: StadiumAnalytics | null = null;

  constructor(
    private readonly io: SocketServer,
    private readonly incidents: IncidentManager
  ) {}

  broadcast(
    state: StadiumState,
    events: PredictionEvent[],
    isPlaying: boolean
  ): void {
    this.lastAnalytics = calculateAnalytics(state, events);

    this.io.emit('telemetry_tick', {
      state,
      events,
      isPlaying,
      analytics: this.lastAnalytics,
      notifications: this.incidents.getNotifications(),
      timeline: this.incidents.getTimeline(),
    });
  }

  /** Returns the last computed analytics (for REST endpoints, avoids recomputing) */
  getLastAnalytics(): StadiumAnalytics | null {
    return this.lastAnalytics;
  }
}
