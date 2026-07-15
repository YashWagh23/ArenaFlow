export interface MetricZone {
  id: string;
  name: string;
  type: 'gate' | 'stand' | 'facility' | 'transit' | 'utility';
  currentLoad: number;
  capacity: number;
  status: 'optimal' | 'warning' | 'critical' | 'inactive';
  waitTime: number;
  risk: 'Low' | 'Medium' | 'High' | 'None';
}

export interface StadiumState {
  timestamp: string;
  elapsedMinutes: number;
  globalSafetyScore: number;
  zones: Record<string, MetricZone>;
}

export interface PlaybookStep {
  id: string;
  department: string;
  action: string;
  target: string;
  status: 'pending' | 'completed';
}

export type DecisionPhase = 'detection' | 'prediction' | 'playbook_generated' | 'operator_approval' | 'execution' | 'resolved';

export interface PredictionEvent {
  id: string;
  title: string;
  triggerTime: string;
  timeOffset: number;
  severity: 'warning' | 'critical';
  probability: number;
  reasoning: string;
  estimatedImpact?: string;
  departments?: string[];
  currentPhase: DecisionPhase;
  playbook: {
    steps: PlaybookStep[];
  };
  resolved: boolean;
}

export interface AppNotification {
  id: string;
  timestamp: string;
  icon: string;
  priority: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  unread: boolean;
}

export interface TimelineItem {
  id: string;
  timestamp: string;
  icon: string;
  title: string;
  severity: 'info' | 'warning' | 'critical';
  status: 'active' | 'resolved';
  zoneId?: string;
}

export interface StadiumAnalytics {
  avgGateWait: number;
  parkingCapacityPercent: number;
  transitLoadPercent: number;
  avgFoodQueue: number;
  medicalRequests: number;
  securityCalls: number;
  volunteersAvailable: number;
  activeIncidents: {
    total: number;
    critical: number;
    warning: number;
    resolved: number;
  };
  aiConfidence: {
    current: number;
    average: number;
    successRate: number;
  };
  crowdDistribution: {
    gates: number;
    seating: number;
    concessions: number;
    parking: number;
    transit: number;
  };
  executiveSummary: string;
}
