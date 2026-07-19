import { socketService } from './socket.service';

/**
 * Simulation control — components call these methods, never socket.emit directly.
 * Event names are unchanged: 'simulation_control', 'scrub_timeline'.
 */
export const simulationService = {
  play(): void {
    socketService.emit('simulation_control', 'play');
  },
  pause(): void {
    socketService.emit('simulation_control', 'pause');
  },
  reset(): void {
    socketService.emit('simulation_control', 'reset');
  },
  scrub(minute: number): void {
    socketService.emit('scrub_timeline', minute);
  },
};
