import React, { useState, useRef } from 'react';
import { ConstructorStanding } from '../types';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, 
  PieChart, Pie, Legend
} from 'recharts';

interface TeamsProps {
  standings: ConstructorStanding[];
  onCompare: (teamId: string) => void;
}

const TEAM_COLORS: Record<string, string> = {
  'red_bull': '#3671C6',
  'mercedes': '#27F4D2',
  'ferrari': '#E80020',
  'mclaren': '#FF8000',
  'aston_martin': '#229971',
  'alpine': '#0093CC',
  'williams': '#64C4FF',
  'rb': '#6692FF',
  'sauber': '#52E252',
  'haas': '#B6BABD'
};

const Teams: React.FC<TeamsProps> = ({ standings, onCompare }) => {
  const [telemetryTeam, setTelemetryTeam] = useState<ConstructorStanding | null>(null);
  const telemetryRef = useRef<HTMLDivElement | null>(null);

  useFocusTrap(telemetryRef, !!telemetryTeam);

  const pointsData = standings.map(s => ({
    name: s.Constructor.name,
    value: parseFloat(s.points),
    id: s.Constructor.constructorId
  })).filter(d => d.value > 0);

  const winsData = standings.map(s => ({
    name: s.Constructor.name,
    value: parseInt(s.wins),
    id: s.Constructor.constructorId
  })).filter(d => d.value > 0);

  const leaderPoints = parseFloat(standings[0]?.points || '0');
  const gapData = standings.map(s => ({
    name: s.Constructor.name,
    points: parseFloat(s.points),
    gap: leaderPoints - parseFloat(s.points),
    id: s.Constructor.constructorId
  })).slice(0, 10);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[var(--bg-card)] border border-[var(--border-ui)] p-3 shadow-2xl">
          <p className="text-[10px] font-orbitron font-black text-[var(--text-muted)] uppercase mb-1">{payload[0].name}</p>
          <p className="text-sm font-black text-[var(--rbr-yellow)] italic">{payload[0].value || payload[0].payload.points} POINTS</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 animate-broadcast">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-[var(--border-ui)] pb-6">
        <div>
          <h2 className="font-titillium text-5xl font-black italic uppercase tracking-tighter text-[var(--text-main)]">
            CONSTRUCTOR <span className="text-[var(--rbr-red)]">INTELLIGENCE</span>
          </h2>
          <p className="text-[var(--text-muted)] text-[10px] font-orbitron font-bold uppercase tracking-[0.3em] mt-2">Team Technical Comparison & Global Standings Index</p>
        </div>
        <div className="flex items-center space-x-4 pb-1">
          <div className="text-right">
             <div className="text-[9px] font-orbitron font-black text-[var(--text-muted)] opacity-30 uppercase tracking-widest">Signal Integrity</div>
             <div className="flex space-x-1 mt-1">
                {[...Array(5)].map((_, i) => <div key={i} className="w-3 h-1 bg-green-500/40"></div>)}
             </div>
          </div>
        </div>
      </div>

      {/* ANALYTICS COMMAND CENTER */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="panel-3d p-6 min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-orbitron font-black text-[var(--text-muted)] uppercase tracking-widest">Points Dominance Share</h3>
            <div className="w-2 h-2 rounded-full bg-[var(--rbr-red)] animate-pulse"></div>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pointsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={4}
                  dataKey="value"
                  stroke="none"
                >
                  {pointsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={TEAM_COLORS[entry.id] || '#88888822'} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {pointsData.slice(0, 4).map(team => (
              <div key={team.name} className="flex items-center space-x-2">
                <div className="w-2 h-2" style={{ backgroundColor: TEAM_COLORS[team.id] }}></div>
                <span className="text-[9px] font-black uppercase text-[var(--text-muted)] truncate">{team.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel-3d p-6 min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-orbitron font-black text-[var(--text-muted)] uppercase tracking-widest">Victory Allocation</h3>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={winsData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  stroke="var(--bg-card)"
                  strokeWidth={2}
                  label={({ name, percent }) => percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''}
                  labelLine={false}
                >
                  {winsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={TEAM_COLORS[entry.id] || '#88888822'} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  content={({ payload }) => (
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                      {payload?.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center space-x-1">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }}></div>
                          <span className="text-[8px] font-bold text-[var(--text-muted)] opacity-50 uppercase">{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="panel-3d p-6 min-h-[400px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[10px] font-orbitron font-black text-[var(--text-muted)] uppercase tracking-widest">Performance Gap To Leader</h3>
            <span className="text-[9px] font-black text-[var(--rbr-yellow)]">DELTA (PTS)</span>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gapData} layout="vertical" margin={{ left: 0, right: 30 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" hide />
                <Tooltip cursor={{ fill: 'transparent' }} content={({ active, payload }: any) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[var(--bg-card)] p-2 border border-[var(--border-ui)] shadow-xl">
                        <p className="text-[8px] font-black text-[var(--text-main)] uppercase">{payload[0].payload.name}</p>
                        <p className="text-xs font-black text-[var(--rbr-red)]">+{payload[0].value} PTS GAP</p>
                      </div>
                    );
                  }
                  return null;
                }} />
                <Bar dataKey="gap" radius={[0, 4, 4, 0]} barSize={20}>
                  {gapData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.gap === 0 ? 'var(--rbr-yellow)' : 'var(--bg-panel)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1">
             {gapData.slice(0, 5).map(team => (
               <div key={team.name} className="flex justify-between items-center text-[10px] font-bold">
                 <span className="text-[var(--text-muted)] uppercase">{team.name}</span>
                 <span className={team.gap === 0 ? 'text-[var(--rbr-yellow)]' : 'text-[var(--text-main)]'}>
                   {team.gap === 0 ? 'LEADER' : `+${team.gap}`}
                 </span>
               </div>
             ))}
          </div>
        </div>
      </div>

      {/* Constructor Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {standings.map((s) => {
          const cid = s.Constructor.constructorId;
          const tColor = TEAM_COLORS[cid] || '#888888';
          
          return (
            <div key={cid} role="button" tabIndex={0} aria-label={`Open telemetry for ${s.Constructor.name}`} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTelemetryTeam(s); } }}
 className="panel-3d group cursor-pointer hover:scale-[1.02] transition-all duration-300 focus-visible:ring-2 focus-visible:ring-[var(--rbr-yellow)]" style={{ borderLeft: `4px solid ${tColor}` }}>
              <div className="p-8 relative overflow-hidden">
                <div className="absolute top-[0px] right-[10px] font-orbitron text-9xl opacity-5 group-hover:opacity-10 transition-opacity font-black italic select-none pointer-events-none text-[var(--text-main)]">
                  {s.position}
                </div>
                
                <div className="flex justify-between items-start mb-6">
                  <div className="text-[10px] font-orbitron font-black uppercase tracking-[0.3em]" style={{ color: tColor }}>{s.Constructor.nationality}</div>
                  <div className="font-orbitron text-2xl font-black italic opacity-20 group-hover:opacity-100 transition-opacity text-[var(--text-main)]">P{s.position}</div>
                </div>

                <div className="text-3xl font-titillium font-black mb-8 tracking-tighter group-hover:text-[var(--rbr-yellow)] transition-colors uppercase italic leading-none text-[var(--text-main)]">{s.Constructor.name}</div>
                
                <div className="grid grid-cols-2 gap-8 border-t border-[var(--border-ui)] pt-6">
                  <div className="space-y-1">
                    <div className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-widest">Points Yield</div>
                    <div className="font-orbitron text-3xl font-black italic leading-none text-[var(--text-main)]">{s.points}</div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-widest">Grand Prix Wins</div>
                    <div className="font-orbitron text-3xl font-black italic text-[var(--rbr-red)] leading-none">{s.wins}</div>
                  </div>
                </div>
                
                <div className="mt-8 flex flex-col gap-3">
                   <button 
                    onClick={() => { setTelemetryTeam(s); }}
                    aria-label={`Open data stream for ${s.Constructor.name}`}
                    className="btn-industrial w-full !bg-[var(--text-main)]/5 !border-[var(--border-ui)] hover:!bg-[var(--rbr-red)] hover:!text-white focus-visible:ring-2 focus-visible:ring-[var(--rbr-yellow)]"
                  >Open Data Stream</button>
                   <button 
                    onClick={() => { onCompare(s.Constructor.constructorId); }}
                    aria-label={`View pilot pair for ${s.Constructor.name}`}
                    className="btn-industrial w-full !bg-transparent !border-transparent opacity-50 hover:opacity-100 focus-visible:ring-2 focus-visible:ring-[var(--rbr-yellow)]"
                  >View Pilot Pair</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Team Telemetry Modal */}
      {telemetryTeam && (
        <div className="modal-overlay" onClick={() => setTelemetryTeam(null)}>
          <div ref={telemetryRef} className="panel-3d w-full max-w-2xl animate-broadcast self-start" onClick={e => e.stopPropagation()}>
            <div className="px-10 py-8 bg-[var(--bg-panel)]/40 border-b border-[var(--border-ui)] flex justify-between items-center">
              <div>
                <div className="text-[10px] font-orbitron font-bold text-[var(--rbr-yellow)] uppercase tracking-[0.5em] mb-1">Deep Telemetry Link</div>
                <h3 className="text-4xl font-titillium font-black italic uppercase leading-none text-[var(--text-main)]">{telemetryTeam.Constructor.name}</h3>
              </div>
              <button onClick={() => { setTelemetryTeam(null); }} className="text-3xl text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">✕</button>
            </div>
            <div className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="panel-3d p-6 !bg-[var(--bg-panel)]/20">
                   <div className="text-[9px] font-black text-[var(--text-muted)] uppercase mb-2">Technical Grade</div>
                   <div className="font-orbitron text-3xl font-black text-[var(--accent-blue)]">
                    {telemetryTeam.position === '1' ? 'A+' : telemetryTeam.position === '2' ? 'A' : 'B+'}
                   </div>
                   <div className="text-[8px] uppercase mt-2 opacity-40 text-[var(--text-muted)]">Development Cycle Stability</div>
                </div>
                <div className="panel-3d p-6 !bg-[var(--bg-panel)]/20">
                   <div className="text-[9px] font-black text-[var(--text-muted)] uppercase mb-2">Efficiency Rating</div>
                   <div className="font-orbitron text-3xl font-black text-[var(--rbr-red)]">
                    {((parseFloat(telemetryTeam.points) / leaderPoints) * 100).toFixed(1)}%
                   </div>
                   <div className="text-[8px] uppercase mt-2 opacity-40 text-[var(--text-muted)]">Relative to Peak Chassis</div>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  { label: 'Aero Load Balance', val: 92, color: 'var(--rbr-red)' },
                  { label: 'Power Unit Thermal Sync', val: 87, color: 'var(--accent-blue)' },
                  { label: 'Tire Thermal Management', val: 95, color: 'var(--rbr-yellow)' }
                ].map((stat, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-[10px] uppercase font-black tracking-tighter text-[var(--text-main)]">
                      <span>{stat.label}</span>
                      <span style={{ color: `var(--${stat.color.includes('red') ? 'rbr-red' : stat.color.includes('blue') ? 'accent-blue' : 'rbr-yellow'})` }}>{stat.val}.{Math.floor(Math.random() * 9)}%</span>
                    </div>
                    <div className="h-1 bg-[var(--text-muted)]/10 rounded-full overflow-hidden">
                       <div className="h-full transition-all duration-1000" style={{ width: `${stat.val}%`, backgroundColor: `var(--${stat.color.includes('red') ? 'rbr-red' : stat.color.includes('blue') ? 'accent-blue' : 'rbr-yellow'})` }}></div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-[var(--bg-panel)]/40 border-l-4 border-[var(--rbr-red)]">
                <div className="text-[10px] font-black uppercase text-[var(--text-muted)] mb-3">Seasonal Intelligence Brief</div>
                <p className="text-xs font-medium leading-relaxed uppercase tracking-tight text-[var(--text-main)] italic">
                  Chassis performance analysis for {telemetryTeam.Constructor.name} indicates consistent optimization across high-downforce sectors. Recent telemetry suggests a {Math.floor(Math.random() * 10 + 2)}% gain in ERS harvesting efficiency. Projected season finish: P{telemetryTeam.position}.
                </p>
              </div>
            </div>
            <div className="px-10 pb-10">
               <button onClick={() => { setTelemetryTeam(null); }} className="w-full btn-industrial">Secure Terminal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;