import type { StadiumState, PredictionEvent, TimelineItem } from 'shared';
import { socketService } from './socket.service';

export type TelemetryPayload = {
  state: StadiumState;
  events: PredictionEvent[];
  isPlaying: boolean;
  timeline?: TimelineItem[];
};

type TelemetryHandler = (data: TelemetryPayload) => void;
type IncidentHandler = (item: TimelineItem) => void;

/**
 * Telemetry subscription service.
 * Returns unsubscribe functions for clean teardown in useEffect hooks.
 */
export const telemetryService = {
  onTick(handler: TelemetryHandler): () => void {
    return socketService.onEvent<TelemetryPayload>('telemetry_tick', handler);
  },
  onIncidentAdded(handler: IncidentHandler): () => void {
    return socketService.onEvent<TimelineItem>('incident_added', handler);
  },
  onBriefingGenerated(handler: (text: string) => void): () => void {
    return socketService.onEvent<string>('briefing_generated', handler);
  },
};
