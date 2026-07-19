import { useState, useEffect } from 'react';
import { CLOCK_TICK_MS } from '../constants/timings';

/**
 * Returns the current time, updated every second.
 * Single shared hook — eliminates duplicate setInterval in Header and Overview.
 */
export function useClock(): Date {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), CLOCK_TICK_MS);
    return () => clearInterval(id);
  }, []);

  return now;
}
