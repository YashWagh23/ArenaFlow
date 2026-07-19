import { createLogger } from '../utils/logger.js';

const logger = createLogger('SimulationClock');

type TickCallback = () => void | Promise<void>;

/**
 * Manages only the tick interval. Does not know about stadium state or socket.
 */
export class SimulationClock {
  private intervalId: NodeJS.Timeout | null = null;
  private _isPlaying = false;
  private readonly tickIntervalMs: number;

  constructor(tickIntervalMs = 1000) {
    this.tickIntervalMs = tickIntervalMs;
  }

  get isPlaying(): boolean {
    return this._isPlaying;
  }

  start(onTick: TickCallback): void {
    if (this.intervalId) this.stop();
    this._isPlaying = true;
    logger.info('Clock started');

    this.intervalId = setInterval(() => {
      if (this._isPlaying) {
        void onTick();
      }
    }, this.tickIntervalMs);
  }

  pause(): void {
    this._isPlaying = false;
    logger.info('Clock paused');
  }

  resume(): void {
    this._isPlaying = true;
    logger.info('Clock resumed');
  }

  stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this._isPlaying = false;
    logger.info('Clock stopped');
  }
}
