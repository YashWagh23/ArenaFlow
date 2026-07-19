import { Server as SocketServer } from 'socket.io';
import { AppNotification, TimelineItem } from 'shared';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('IncidentManager');

/**
 * Manages notifications and timeline items only.
 * Emits events to connected clients but does not touch stadium state.
 */
export class IncidentManager {
  private notifications: AppNotification[] = [];
  private timeline: TimelineItem[] = [];
  private currentTimestamp = '19:00';

  constructor(private readonly io: SocketServer) {}

  setTimestamp(timestamp: string): void {
    this.currentTimestamp = timestamp;
  }

  getNotifications(): AppNotification[] {
    return this.notifications;
  }

  getTimeline(): TimelineItem[] {
    return this.timeline;
  }

  reset(): void {
    this.notifications = [];
    this.timeline = [];
    logger.info('Incident log cleared');
  }

  addNotification(
    title: string,
    description: string,
    priority: AppNotification['priority'] = 'low',
    icon = 'Bell'
  ): void {
    const notif: AppNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: this.currentTimestamp,
      icon,
      priority,
      title,
      description,
      unread: true,
    };
    this.notifications.unshift(notif);
    this.io.emit('new_notification', notif);
    logger.debug('Notification added', { title, priority });
  }

  addTimelineItem(
    title: string,
    severity: TimelineItem['severity'] = 'info',
    zoneId?: string,
    icon = 'Info'
  ): void {
    const item: TimelineItem = {
      id: `timeline-${Date.now()}`,
      timestamp: this.currentTimestamp,
      icon,
      title,
      severity,
      status: 'active',
      zoneId,
    };
    this.timeline.unshift(item);
    this.io.emit('incident_added', item);
    logger.debug('Timeline item added', { title, severity, zoneId });
  }
}
