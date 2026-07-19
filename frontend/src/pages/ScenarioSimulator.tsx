import React from 'react';
import { useTelemetry } from '../context/SocketContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

/* ── Scenario definitions — preserved from original ─────── */
const scenariosList = [
  {
    id: 'metro-delay',
    title: 'Metro Delay',
    desc: 'Metro rail delay causing a passenger surge at outer gates. Transit capacity drops as fans aggregate at transit platforms.',
    icon: 'train',
    severity: 'critical' as const,
    zones: 'East Gates · Transit Hub',
    eta: '3 min response',
    accentColor: '#C84A4A',
    accentDim: 'rgba(200,74,74,0.12)',
    accentBorder: 'rgba(200,74,74,0.20)',
  },
  {
    id: 'gate-scanner-failure',
    title: 'Gate Failure',
    desc: 'Hardware failure has taken out multiple turnstiles at Gate C. Inflow backlog rising with wait times approaching 45 minutes.',
    icon: 'door_sensor',
    severity: 'critical' as const,
    zones: 'Gate C · Concourse 3',
    eta: '5 min response',
    accentColor: '#FF6B2B',
    accentDim: 'rgba(255,107,43,0.12)',
    accentBorder: 'rgba(255,107,43,0.20)',
  },
  {
    id: 'medical-emergency',
    title: 'Medical Emergency',
    desc: 'Cardiac emergency call received in Stand East Section 104. Response time critical — must be under 4 minutes.',
    icon: 'medical_services',
    severity: 'critical' as const,
    zones: 'Stand East · Section 104',
    eta: '2 min response',
    accentColor: '#FF2D6B',
    accentDim: 'rgba(255,45,107,0.12)',
    accentBorder: 'rgba(255,45,107,0.20)',
  },
  {
    id: 'heavy-rain',
    title: 'Heavy Rain',
    desc: 'Heavy rain is slowing pedestrian flow. Parking lot entry queues backing up. Slip hazards across open concourses.',
    icon: 'rainy',
    severity: 'warning' as const,
    zones: 'Outer Concourse · Parking',
    eta: '4 min response',
    accentColor: '#C48A00',
    accentDim: 'rgba(196,138,0,0.12)',
    accentBorder: 'rgba(196,138,0,0.20)',
  },
  {
    id: 'match-end',
    title: 'Match End',
    desc: 'Match complete. 80,000+ spectators departing toward gates and transit lines simultaneously. Heavy surge anticipated.',
    icon: 'sports_soccer',
    severity: 'warning' as const,
    zones: 'All Gates · Transit Hub',
    eta: '6 min response',
    accentColor: '#6BCB6E',
    accentDim: 'rgba(107,203,110,0.10)',
    accentBorder: 'rgba(107,203,110,0.18)',
  },
];

export default function ScenarioSimulator() {
  const { triggerScenario } = useTelemetry();
  const navigate = useNavigate();

  // Preserved: exact original trigger logic
  const handleTrigger = (id: string) => {
    triggerScenario(id);
    navigate('/dashboard');
  };

  return (
    <div
      className="min-h-[calc(100vh-48px)] bg-[#F7F6F1] px-4 sm:px-6 lg:px-10 py-6 lg:py-10 pb-16"
    >
      <div className="max-w-[1200px] mx-auto">

        {/* ── Page Header ─────────────────────────────────── */}
        <div style={{ marginBottom: '56px' }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '10px',
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#2E7D32',
              display: 'block',
              marginBottom: '14px',
            }}
          >
            Simulation Lab
          </span>
          <h1
            style={{
              fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(40px, 5vw, 72px)',
              letterSpacing: '-0.05em',
              color: '#1C1C1C',
              lineHeight: 0.95,
              marginBottom: '20px',
            }}
          >
            Scenario<br />
            <span style={{ color: 'rgba(28,28,28,0.40)' }}>Simulator</span>
          </h1>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '16px',
              color: 'rgba(28,28,28,0.45)',
              lineHeight: 1.7,
              maxWidth: '520px',
            }}
          >
            Trigger live operational scenarios and witness real-time AI prediction,
            playbook generation, and Digital Twin mapping in action.
          </p>
        </div>

        {/* ── Scenario Cards ───────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenariosList.map((scen, i) => (
            <motion.div
              key={scen.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="glass-card"
              style={{
                background: 'rgba(0,0,0,0.03)',
                border: `1px solid rgba(0,0,0,0.07)`,
                borderLeft: `3px solid ${scen.accentColor}`,
                borderRadius: '16px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'all 220ms cubic-bezier(0.25,0.46,0.45,0.94)',
                display: 'flex',
                flexDirection: 'column',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = 'translateY(-4px)';
                el.style.background = 'rgba(0,0,0,0.05)';
                el.style.borderColor = 'rgba(0,0,0,0.12)';
                el.style.boxShadow = `0 16px 48px rgba(0,0,0,0.50), 0 0 0 1px ${scen.accentBorder}`;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.transform = 'translateY(0)';
                el.style.background = 'rgba(0,0,0,0.03)';
                el.style.borderColor = 'rgba(0,0,0,0.07)';
                el.style.boxShadow = 'none';
              }}
            >
              {/* Card top section */}
              <div style={{ padding: '28px 28px 20px' }}>
                {/* Severity + icon row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  {/* Icon */}
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '14px',
                      background: scen.accentDim,
                      border: `1px solid ${scen.accentBorder}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: '24px', color: scen.accentColor, fontVariationSettings: "'FILL' 1" }}
                    >
                      {scen.icon}
                    </span>
                  </div>

                  {/* Severity badge */}
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '8px',
                      fontWeight: 700,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: scen.accentColor,
                      background: scen.accentDim,
                      border: `1px solid ${scen.accentBorder}`,
                      borderRadius: '9999px',
                      padding: '3px 10px',
                    }}
                  >
                    {scen.severity}
                  </span>
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: "'Mona Sans', 'Hanken Grotesk', sans-serif",
                    fontWeight: 800,
                    fontSize: '20px',
                    letterSpacing: '-0.025em',
                    color: '#1C1C1C',
                    marginBottom: '10px',
                    lineHeight: 1.15,
                  }}
                >
                  {scen.title}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '13px',
                    color: 'rgba(28,28,28,0.45)',
                    lineHeight: 1.65,
                    marginBottom: '18px',
                  }}
                >
                  {scen.desc}
                </p>

                {/* Meta row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '11px', color: 'rgba(0,0,0,0.25)' }}>location_on</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 600, color: 'rgba(0,0,0,0.30)', letterSpacing: '0.04em' }}>{scen.zones}</span>
                  </div>
                  <span style={{ color: 'rgba(0,0,0,0.10)', fontSize: '10px' }}>·</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '11px', color: 'rgba(0,0,0,0.25)' }}>timer</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', fontWeight: 600, color: 'rgba(0,0,0,0.30)', letterSpacing: '0.04em' }}>{scen.eta}</span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', background: 'rgba(0,0,0,0.05)' }} />

              {/* Trigger button */}
              <div style={{ padding: '16px 28px' }}>
                <button
                  onClick={() => handleTrigger(scen.id)}
                  style={{
                    width: '100%',
                    minHeight: '44px',
                    padding: '11px 20px',
                    background: 'transparent',
                    border: `1px solid ${scen.accentBorder}`,
                    borderRadius: '10px',
                    color: scen.accentColor,
                    cursor: 'pointer',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    transition: 'all 180ms cubic-bezier(0.25,0.46,0.45,0.94)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.background = scen.accentDim;
                    el.style.borderColor = scen.accentColor;
                    el.style.boxShadow = `0 0 16px ${scen.accentColor}25`;
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLButtonElement;
                    el.style.background = 'transparent';
                    el.style.borderColor = scen.accentBorder;
                    el.style.boxShadow = 'none';
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '13px', fontVariationSettings: "'FILL' 1" }}>bolt</span>
                  Trigger Scenario
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
