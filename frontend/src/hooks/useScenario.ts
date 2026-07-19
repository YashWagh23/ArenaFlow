import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { playbookService } from '../services/playbook.service';

/**
 * Scenario trigger hook. Handles navigation after trigger — preserves existing behavior
 * where triggering a scenario navigates to /dashboard.
 */
export function useScenario() {
  const navigate = useNavigate();

  const triggerScenario = useCallback(
    (scenarioId: string) => {
      playbookService.triggerScenario(scenarioId);
      navigate('/dashboard');
    },
    [navigate]
  );

  return { triggerScenario };
}
