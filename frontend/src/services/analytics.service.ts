import type { StadiumAnalytics, AppNotification } from 'shared';
import { socketService } from './socket.service';

type TelemetryPayload = { analytics?: StadiumAnalytics; notifications?: AppNotification[] };
type AnalyticsHandler = (analytics: StadiumAnalytics) => void;
type NotificationHandler = (notif: AppNotification) => void;

/**
 * Analytics and notification subscription service.
 */
export const analyticsService = {
  onAnalyticsUpdate(handler: AnalyticsHandler): () => void {
    return socketService.onEvent<TelemetryPayload>('telemetry_tick', (data) => {
      if (data.analytics) handler(data.analytics);
    });
  },
  onNewNotification(handler: NotificationHandler): () => void {
    return socketService.onEvent<AppNotification>('new_notification', handler);
  },
};
