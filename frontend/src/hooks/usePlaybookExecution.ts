import { useState, useEffect, useCallback } from 'react';
import type { PredictionEvent } from 'shared';
import { playbookService } from '../services/playbook.service';
import { STEP_EXECUTION_DELAY_MS } from '../constants/simulation';

interface PlaybookExecutionState {
  executingEventId: string | null;
  currentStepIndex: number;
  isComplete: boolean;
}

const INITIAL_STATE: PlaybookExecutionState = {
  executingEventId: null,
  currentStepIndex: -1,
  isComplete: false,
};

/**
 * Manages the playbook step-by-step execution UI flow.
 * Extracted from Overview to reduce its size and isolate this stateful logic.
 * The execution behavior is identical to the original — same delays, same step order.
 */
export function usePlaybookExecution(activeEvent: PredictionEvent | null) {
  const [executionState, setExecutionState] = useState<PlaybookExecutionState>(INITIAL_STATE);

  // Reset when the active event changes — preserves original behavior
  useEffect(() => {
    if (activeEvent?.id !== executionState.executingEventId) {
      setExecutionState(INITIAL_STATE);
    }
  }, [activeEvent, executionState.executingEventId]);

  const handleAuthorize = useCallback(async () => {
    if (!activeEvent) return;

    setExecutionState({
      executingEventId: activeEvent.id,
      currentStepIndex: 0,
      isComplete: false,
    });

    const steps = activeEvent.playbook.steps;
    for (let i = 0; i < steps.length; i++) {
      setExecutionState((prev) => ({ ...prev, currentStepIndex: i }));
      await new Promise<void>((resolve) => setTimeout(resolve, STEP_EXECUTION_DELAY_MS));
      playbookService.executeStep(activeEvent.id, steps[i].id);
    }

    setExecutionState((prev) => ({
      ...prev,
      currentStepIndex: steps.length,
      isComplete: true,
    }));
  }, [activeEvent]);

  return {
    executingEventId: executionState.executingEventId,
    currentStepIndex: executionState.currentStepIndex,
    isComplete: executionState.isComplete,
    handleAuthorize,
  };
}
