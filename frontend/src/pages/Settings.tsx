import React, { useState } from 'react';

type Tab = 'general' | 'sensors' | 'ai' | 'staffing' | 'permissions';

const tabItems: { id: Tab; icon: string; label: string }[] = [
  { id: 'general', icon: 'tune', label: 'General' },
  { id: 'sensors', icon: 'sensors', label: 'Sensors' },
  { id: 'ai', icon: 'psychology', label: 'AI Models' },
  { id: 'staffing', icon: 'badge', label: 'Staffing' },
  { id: 'permissions', icon: '3p', label: 'Permissions' },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState<Tab>('general');
  const [incidentAutopilot, setIncidentAutopilot] = useState(true);
  const [emergencyLockdown, setEmergencyLockdown] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [stadiumName, setStadiumName] = useState('Azteca Main Hub');

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden">
      <div className="grid h-full" style={{ gridTemplateColumns: '280px 1fr' }}>

        {/* Category Navigation (Apple Settings style) */}
        <aside className="bg-surface-container-low/40 backdrop-blur-md border-r border-pearl/20 p-6 flex flex-col gap-1 overflow-y-auto">
          <h2 className="font-headline-lg text-lg px-4 mb-6 text-on-surface">Settings</h2>

          {tabItems.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left w-full ${
                activeTab === tab.id
                  ? 'bg-primary/10 text-primary border-r-4 border-primary'
                  : 'text-on-surface-variant hover:bg-white/40'
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}

          <div className="mt-auto pt-6 border-t border-outline-variant/30 px-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary-fixed">cloud_done</span>
              </div>
              <div>
                <p className="text-[10px] font-label-caps text-on-surface-variant">SYNC STATUS</p>
                <p className="text-xs font-semibold text-primary">Live Connection</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Configuration Panels */}
        <section className="p-10 overflow-y-auto bg-transparent scrollbar-thin">

          {/* GENERAL */}
          {activeTab === 'general' && (
            <div className="flex flex-col gap-8 max-w-5xl">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-headline-lg text-headline-lg text-on-surface">General Configuration</h1>
                  <p className="text-on-surface-variant mt-1">Global stadium parameters and branding preferences.</p>
                </div>
                <button className="bg-primary text-on-primary px-6 py-2 rounded-lg font-medium shadow-lg hover:scale-105 active:scale-95 transition-all">Save Changes</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-card-gap">
                {/* Stadium Identity */}
                <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4 shadow-sm">
                  <div className="flex items-center gap-3 text-primary">
                    <span className="material-symbols-outlined">stadium</span>
                    <h3 className="font-title-md">Stadium Identity</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-label-caps text-on-surface-variant">STADIUM NAME</label>
                      <input
                        className="bg-white/50 border border-pearl/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-on-surface"
                        type="text"
                        value={stadiumName}
                        onChange={e => setStadiumName(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-label-caps text-on-surface-variant">TIMEZONE</label>
                      <select className="bg-white/50 border border-pearl/50 rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none text-on-surface">
                        <option>America/Mexico_City (GMT-6)</option>
                        <option>UTC (Coordinated Universal Time)</option>
                        <option>Europe/Berlin (GMT+2)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Operational Protocol */}
                <div className="glass-panel p-6 rounded-3xl flex flex-col gap-4 shadow-sm">
                  <div className="flex items-center gap-3 text-secondary">
                    <span className="material-symbols-outlined">precision_manufacturing</span>
                    <h3 className="font-title-md">Operational Protocol</h3>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'Incident Autopilot', desc: 'AI suggests immediate resolution paths', state: incidentAutopilot, toggle: () => setIncidentAutopilot(!incidentAutopilot) },
                      { label: 'Emergency Lockdown', desc: 'Allow global lockdown via Command Hub', state: emergencyLockdown, toggle: () => setEmergencyLockdown(!emergencyLockdown) },
                    ].map(item => (
                      <div key={item.label} className="flex items-center justify-between p-3 bg-white/40 rounded-2xl">
                        <div>
                          <p className="font-medium">{item.label}</p>
                          <p className="text-xs text-on-surface-variant">{item.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={item.state} onChange={item.toggle} />
                          <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Theme Selection */}
              <div className="grid grid-cols-12 gap-card-gap">
                <div className="col-span-12 md:col-span-8 glass-panel p-8 rounded-3xl shadow-sm">
                  <h3 className="font-title-md mb-6">Interface Theme & Assets</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'light' as const, icon: 'light_mode', label: 'Light Titanium', bg: 'bg-titanium-white', border: 'border-pearl' },
                      { id: 'dark' as const, icon: 'dark_mode', label: 'Pitch Black', bg: 'bg-slate', border: 'border-white/10' },
                      { id: 'system' as const, icon: 'contrast', label: 'System Adaptive', bg: 'bg-gradient-to-br from-primary/20 to-secondary/20', border: 'border-pearl' },
                    ].map(theme => (
                      <div
                        key={theme.id}
                        onClick={() => setSelectedTheme(theme.id)}
                        className={`border-2 p-4 rounded-2xl flex flex-col items-center gap-3 cursor-pointer transition-all ${selectedTheme === theme.id ? 'border-primary' : 'border-outline-variant'} ${theme.id === 'dark' ? 'bg-graphite text-white' : 'bg-white'}`}
                      >
                        <div className={`w-full h-24 ${theme.bg} rounded-lg flex items-center justify-center border ${theme.border}`}>
                          <span className={`material-symbols-outlined text-3xl ${theme.id === 'dark' ? 'text-white' : 'text-on-surface-variant'}`}>{theme.icon}</span>
                        </div>
                        <span className="font-medium text-sm">{theme.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-span-12 md:col-span-4 glass-panel p-8 rounded-3xl shadow-sm flex flex-col justify-center items-center text-center gap-4">
                  <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center border border-primary/20 relative">
                    <span className="material-symbols-outlined text-primary text-5xl">upload_file</span>
                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center border-2 border-white">
                      <span className="material-symbols-outlined text-sm">add</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-title-md">Stadium Branding</h4>
                    <p className="text-xs text-on-surface-variant mt-1">Upload SVG or High-res PNG for header logo replacement.</p>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-error-container/20 border border-error/20 p-8 rounded-3xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-title-md text-error flex items-center gap-2">
                      <span className="material-symbols-outlined">warning</span>
                      Command De-Authorization
                    </h3>
                    <p className="text-sm text-on-surface-variant mt-1">Removing de-authorization will disconnect all peripheral sensors and AI analysis.</p>
                  </div>
                  <button className="px-6 py-2 border border-error text-error rounded-xl hover:bg-error hover:text-white transition-all font-medium">Reset System</button>
                </div>
              </div>
            </div>
          )}

          {/* SENSORS */}
          {activeTab === 'sensors' && (
            <div className="flex flex-col gap-8 max-w-5xl">
              <div>
                <h1 className="font-headline-lg text-headline-lg text-on-surface">Sensor Ecosystem</h1>
                <p className="text-on-surface-variant mt-1">Manage 12,402 edge devices currently active in the stadium.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-card-gap">
                {[
                  { icon: 'videocam', bg: 'bg-primary/10', color: 'text-primary', badgeBg: 'bg-primary/20', badgeColor: 'text-primary', badge: 'HEALTHY', title: 'Vision Pro Arrays', desc: '842 8K cameras with skeletal tracking.', pct: '98%' },
                  { icon: 'thermostat', bg: 'bg-warning-amber/10', color: 'text-warning-amber', badgeBg: 'bg-warning-amber/20', badgeColor: 'text-secondary', badge: 'CALIBRATING', title: 'Thermal Mats', desc: 'Surface temperature sensors in high-traffic zones.', pct: '45%' },
                  { icon: 'contactless', bg: 'bg-critical-red/10', color: 'text-critical-red', badgeBg: 'bg-error-container', badgeColor: 'text-critical-red', badge: 'OFFLINE', title: 'NFC Gateways', desc: 'Main gate 4 sensors reporting connectivity error.', pct: '12%' },
                ].map(sensor => (
                  <div key={sensor.title} className="glass-panel p-6 rounded-3xl">
                    <div className="flex justify-between items-start mb-6">
                      <span className={`material-symbols-outlined ${sensor.color} ${sensor.bg} p-3 rounded-2xl`}>{sensor.icon}</span>
                      <span className={`text-xs font-label-caps ${sensor.badgeBg} ${sensor.badgeColor} px-2 py-1 rounded`}>{sensor.badge}</span>
                    </div>
                    <h4 className="font-title-md">{sensor.title}</h4>
                    <p className="text-sm text-on-surface-variant mt-2">{sensor.desc}</p>
                    <div className="mt-4 h-2 w-full bg-surface-variant rounded-full overflow-hidden">
                      <div className={`h-full ${sensor.color.replace('text-', 'bg-')}`} style={{ width: sensor.pct }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Sensor table */}
              <div className="glass-panel rounded-3xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-white/40">
                    <tr>
                      {['SENSOR ID', 'LOCATION', 'LATENCY', 'ACTIONS'].map(h => (
                        <th key={h} className="px-6 py-4 font-label-caps text-xs text-on-surface-variant">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-pearl/30">
                    {[
                      { id: 'VPC-AZ-992', loc: 'North Gate Upper Tier', latency: '12ms' },
                      { id: 'VPC-AZ-441', loc: 'VIP Lounge Corridor', latency: '8ms' },
                      { id: 'NFC-G4-001', loc: 'South Gate 4 – Offline', latency: '—' },
                    ].map(row => (
                      <tr key={row.id} className="hover:bg-white/20 transition-colors">
                        <td className="px-6 py-4 font-stats-numeric text-sm">{row.id}</td>
                        <td className="px-6 py-4 text-sm font-medium">{row.loc}</td>
                        <td className="px-6 py-4 text-sm text-primary">{row.latency}</td>
                        <td className="px-6 py-4"><span className="material-symbols-outlined text-on-surface-variant cursor-pointer">settings</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Placeholder tabs */}
          {(activeTab === 'ai' || activeTab === 'staffing' || activeTab === 'permissions') && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <span className="material-symbols-outlined text-6xl text-primary/30 mb-4 block">construction</span>
                <h2 className="font-headline-lg text-on-surface">{tabItems.find(t => t.id === activeTab)?.label}</h2>
                <p className="text-on-surface-variant mt-2">
                  {activeTab === 'ai' ? 'Advanced neural network parameters coming soon.' : activeTab === 'staffing' ? 'Manage security and hospitality personnel assignments.' : 'Configure role-based access for FIFA executives.'}
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
