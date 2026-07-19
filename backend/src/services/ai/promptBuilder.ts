import { PredictionEvent } from 'shared';

export interface PlaybookContext {
  scenarioId?: string;
  timestamp: string;
  elapsedMinutes: number;
  crowd: number;
  capacity: number;
  waitTime: number;
  safetyScore: number;
  nearby: string[];
  events?: PredictionEvent[];
}

export interface BriefingContext {
  safetyScore: number;
  unresolvedCount: number;
  avgGateWait: number;
  activeEventTitles: string[];
}

export function buildPlaybookPrompt(zoneId: string, context: PlaybookContext): string {
  const lookupKey = context.scenarioId ?? zoneId;
  const activeEventTitles = context.events?.map((e) => e.title) ?? [];

  return `
You are the AI Stadium Operations Director for the FIFA World Cup 2026.
Ingest the following real-time telemetry anomaly/incident and output a mitigation playbook in strict JSON format.

Telemetry Context:
- Active Incident / Scenario: ${lookupKey}
- Match Time: ${context.timestamp} (Elapsed: ${context.elapsedMinutes}m)
- Current Crowd: ${context.crowd} (Capacity Limit: ${context.capacity})
- Wait Time: ${context.waitTime} minutes
- Safety Index: ${context.safetyScore}%
- Nearby Zones: ${JSON.stringify(context.nearby)}
- Current Active Events: ${JSON.stringify(activeEventTitles)}

You must respond with ONLY a raw JSON string matching this TypeScript interface structure:
{
  "title": "A short, actionable mitigation protocol name",
  "severity": "warning" or "critical",
  "confidence": number (between 80 and 99),
  "summary": "High-level summary of the issue",
  "reasoning": "Explain step-by-step the root causes of the bottleneck/incident",
  "estimatedImpact": "Safety or financial impact if no action is taken",
  "recommendedActions": string[] (checklist of 3-4 concrete actions),
  "departments": string[] (departments involved, e.g. "Security", "Operations", "Concessions", "Transit", "Medical")
}

Do NOT wrap in markdown code blocks. Return only raw, valid JSON text.
  `.trim();
}

export function buildBriefingPrompt(context: BriefingContext): string {
  return `
You are the Stadium Operations Director reporting a briefing for Azteca Stadium operations.
Current Stats:
- Safety Index: ${context.safetyScore}%
- Active Incidents count: ${context.unresolvedCount}
- Average Gate Wait time: ${context.avgGateWait} mins
- Active Events details: ${JSON.stringify(context.activeEventTitles)}

Generate a concise, professional executive briefing matching this exact structure:
- Overall Situation: [1 sentence summarizing status]
- Active Incidents: [1 sentence summarizing active warnings]
- Predicted Risks: [1 sentence predicting crowd flow risk]
- Recommended Actions: [1 sentence outlining coordinated redirects]
- Expected Outcome: [1 sentence stating final resolution time]

Write it as a cohesive paragraph to be read aloud (length: 80-100 words).
  `.trim();
}
