export function getSeverityFromScore(score: number): 'optimal' | 'warning' | 'critical' {
  if (score >= 85) return 'optimal';
  if (score >= 60) return 'warning';
  return 'critical';
}

export function formatSimTimestamp(minutes: number): string {
  const startHour = 19;
  const totalMinutes = startHour * 60 + minutes;
  const currentHour = Math.floor(totalMinutes / 60) % 24;
  const currentMin = totalMinutes % 60;
  return `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
}

export function formatProbability(prob: number): string {
  return `${Math.round(prob)}%`;
}

export function calculateSafetyOffset(baseScore: number, activeIncidentCount: number): number {
  return Math.max(10, baseScore - activeIncidentCount * 12);
}
