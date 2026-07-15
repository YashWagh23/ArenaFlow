import { StadiumState, PredictionEvent } from 'shared';

export const initialZones = {
  'gate-a': { id: 'gate-a', name: 'Gate A', type: 'gate' as const, status: 'optimal' as const, currentLoad: 50, capacity: 1200, waitTime: 1, risk: 'Low' as const },
  'gate-b': { id: 'gate-b', name: 'Gate B', type: 'gate' as const, status: 'optimal' as const, currentLoad: 45, capacity: 1200, waitTime: 1, risk: 'Low' as const },
  'gate-c': { id: 'gate-c', name: 'Gate C', type: 'gate' as const, status: 'optimal' as const, currentLoad: 55, capacity: 1500, waitTime: 1, risk: 'Low' as const },
  'gate-d': { id: 'gate-d', name: 'Gate D', type: 'gate' as const, status: 'optimal' as const, currentLoad: 48, capacity: 1200, waitTime: 1, risk: 'Low' as const },
  
  'stand-north': { id: 'stand-north', name: 'North Stand', type: 'stand' as const, status: 'optimal' as const, currentLoad: 120, capacity: 18000, waitTime: 0, risk: 'Low' as const },
  'stand-south': { id: 'stand-south', name: 'South Stand', type: 'stand' as const, status: 'optimal' as const, currentLoad: 90, capacity: 18000, waitTime: 0, risk: 'Low' as const },
  'stand-east': { id: 'stand-east', name: 'East Stand', type: 'stand' as const, status: 'optimal' as const, currentLoad: 110, capacity: 20000, waitTime: 0, risk: 'Low' as const },
  'stand-west': { id: 'stand-west', name: 'West Stand', type: 'stand' as const, status: 'optimal' as const, currentLoad: 95, capacity: 20000, waitTime: 0, risk: 'Low' as const },
  
  'vip-area': { id: 'vip-area', name: 'VIP Lounge', type: 'facility' as const, status: 'optimal' as const, currentLoad: 10, capacity: 500, waitTime: 0, risk: 'Low' as const },
  'medical-center': { id: 'medical-center', name: 'Medical Center', type: 'facility' as const, status: 'optimal' as const, currentLoad: 1, capacity: 30, waitTime: 1, risk: 'Low' as const },
  'security-office': { id: 'security-office', name: 'Security HQ', type: 'facility' as const, status: 'optimal' as const, currentLoad: 4, capacity: 50, waitTime: 0, risk: 'None' as const },
  'food-court-a': { id: 'food-court-a', name: 'Food Court A', type: 'facility' as const, status: 'optimal' as const, currentLoad: 15, capacity: 600, waitTime: 1, risk: 'Low' as const },
  'food-court-b': { id: 'food-court-b', name: 'Food Court B', type: 'facility' as const, status: 'optimal' as const, currentLoad: 12, capacity: 600, waitTime: 1, risk: 'Low' as const },
  'restrooms': { id: 'restrooms', name: 'Restrooms East', type: 'utility' as const, status: 'optimal' as const, currentLoad: 2, capacity: 100, waitTime: 1, risk: 'Low' as const },
  
  'transit-station': { id: 'transit-station', name: 'Transit Hub', type: 'transit' as const, status: 'optimal' as const, currentLoad: 80, capacity: 5000, waitTime: 2, risk: 'Low' as const },
  'parking-lot': { id: 'parking-lot', name: 'Parking Lot East', type: 'transit' as const, status: 'optimal' as const, currentLoad: 150, capacity: 3000, waitTime: 0, risk: 'Low' as const },
};

export function updateTimelineState(minute: number, state: StadiumState, events: PredictionEvent[]): { state: StadiumState; events: PredictionEvent[] } {
  // Deep clone state to prevent reference issues
  const newState = JSON.parse(JSON.stringify(state)) as StadiumState;
  newState.elapsedMinutes = minute;
  
  // Calculate simulated game clock timestamp from simulated minutes
  const startHour = 19;
  const totalMinutes = startHour * 60 + minute;
  const currentHour = Math.floor(totalMinutes / 60) % 24;
  const currentMin = totalMinutes % 60;
  newState.timestamp = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;

  // Deterministic events timeline
  if (minute >= 0 && minute < 5) {
    newState.globalSafetyScore = 99;
  } else if (minute >= 5 && minute < 10) {
    // Fans arriving normally
    newState.zones['gate-a'].currentLoad = 400;
    newState.zones['gate-b'].currentLoad = 380;
    newState.zones['gate-c'].currentLoad = 410;
    newState.zones['gate-d'].currentLoad = 350;
    newState.globalSafetyScore = 98;
  } else if (minute >= 10 && minute < 15) {
    // Parking busy
    newState.zones['parking-lot'].currentLoad = 2200;
    newState.zones['parking-lot'].status = 'warning';
    newState.zones['parking-lot'].risk = 'Medium';
    newState.globalSafetyScore = 96;

    if (!events.find(e => e.id === 'evt-parking')) {
      events.unshift({
        id: 'evt-parking',
        title: 'Parking Lot Approaching Capacity',
        triggerTime: newState.timestamp,
        timeOffset: 0,
        severity: 'warning',
        probability: 95,
        reasoning: 'Vehicle arrival rates exceeding exit flow indices.',
        currentPhase: 'detection',
        playbook: { steps: [] },
        resolved: false
      });
    }
  } else if (minute >= 15 && minute < 20) {
    // Transit station busy
    newState.zones['transit-station'].currentLoad = 3800;
    newState.zones['transit-station'].status = 'warning';
    newState.zones['transit-station'].risk = 'Medium';
    newState.zones['transit-station'].waitTime = 10;
    newState.globalSafetyScore = 94;

    if (!events.find(e => e.id === 'evt-transit')) {
      events.unshift({
        id: 'evt-transit',
        title: 'Transit Terminal Surge Detected',
        triggerTime: newState.timestamp,
        timeOffset: 0,
        severity: 'warning',
        probability: 90,
        reasoning: 'Arrival train passengers unloading faster than baseline dispersal rate.',
        currentPhase: 'detection',
        playbook: { steps: [] },
        resolved: false
      });
    }
  } else if (minute >= 20 && minute < 30) {
    // Gate C scanner slows down + warning starts forming
    newState.zones['gate-c'].currentLoad = 1100;
    newState.zones['gate-c'].waitTime = 20;
    newState.zones['gate-c'].status = 'warning';
    newState.zones['gate-c'].risk = 'Medium';
    newState.globalSafetyScore = 91;

    if (!events.find(e => e.id === 'evt-gate-c')) {
      events.unshift({
        id: 'evt-gate-c',
        title: 'Gate C Queue Congestion Warning',
        triggerTime: newState.timestamp,
        timeOffset: 0,
        severity: 'warning',
        probability: 88,
        reasoning: 'Scanner hardware latency combined with transit surge accumulation.',
        currentPhase: 'detection',
        playbook: { steps: [] },
        resolved: false
      });
    }
  } else if (minute >= 30 && minute < 35) {
    // Gate C critical
    newState.zones['gate-c'].currentLoad = 1450;
    newState.zones['gate-c'].waitTime = 45;
    newState.zones['gate-c'].status = 'critical';
    newState.zones['gate-c'].risk = 'High';
    newState.globalSafetyScore = 82;

    const gateCEvt = events.find(e => e.id === 'evt-gate-c');
    if (gateCEvt) {
      gateCEvt.severity = 'critical';
      gateCEvt.title = 'CRITICAL: Gate C Crowd Congestion Alert';
    }
  } else if (minute >= 35 && minute < 40) {
    // Food Court B becomes crowded
    newState.zones['food-court-b'].currentLoad = 580;
    newState.zones['food-court-b'].status = 'warning';
    newState.zones['food-court-b'].waitTime = 22;
    newState.zones['food-court-b'].risk = 'Medium';
    newState.globalSafetyScore = 80;

    if (!events.find(e => e.id === 'evt-food-b')) {
      events.unshift({
        id: 'evt-food-b',
        title: 'Concession Stand B Supply Queue Alert',
        triggerTime: newState.timestamp,
        timeOffset: 0,
        severity: 'warning',
        probability: 85,
        reasoning: 'High transactional density and inventory run-rate depletion warning.',
        currentPhase: 'detection',
        playbook: { steps: [] },
        resolved: false
      });
    }
  } else if (minute >= 40 && minute < 45) {
    // Medical incident
    newState.zones['medical-center'].currentLoad = 12;
    newState.zones['medical-center'].status = 'warning';
    newState.globalSafetyScore = 75;

    if (!events.find(e => e.id === 'evt-medical')) {
      events.unshift({
        id: 'evt-medical',
        title: 'Medical Assistance Dispatch',
        triggerTime: newState.timestamp,
        timeOffset: 0,
        severity: 'critical',
        probability: 99,
        reasoning: 'Heat exhaustion call received in East Stand Level 2.',
        currentPhase: 'detection',
        playbook: { steps: [] },
        resolved: false
      });
    }
  } else if (minute >= 45 && minute < 55) {
    // Halftime begins
    newState.zones['stand-north'].currentLoad = 8000;
    newState.zones['stand-south'].currentLoad = 7000;
    newState.zones['stand-east'].currentLoad = 9000;
    newState.zones['stand-west'].currentLoad = 8500;
    newState.zones['food-court-a'].currentLoad = 550;
    newState.zones['food-court-a'].status = 'warning';
    newState.zones['food-court-b'].currentLoad = 600;
    newState.zones['food-court-b'].status = 'critical';
    newState.globalSafetyScore = 78;
  } else if (minute >= 55 && minute < 65) {
    // Halftime crowd shifts
    newState.zones['food-court-a'].currentLoad = 200;
    newState.zones['food-court-a'].status = 'optimal';
    newState.zones['food-court-b'].currentLoad = 250;
    newState.zones['food-court-b'].status = 'optimal';
  } else if (minute >= 65 && minute < 75) {
    // Crowd returns to stands
    newState.zones['stand-north'].currentLoad = 17500;
    newState.zones['stand-south'].currentLoad = 16800;
    newState.zones['stand-east'].currentLoad = 19500;
    newState.zones['stand-west'].currentLoad = 19000;
    newState.globalSafetyScore = 95;
  } else if (minute >= 75 && minute < 85) {
    // Gate D overloaded
    newState.zones['gate-d'].currentLoad = 1180;
    newState.zones['gate-d'].status = 'critical';
    newState.zones['gate-d'].waitTime = 35;
    newState.zones['gate-d'].risk = 'High';
    newState.globalSafetyScore = 84;

    if (!events.find(e => e.id === 'evt-gate-d')) {
      events.unshift({
        id: 'evt-gate-d',
        title: 'Gate D Exit Flow Congestion',
        triggerTime: newState.timestamp,
        timeOffset: 0,
        severity: 'critical',
        probability: 92,
        reasoning: 'Premature departure waves crowding South-East corridors.',
        currentPhase: 'detection',
        playbook: { steps: [] },
        resolved: false
      });
    }
  } else if (minute >= 85 && minute < 90) {
    newState.globalSafetyScore = 90;
  } else if (minute >= 90 && minute < 95) {
    // Mass exit begins
    newState.zones['stand-north'].currentLoad = 8000;
    newState.zones['stand-south'].currentLoad = 7500;
    newState.zones['stand-east'].currentLoad = 9200;
    newState.zones['stand-west'].currentLoad = 8800;
    newState.zones['transit-station'].currentLoad = 4900;
    newState.zones['transit-station'].status = 'critical';
    newState.zones['gate-a'].currentLoad = 1150;
    newState.zones['gate-a'].status = 'warning';
    newState.zones['gate-b'].currentLoad = 1120;
    newState.zones['gate-b'].status = 'warning';
    newState.zones['gate-c'].currentLoad = 1480;
    newState.zones['gate-c'].status = 'critical';
    newState.globalSafetyScore = 70;
  } else if (minute >= 95) {
    // Sim complete - clear loads
    Object.keys(newState.zones).forEach((key) => {
      const z = newState.zones[key as keyof typeof newState.zones];
      z.currentLoad = 10;
      z.status = 'optimal';
      z.risk = 'Low';
    });
    newState.globalSafetyScore = 100;
  }

  // Calculate stadium occupancy based on stand loads
  const totalOccupancy = 
    newState.zones['stand-north'].currentLoad +
    newState.zones['stand-south'].currentLoad +
    newState.zones['stand-east'].currentLoad +
    newState.zones['stand-west'].currentLoad;
  
  return { state: newState, events };
}
