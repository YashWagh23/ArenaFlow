import React from 'react';
import { useTelemetry } from '../context/SocketContext';
import { useNavigate } from 'react-router-dom';

const scenariosList = [
  {
    id: 'metro-delay',
    title: 'Metro Delay',
    desc: 'Metro rail delay causing a passenger surge at outer gates.',
    icon: 'train',
    severity: 'critical',
  },
  {
    id: 'gate-scanner-failure',
    title: 'Gate Failure',
    desc: 'Hardware failure has taken out multiple turnstiles at Gate C.',
    icon: 'door_sensor',
    severity: 'critical',
  },
  {
    id: 'medical-emergency',
    title: 'Medical Emergency',
    desc: 'Cardiac emergency call received in Stand East Section 104.',
    icon: 'medical_services',
    severity: 'critical',
  },
  {
    id: 'heavy-rain',
    title: 'Heavy Rain',
    desc: 'Heavy rain is slowing pedestrian flow. Parking lot entry queues backing up.',
    icon: 'rainy',
    severity: 'warning',
  },
  {
    id: 'match-end',
    title: 'Match End',
    desc: 'Match complete. Spectators departing toward gates and transit lines.',
    icon: 'sports_soccer',
    severity: 'warning',
  },
];

export default function ScenarioSimulator() {
  const { triggerScenario } = useTelemetry();
  const navigate = useNavigate();

  const handleTrigger = (id: string) => {
    triggerScenario(id);
    // Navigate immediately to dashboard to see map updates and AI playbook
    navigate('/dashboard');
  };

  return (
    <div className="px-container-padding py-8 relative min-h-screen">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <section>
          <h1 className="font-headline-xl text-headline-xl text-on-surface">Scenario Simulator</h1>
          <p className="font-body-lg text-on-surface-variant max-w-2xl mt-2">
            Select and trigger live operational scenarios. Witness the real-time AI prediction, playbook generation, and Digital Twin mapping.
          </p>
        </section>

        {/* 5 Scenarios Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {scenariosList.map((scen) => (
            <div
              key={scen.id}
              className="glass-card rounded-[24px] p-6 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-[240px]"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary">
                    <span className="material-symbols-outlined text-3xl">{scen.icon}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md font-label-caps text-[10px] ${
                    scen.severity === 'critical' ? 'bg-error-container/20 text-critical-red' : 'bg-warning-amber/20 text-secondary'
                  }`}>
                    {scen.severity.toUpperCase()}
                  </span>
                </div>
                <h3 className="font-title-md text-title-md font-bold text-on-surface mb-2">{scen.title}</h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">{scen.desc}</p>
              </div>

              <button
                onClick={() => handleTrigger(scen.id)}
                className="w-full mt-4 py-2 bg-primary hover:bg-primary-container text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Trigger Scenario
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
