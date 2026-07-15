import dotenv from 'dotenv';

dotenv.config();

export interface PlaybookPayload {
  title: string;
  severity: string;
  confidence: number;
  summary: string;
  reasoning: string;
  estimatedImpact: string;
  recommendedActions: string[];
  departments: string[];
}

const mockPlaybooks: Record<string, PlaybookPayload> = {
  'heavy-rain': {
    title: 'Adverse Weather Operational Adjustments',
    severity: 'warning',
    confidence: 90,
    summary: 'Heavy downpour leading to slick surfaces and outdoor transit delays.',
    reasoning: 'Inbound crowd movement has slowed by 35% due to slippery stairs and open plazas. Parking congestion is increasing as more fans seek shelter in pick-up zones.',
    estimatedImpact: 'Safety score drop to 85% due to slip hazards; entry bottleneck delays of 15 minutes at open gates.',
    recommendedActions: [
      'Deploy traction mats at all concourse staircases',
      'Extend turnstile entry buffer limits by 10 minutes',
      'Establish traffic control lanes for passenger shuttle service'
    ],
    departments: ['Operations', 'Security']
  },
  'metro-delay': {
    title: 'Transit Congestion Mitigation Plan',
    severity: 'critical',
    confidence: 94,
    summary: 'Metro breakdown at Transit East causes passenger aggregation.',
    reasoning: 'A 20-minute rail interruption has backed up 3,500 commuters on the boarding platform, creating pressure towards Gate C.',
    estimatedImpact: 'Crowd density risk Level 4 at East transit exit ramps within 8 minutes.',
    recommendedActions: [
      'Halt boarding escalators to transit platform level',
      'Activate smart signage directing foot traffic to shuttle lanes',
      'Coordinate with regional bus dispatch to deploy 6 emergency transport buses'
    ],
    departments: ['Transit', 'Security', 'Operations']
  },
  'medical-emergency': {
    title: 'Cardiac Emergency Response Protocol',
    severity: 'critical',
    confidence: 98,
    summary: 'Medical assistance requested in Section 104.',
    reasoning: 'Emergency beacon activated for a spectator experiencing chest pain and breathing difficulties.',
    estimatedImpact: 'Critical incident response time must stay below 4 minutes to ensure safety.',
    recommendedActions: [
      'Dispatch Rapid Response Team 3 to Section 104, Seat Row G',
      'Authorize security detail to clear Medical Evacuation Corridor West',
      'Prepare Medical Bay Alpha for emergency patient intake'
    ],
    departments: ['Medical', 'Security']
  },
  'gate-failure': {
    title: 'Scanner Outage Response Playbook',
    severity: 'critical',
    confidence: 92,
    summary: 'Scanner network outage at Gate C.',
    reasoning: 'Local fiber connection loss has disabled turnstiles C1 through C6, trapping incoming spectator queues.',
    estimatedImpact: 'Inflow backlog wait time rising to 45 minutes; potential crowd crushing at outer barriers.',
    recommendedActions: [
      'Deploy portable backup scanning devices to Gate C staff',
      'Divert Gate C inbound lines to adjacent Gate B portals',
      'Manually override security gate locks to allow stewarded access'
    ],
    departments: ['Operations', 'Security']
  },
  'vip-arrival': {
    title: 'VIP Arrival Security Allocation',
    severity: 'warning',
    confidence: 86,
    summary: 'High-profile delegation arriving at VIP gate.',
    reasoning: 'Official motorcade has entered VIP Parking, requiring security path isolation.',
    estimatedImpact: 'Temporary 5-minute pedestrian delay in North Concourse corridors.',
    recommendedActions: [
      'Establish temporary VIP security corridor from gate to lounge',
      'Reallocate 4 guest relations stewards to guide VIP queues',
      'Coordinate gate access with federal security officers'
    ],
    departments: ['Security', 'Operations']
  },
  'security-threat': {
    title: 'Suspicious Package Isolation Strategy',
    severity: 'critical',
    confidence: 95,
    summary: 'Unattended bag detected near Concession B.',
    reasoning: 'Security patrol has flagged a suspicious container left near the main food court corridor.',
    estimatedImpact: 'Localized evacuation required. Corridor closure could create exit path delays.',
    recommendedActions: [
      'Cordon off Concession B corridor (30-meter radius)',
      'Direct fans away from East Concourse toward West routes',
      'Dispatch Security HQ K9 sweep unit to investigate'
    ],
    departments: ['Security', 'Operations']
  },
  'fire-alarm': {
    title: 'Localized Evacuation Directive',
    severity: 'critical',
    confidence: 99,
    summary: 'Smoke sensor activated in Food Court B kitchen.',
    reasoning: 'Thermal detection alarm triggered, indicating localized hazard in kitchen vent exhaust.',
    estimatedImpact: 'Safety score drops to 40% if evacuation routes are not dynamically adjusted.',
    recommendedActions: [
      'Activate localized fire suppression system at food court B',
      'Initiate zoned evacuation announcement for East Stand sectors',
      'Open emergency exit routes 4, 5, and 6 to clear the plaza'
    ],
    departments: ['Security', 'Medical', 'Operations']
  },
  'match-end': {
    title: 'Match-End Evacuation Optimization',
    severity: 'warning',
    confidence: 93,
    summary: 'Final whistle blown. Mass exit phase initiated.',
    reasoning: '80,000 spectators exiting stands towards transport hubs simultaneously.',
    estimatedImpact: 'Heavy transit congestion and wait times exceeding 45 minutes at Metro platforms.',
    recommendedActions: [
      'Open all exit gates A, B, C, and D to maximum width',
      'Activate transit hub platform gating to control queue density',
      'Synchronize outer traffic signals to prioritize departing shuttles'
    ],
    departments: ['Operations', 'Transit', 'Security']
  }
};

export async function generatePlaybook(zoneId: string, context: any): Promise<PlaybookPayload> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  // Custom scenario ID checking to trigger specific mock items
  const lookupKey = context.scenarioId || zoneId;

  if (!apiKey) {
    console.log(`[AI] GEMINI_API_KEY not set. Falling back to mock playbook for lookup key: ${lookupKey}.`);
    return getFallbackPlaybook(lookupKey);
  }

  try {
    const prompt = `
      You are the AI Stadium Operations Director for the FIFA World Cup 2026.
      Ingest the following real-time telemetry anomaly/incident and output a mitigation playbook in strict JSON format.
      
      Telemetry Context:
      - Active Incident / Scenario: ${lookupKey}
      - Match Time: ${context.timestamp} (Elapsed: ${context.elapsedMinutes}m)
      - Current Crowd: ${context.crowd} (Capacity Limit: ${context.capacity})
      - Wait Time: ${context.waitTime} minutes
      - Safety Index: ${context.safetyScore}%
      - Nearby Zones: ${JSON.stringify(context.nearby)}
      - Current Active Events: ${JSON.stringify(context.events?.map((e: any) => e.title) || [])}
      
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
      
      Do NOT wrap in markdown code blocks like \`\`\`json. Return only raw, valid JSON text.
    `;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error('Empty response from Gemini API');
    }

    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanText) as PlaybookPayload;

  } catch (error) {
    console.error('[AI] Gemini call failed, falling back to mock:', error);
    return getFallbackPlaybook(lookupKey);
  }
}

function getFallbackPlaybook(key: string): PlaybookPayload {
  const normalizedKey = key.toLowerCase();
  
  if (normalizedKey.includes('heavy-rain')) return mockPlaybooks['heavy-rain'];
  if (normalizedKey.includes('metro-delay')) return mockPlaybooks['metro-delay'];
  if (normalizedKey.includes('medical-emergency')) return mockPlaybooks['medical-emergency'];
  if (normalizedKey.includes('gate-failure') || normalizedKey.includes('gate-c')) return mockPlaybooks['gate-failure'];
  if (normalizedKey.includes('vip-arrival')) return mockPlaybooks['vip-arrival'];
  if (normalizedKey.includes('security-threat')) return mockPlaybooks['security-threat'];
  if (normalizedKey.includes('fire-alarm')) return mockPlaybooks['fire-alarm'];
  if (normalizedKey.includes('match-end') || normalizedKey.includes('gate-d')) return mockPlaybooks['match-end'];
  
  return {
    title: 'General Anomaly Control Protocol',
    severity: 'warning',
    confidence: 85,
    summary: 'Localized traffic density surge observed.',
    reasoning: 'Crowd movement tracking indicates temporary bottleneck in pedestrian pathing.',
    estimatedImpact: 'Localized delays. Safety threshold remains inside normal parameter bounds.',
    recommendedActions: [
      'Open overflow bypass queues',
      'Deploy guest stewards to direct traffic'
    ],
    departments: ['Operations']
  };
}
