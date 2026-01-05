import React, { useState, useEffect } from 'react';
import { DriverStanding, ConstructorStanding, Race } from '../types';

interface DashboardProps {
  driverStandings: DriverStanding[];
  constructorStandings: ConstructorStanding[];
  races: Race[];
  selectedYear: string;
}

interface Incident {
  id: number;
  type: 'SAFETY CAR' | 'VSC' | 'RETIREMENT' | 'YELLOW FLAG' | 'DRS ENABLED';
  description: string;
  lap: number;
  color: string;
}

interface TrackConditions {
  airTemp: number;
  trackTemp: number;
  humidity: number;
  pressure: number;
  grip: 'LOW' | 'OPTIMAL' | 'HIGH';
}

const Dashboard: React.FC<DashboardProps> = ({ driverStandings, constructorStandings, races, selectedYear }) => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [conditions, setConditions] = useState<TrackConditions>({
    airTemp: 24,
    trackTemp: 38,
    humidity: 45,
    pressure: 1012,
    grip: 'OPTIMAL'
  });

  const leader = driverStandings[0];
  const teamLeader = constructorStandings[0];
  
  const now = new Date();
  const nextRace = races.find(r => new Date(r.date) >= now) || races[races.length - 1];

  // Simulated Race Incidents Logic
  useEffect(() => {
    const possibleIncidents = [
      { type: 'SAFETY CAR', desc: 'DEBRIS ON TRACK (SECTOR 1)', color: '#FFD700' },
      { type: 'VSC', desc: 'RECOVERING STRANDED VEHICLE', color: '#FFD700' },
      { type: 'RETIREMENT', desc: 'ENGINE FAILURE DETECTED', color: '#D31336' },
      { type: 'YELLOW FLAG', desc: 'SPIN AT TURN 4', color: '#FFD700' },
      { type: 'DRS ENABLED', desc: 'OVERTAKING SYSTEM ACTIVE', color: '#4ADE80' }
    ];

    const generateIncident = () => {
      const template = possibleIncidents[Math.floor(Math.random() * possibleIncidents.length)];
      const driverName = driverStandings[Math.floor(Math.random() * Math.min(driverStandings.length, 10))]?.Driver.familyName || 'UNKNOWN';
      
      const newIncident: Incident = {
        id: Date.now(),
        type: template.type as any,
        description: template.type === 'RETIREMENT' ? `${driverName.toUpperCase()}: ${template.desc}` : template.desc,
        lap: Math.floor(Math.random() * 50) + 1,
        color: template.color
      };

      setIncidents(prev => [newIncident, ...prev].slice(0, 5));
      
      // Also fluctuate conditions slightly
      setConditions(prev => ({
        ...prev,
        trackTemp: prev.trackTemp + (Math.random() - 0.5),
        airTemp: prev.airTemp + (Math.random() - 0.5) * 0.2
      }));
    };

    // Initial incidents
    for(let i=0; i<3; i++) generateIncident();

    const interval = setInterval(generateIncident, 15000);
    return () => clearInterval(interval);
  }, [driverStandings]);

  // Simulated Tyre Wear for Top 5
  const simulatedTyreData = driverStandings.slice(0, 5).map((s, idx) => {
    const wear = 100 - (idx * 5) - (Math.random() * 10);
    const compound = idx % 2 === 0 ? 'SOFT' : (idx % 3 === 0 ? 'HARD' : 'MEDIUM');
    const color = compound === 'SOFT' ? '#D31336' : compound === 'MEDIUM' ? '#FFD700' : '#888888';
    return { name: s.Driver.familyName, wear, compound, color, laps: Math.floor(wear / 4) };
  });

  return (
    <div className="p-4 md:p-8 space-y-8 animate-broadcast">
      {/* Top Banner - Theme-aware Broadcast Graphics Style */}
      <div className="panel-3d p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-[#D31336]"></div>
        
        <div className="space-y-3 relative z-10">
          <div className="flex items-center space-x-3">
             <div className="px-2 py-0.5 bg-[#D31336] text-[10px] font-orbitron font-bold text-white uppercase rounded-sm">Live Feed</div>
             <div className="text-[10px] font-orbitron font-bold text-[var(--accent-blue)] tracking-widest uppercase opacity-80">Telemetry Active: {selectedYear} Season</div>
          </div>
          <h2 className="text-4xl md:text-6xl font-titillium font-black italic tracking-tighter uppercase leading-none">
            <span className="text-[var(--text-main)]">DELTA</span> <span className="text-[#D31336]">VIEW</span>
          </h2>
        </div>
        
        <div className="mt-6 md:mt-0 flex items-center space-x-6 relative z-10">
          <div className="text-right">
            <div className="text-[11px] font-orbitron font-bold text-[var(--text-muted)] uppercase tracking-widest mb-1">Target Circuit</div>
            <div className="text-xl md:text-3xl font-titillium font-black italic text-[var(--rbr-yellow)] uppercase tracking-tighter leading-tight">
              {nextRace?.Circuit.circuitName}
            </div>
            <div className="text-[10px] font-orbitron font-black text-[#D31336] uppercase tracking-widest">
              {nextRace?.Circuit.Location.locality.toUpperCase()}
            </div>
          </div>
          
          <div className="relative w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-[var(--border-ui)] opacity-50" />
            <div className="absolute inset-2 rounded-full border border-[var(--border-ui)] opacity-50" />
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[var(--bg-panel)] shadow-sm flex items-center justify-center border border-[var(--border-ui)]">
               <svg viewBox="0 0 100 100" className="w-8 h-8 opacity-40 text-[var(--text-main)]">
                 <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
                 <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="1" />
                 <path d="M50 20 V80 M20 50 H80" stroke="currentColor" strokeWidth="1" />
               </svg>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[var(--text-main)] rotate-45 translate-x-3 translate-y-3 opacity-10"></div>
      </div>

      {/* KPI Cards & Track Environment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
        {/* Track Environment Panel */}
        <div className="panel-3d p-6 bg-[var(--bg-panel)] border-t border-[var(--accent-blue)]/30 xl:col-span-1">
          <div className="text-[9px] font-orbitron font-black text-[var(--accent-blue)] uppercase tracking-[0.3em] mb-4">Environment</div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-[var(--text-muted)]">AIR</span>
              <span className="font-orbitron font-black text-[var(--text-main)]">{conditions.airTemp.toFixed(1)}°C</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-[var(--text-muted)]">TRACK</span>
              <span className="font-orbitron font-black text-[var(--rbr-yellow)]">{conditions.trackTemp.toFixed(1)}°C</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-[var(--text-muted)]">HUMIDITY</span>
              <span className="font-orbitron font-black text-[var(--text-main)]">{conditions.humidity}%</span>
            </div>
            <div className="pt-2 border-t border-[var(--border-ui)] flex justify-between items-center">
              <span className="text-[10px] font-bold text-[var(--text-muted)]">GRIP</span>
              <span className="text-[10px] font-black text-[#4ADE80] uppercase tracking-widest">{conditions.grip}</span>
            </div>
          </div>
        </div>

        {[
          { label: 'WDC Leader', value: leader ? leader.Driver.familyName : 'N/A', sub: `${leader?.points} PTS`, color: 'var(--rbr-yellow)' },
          { label: 'WCC Leader', value: teamLeader ? teamLeader.Constructor.name : 'N/A', sub: `${teamLeader?.points} PTS`, color: 'var(--rbr-red)' },
          { label: 'Rounds', value: races.length.toString(), sub: 'TOTAL SCHEDULE', color: 'var(--accent-blue)' },
          { label: 'Session Status', value: 'GREEN FLAG', sub: 'SIGNAL 200 OK', color: '#4ADE80' }
        ].map((card, idx) => (
          <div key={idx} className="panel-3d p-6 group cursor-default border-t border-[var(--border-ui)]">
            <div className="text-[9px] font-orbitron font-bold text-[var(--text-muted)] uppercase tracking-[0.3em] mb-4">{card.label}</div>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-titillium font-black italic group-hover:text-[var(--text-main)] transition-colors uppercase leading-none">{card.value}</div>
              <div className="text-[10px] font-orbitron font-bold" style={{ color: card.color }}>{card.sub}</div>
            </div>
            <div className="mt-4 h-[2px] w-full bg-[var(--bg-panel)] overflow-hidden">
               <div className="h-full bg-current transition-all duration-1000 w-2/3" style={{ color: card.color }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* STANDINGS & SIDELINE */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Timing Tower - Drivers */}
        <div className="xl:col-span-2 panel-3d overflow-hidden">
          <div className="px-6 py-4 bg-[var(--bg-panel)]/30 flex justify-between items-center border-b border-[var(--border-ui)]">
            <h3 className="font-titillium font-black italic text-sm uppercase tracking-widest">Global Driver Standings</h3>
            <div className="flex space-x-1">
              <div className="w-1 h-3 bg-[#D31336]"></div>
              <div className="w-1 h-3 bg-[var(--text-muted)] opacity-20"></div>
              <div className="w-1 h-3 bg-[var(--text-muted)] opacity-20"></div>
            </div>
          </div>
          <div className="p-4 overflow-x-auto">
            <table className="w-full timing-monitor min-w-[600px]">
              <thead className="text-[10px] font-orbitron font-bold text-[var(--text-muted)] uppercase">
                <tr>
                  <th className="text-left w-12">Pos</th>
                  <th className="text-left">Pilot</th>
                  <th className="text-left">Chassis</th>
                  <th className="text-right">Points</th>
                </tr>
              </thead>
              <tbody className="font-bold">
                {driverStandings.slice(0, 10).map((s) => (
                  <tr key={s.Driver.driverId} className="group">
                    <td className="text-center">
                      <span className={`text-xl font-orbitron italic ${s.position === '1' ? 'text-[var(--rbr-yellow)]' : 'text-[var(--text-muted)] opacity-50'}`}>
                        {s.position}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="w-1 h-8 bg-[#D31336] group-hover:w-2 transition-all"></div>
                        <div>
                          <div className="text-sm uppercase tracking-tighter leading-none">{s.Driver.givenName} <span className="text-[var(--text-main)] text-lg group-hover:text-white">{s.Driver.familyName.toUpperCase()}</span></div>
                          <div className="text-[8px] font-orbitron text-[var(--text-muted)] tracking-widest uppercase mt-0.5">{s.Driver.nationality}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest">{s.Constructors[0]?.name}</td>
                    <td className="text-right font-orbitron text-2xl text-[var(--accent-blue)]">{s.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side Monitor - Teams */}
        <div className="panel-3d overflow-hidden">
          <div className="px-6 py-4 bg-[var(--bg-panel)]/30 border-b border-[var(--border-ui)]">
            <h3 className="font-titillium font-black italic text-sm uppercase tracking-widest">Team Constructors</h3>
          </div>
          <div className="p-4 space-y-3">
            {constructorStandings.slice(0, 10).map((s) => (
              <div key={s.Constructor.constructorId} className="flex items-center p-4 bg-[var(--bg-panel)]/40 hover:bg-[var(--bg-panel)] transition-all rounded-sm border-l-2 border-transparent hover:border-[var(--rbr-yellow)] group">
                <div className="flex-none w-12 text-center font-orbitron text-[var(--text-muted)] opacity-50 group-hover:opacity-100 group-hover:text-[var(--rbr-yellow)] transition-all">{s.position}</div>
                <div className="flex-1">
                  <div className="text-xs font-black uppercase italic tracking-tighter group-hover:translate-x-1 transition-transform">{s.Constructor.name}</div>
                  <div className="h-1 w-full bg-[var(--bg-main)]/50 mt-2 rounded-full overflow-hidden">
                    <div className="h-full bg-[#D31336]" style={{ width: `${(parseFloat(s.points) / parseFloat(constructorStandings[0]?.points || '1')) * 100}%` }}></div>
                  </div>
                </div>
                <div className="ml-4 font-orbitron text-sm text-[#D31336]">{s.points}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RACE MONITOR & TYRE LIFE */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center space-x-4 mb-2">
            <div className="h-4 w-1 bg-[var(--rbr-yellow)]"></div>
            <h3 className="text-[11px] font-orbitron font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">Race Incident Monitor</h3>
          </div>
          <div className="space-y-2">
            {incidents.map((incident) => (
              <div 
                key={incident.id} 
                className="panel-3d flex items-center p-4 border-l-4 animate-in"
                style={{ borderLeftColor: incident.color }}
              >
                <div className="flex-none w-20 font-orbitron text-xs font-black text-[var(--text-muted)] opacity-40">LAP {incident.lap}</div>
                <div className="flex-none w-40 font-orbitron font-black text-sm mr-4" style={{ color: incident.color === '#FFD700' ? 'var(--rbr-yellow)' : incident.color }}>{incident.type}</div>
                <div className="flex-grow font-titillium font-bold italic uppercase tracking-wider text-sm">{incident.description}</div>
                <div className="hidden sm:block flex-none text-[8px] font-orbitron font-bold text-[var(--text-muted)] opacity-20 uppercase tracking-widest">Live Signal</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tyre Life Monitor */}
        <div className="space-y-4">
          <div className="flex items-center space-x-4 mb-2">
            <div className="h-4 w-1 bg-[#D31336]"></div>
            <h3 className="text-[11px] font-orbitron font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">Tyre Life Sim</h3>
          </div>
          <div className="panel-3d p-6 space-y-6 !bg-[var(--bg-panel)]/30">
            {simulatedTyreData.map((tyre, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-end">
                  <div className="font-titillium font-black italic uppercase text-xs tracking-tighter">{tyre.name}</div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tyre.color === '#888888' ? 'var(--text-muted)' : tyre.color }}></div>
                    <span className="text-[9px] font-orbitron font-bold text-[var(--text-muted)] uppercase">{tyre.compound}</span>
                  </div>
                </div>
                <div className="h-2 bg-[var(--bg-panel)] rounded-full overflow-hidden flex">
                  <div 
                    className="h-full transition-all duration-1000 ease-out" 
                    style={{ 
                      width: `${tyre.wear}%`, 
                      backgroundColor: tyre.wear < 30 ? '#D31336' : tyre.wear < 60 ? 'var(--rbr-yellow)' : '#4ADE80' 
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-[8px] font-orbitron font-bold text-[var(--text-muted)] uppercase">
                  <span>Health: {tyre.wear.toFixed(0)}%</span>
                  <span>Est. {tyre.laps} Laps Remaining</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;