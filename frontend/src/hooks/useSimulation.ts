import { simulationService } from '../services/simulation.service';

/**
 * Exposes simulation control methods — components never import simulationService directly.
 * This hook can be expanded later with local optimistic state if needed.
 */
export function useSimulation() {
  return {
    play: simulationService.play,
    pause: simulationService.pause,
    reset: simulationService.reset,
    scrub: simulationService.scrub,
  };
}
