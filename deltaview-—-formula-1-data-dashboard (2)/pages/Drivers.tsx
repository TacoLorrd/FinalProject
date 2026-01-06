import React, { useState, useMemo, useEffect, useRef } from 'react';
import { DriverStanding } from '../types';
import { useFocusTrap } from '../hooks/useFocusTrap';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface DriversProps {
  standings: DriverStanding[];
  selectedYear: string;
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

const calculateAge = (dob: string) => {
  if (!dob) return 'N/A';
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return age;
};

const Drivers: React.FC<DriversProps> = ({ standings, selectedYear }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'points' | 'wins'>('points');
  const [selectedDriver, setSelectedDriver] = useState<DriverStanding | null>(null);
  const [showBio, setShowBio] = useState(false);

  const isMediumMode = document.body.classList.contains('medium-mode');

  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useFocusTrap(modalRef, !!selectedDriver);

  useEffect(() => {
    if (selectedDriver) {
      // Focus the close button when dialog opens for keyboard users
      setTimeout(() => closeButtonRef.current?.focus(), 0);
    }
  }, [selectedDriver]);

  const filtered = useMemo(() => {
    return standings
      .filter(s => 
        s.Driver.givenName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.Driver.familyName.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'points') return parseFloat(b.points) - parseFloat(a.points);
        return parseFloat(b.wins) - parseFloat(a.wins);
      });
  }, [standings, searchTerm, sortBy]);

  const getRadarData = (driver: DriverStanding) => {
    const pos = parseInt(driver.position);
    const base = 100 - (pos * 2);
    const seed = driver.Driver.driverId.length;
    
    return [
      { subject: 'SPEED', A: Math.max(60, base + (seed % 10)), fullMark: 100 },
      { subject: 'CRAFT', A: Math.max(65, base + ((seed * 2) % 15)), fullMark: 100 },
      { subject: 'TIRES', A: Math.max(70, base - (seed % 12)), fullMark: 100 },
      { subject: 'QUALY', A: Math.max(60, base + ((seed * 3) % 20)), fullMark: 100 },
      { subject: 'RELIABILITY', A: Math.max(75, base + ((seed * 7) % 10)), fullMark: 100 },
    ];
  };

  return (
    <div className="p-4 md:p-8 space-y-6 animate-broadcast">
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div>
          <h2 className="font-titillium text-4xl font-black italic uppercase tracking-tighter leading-none">
            DRIVE <span className="text-[var(--rbr-red)]">TELEMETRY</span>
          </h2>
          <p className="text-[var(--text-muted)] text-[10px] font-orbitron font-bold uppercase tracking-[0.2em] mt-2">Active Field Verification Index</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto items-center">
          <input 
            id="driver-search"
            aria-label="Search drivers"
            type="text"
            placeholder="Search Pilot..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 md:w-64 bg-[var(--bg-panel)] border border-[var(--border-ui)] rounded-none px-4 py-2 text-sm focus:border-[var(--rbr-yellow)] outline-none font-bold text-[var(--text-main)] focus-visible:ring-2 focus-visible:ring-[var(--rbr-yellow)]"
          />
          <select 
            id="driver-sort"
            aria-label="Sort drivers"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[var(--bg-panel)] border border-[var(--border-ui)] px-4 py-2 text-xs font-black uppercase outline-none cursor-pointer text-[var(--text-main)] focus-visible:ring-2 focus-visible:ring-[var(--rbr-yellow)]"
          >
            <option value="points">Sort: PTS</option>
            <option value="wins">Sort: WINS</option>
          </select>

          <button
            onClick={() => {
              const csvRows = [
                ['Number','Given Name','Family Name','Team','Nationality','Age','Pts','Wins','Position']
              ];
              filtered.forEach(s => {
                csvRows.push([
                  s.Driver.permanentNumber || '',
                  s.Driver.givenName,
                  s.Driver.familyName,
                  s.Constructors[0]?.name || '',
                  s.Driver.nationality || '',
                  calculateAge(s.Driver.dateOfBirth),
                  s.points,
                  s.wins,
                  s.position
                ]);
              });
              const csvContent = csvRows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
              const blob = new Blob([csvContent], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `drivers_${selectedYear}.csv`;
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(url);
            }}
            className="px-4 py-2 bg-[var(--rbr-yellow)] text-black font-bold uppercase tracking-[0.15em] text-xs"
            aria-label="Download visible drivers as CSV"
          >Export CSV</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((s) => {
          const constructorId = s.Constructors[0]?.constructorId || 'unknown';
          const teamColor = TEAM_COLORS[constructorId] || '#FFFFFF';
          const age = calculateAge(s.Driver.dateOfBirth);
          
          return (
            <div 
              key={s.Driver.driverId} 
              role="button"
              tabIndex={0}
              aria-label={`Open ${s.Driver.givenName} ${s.Driver.familyName} details`}
              onClick={() => { setSelectedDriver(s); setShowBio(false); }}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedDriver(s); setShowBio(false); } }}
              className="panel-3d group cursor-pointer hover:scale-[1.02] transition-all duration-300 relative focus-visible:ring-2 focus-visible:ring-[var(--rbr-yellow)]"
              style={{ 
                borderLeft: `6px solid ${teamColor}`,
              } as React.CSSProperties}
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="font-orbitron text-4xl font-black italic opacity-20 group-hover:opacity-100 transition-all leading-none" style={{ color: teamColor }}>
                    #{s.Driver.permanentNumber}
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-orbitron font-bold text-[var(--text-muted)] uppercase tracking-widest">RANK</div>
                    <div className="font-orbitron text-xl font-black italic group-hover:text-[var(--rbr-yellow)]">P{s.position}</div>
                  </div>
                </div>

                <div className="space-y-0.5 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-tighter">{s.Driver.givenName}</div>
                    <div className="text-[9px] font-black text-[var(--text-muted)] opacity-40 uppercase tracking-widest">{s.Driver.nationality}</div>
                  </div>
                  <div className="text-2xl font-titillium font-black uppercase italic tracking-tighter leading-none group-hover:text-[var(--text-main)] transition-colors">{s.Driver.familyName}</div>
                  <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: teamColor }}>{s.Constructors[0]?.name}</div>
                </div>

                <div className="grid grid-cols-3 gap-2 py-4 border-y border-[var(--border-ui)] bg-[var(--bg-panel)]/30 -mx-6 px-6">
                  <div className="text-center">
                    <div className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-tighter">WINS</div>
                    <div className="font-orbitron text-lg font-black text-[var(--rbr-red)]">{s.wins}</div>
                  </div>
                  <div className="text-center border-x border-[var(--border-ui)]">
                    <div className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-tighter">AGE</div>
                    <div className="font-orbitron text-lg font-black text-[var(--text-main)]">{age}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-tighter">PTS</div>
                    <div className="font-orbitron text-lg font-black text-[var(--rbr-yellow)]">{s.points}</div>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                   <div className="text-[8px] font-bold text-[var(--text-muted)] opacity-30 uppercase tracking-[0.4em]">Live Telemetry</div>
                   <div className="text-[9px] font-black text-[var(--rbr-yellow)] opacity-0 group-hover:opacity-100 transition-opacity">VIEW ANALYTICS →</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedDriver && (
        <div className="modal-overlay" onClick={() => setSelectedDriver(null)} role="dialog" aria-modal="true" aria-labelledby="driver-dialog-title" tabIndex={-1} onKeyDown={(e) => { if (e.key === 'Escape') { setSelectedDriver(null); } }}>
          <div ref={modalRef} className="panel-3d w-full max-w-4xl animate-broadcast self-start" onClick={e => e.stopPropagation()}>
            <div className="relative h-64 bg-gradient-to-br from-[var(--bg-panel)] to-[var(--bg-main)] flex items-center p-8 overflow-hidden" role="img" aria-label={`Performance profile and data for ${selectedDriver.Driver.givenName} ${selectedDriver.Driver.familyName}`} aria-describedby="driver-radar-desc">
              <div 
                className="absolute top-0 right-0 w-1/2 h-full opacity-10 font-orbitron text-[15rem] font-black italic select-none"
                style={{ color: TEAM_COLORS[selectedDriver.Constructors[0]?.constructorId] }}
              >
                {selectedDriver.Driver.permanentNumber}
              </div>
              
              <div className="relative z-10 flex items-center space-x-6 md:space-x-10">
                <div 
                  className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center font-orbitron text-4xl md:text-6xl font-black text-white transform -skew-x-12 shadow-2xl"
                  style={{ backgroundColor: TEAM_COLORS[selectedDriver.Constructors[0]?.constructorId] || '#D31336' }}
                >
                  {selectedDriver.Driver.code}
                </div>
                <div>
                  <div className="text-[10px] font-orbitron font-bold text-[var(--rbr-yellow)] tracking-[0.5em] uppercase mb-2">Technical Pilot Data</div>
                  <h3 id="driver-dialog-title" className="text-4xl md:text-6xl font-titillium font-black italic uppercase tracking-tighter leading-none text-[var(--text-main)]">
                    {selectedDriver.Driver.givenName} <span className="text-[var(--rbr-red)]">{selectedDriver.Driver.familyName}</span>
                  </h3>
                  <div className="flex items-center space-x-4 md:space-x-6 mt-4">
                     <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">#{selectedDriver.Driver.permanentNumber}</span>
                     <span className="w-1.5 h-1.5 rounded-full bg-[var(--text-muted)]/20"></span>
                     <span className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: TEAM_COLORS[selectedDriver.Constructors[0]?.constructorId] }}>{selectedDriver.Constructors[0]?.name}</span>
                  </div>
                </div>
              </div>
              <button 
                ref={closeButtonRef}
                onClick={() => setSelectedDriver(null)}
                className="absolute top-6 right-8 text-[var(--text-muted)] hover:text-[var(--text-main)] text-3xl font-light z-20 focus-visible:ring-2 focus-visible:ring-[var(--rbr-yellow)]"
                aria-label="Close driver details dialog"
              >✕</button>
            </div>

            <div className="p-6 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Performance Radar */}
                <div className="panel-3d p-6 !bg-[var(--bg-panel)]/30 flex flex-col items-center">
                  <div className="text-[10px] font-orbitron font-black text-[var(--rbr-yellow)] uppercase tracking-[0.3em] mb-6 w-full text-center">Performance Profile</div>
                  <div className="w-full h-64">
                    <div id="driver-radar-desc" className="sr-only">Radar chart showing performance metrics for the selected driver.</div>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={getRadarData(selectedDriver)} aria-label={`Performance radar chart for ${selectedDriver.Driver.givenName} ${selectedDriver.Driver.familyName}`} role="img">
                        <PolarGrid stroke={isMediumMode ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"} />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: isMediumMode ? '#0F172A' : '#94A3B8', fontSize: 10, fontWeight: 800 }} />
                        <Radar
                          name={selectedDriver.Driver.familyName}
                          dataKey="A"
                          stroke={TEAM_COLORS[selectedDriver.Constructors[0]?.constructorId] || '#D31336'}
                          fill={TEAM_COLORS[selectedDriver.Constructors[0]?.constructorId] || '#D31336'}
                          fillOpacity={0.4}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="space-y-8">
                  {showBio ? (
                    <div className="space-y-6 animate-broadcast">
                      <div className="flex items-center justify-between border-b border-[var(--border-ui)] pb-4">
                        <h4 className="font-titillium font-black italic uppercase text-xl text-[var(--text-main)]">Historical Intelligence</h4>
                        <button onClick={() => { setShowBio(false); }} className="text-[10px] font-bold uppercase text-[var(--rbr-red)]">← Back to Stats</button>
                      </div>
                      <p className="text-sm text-[var(--text-muted)] leading-relaxed italic">
                        {selectedDriver.Driver.givenName} {selectedDriver.Driver.familyName}, representing {selectedDriver.Constructors[0]?.name}, has demonstrated elite technical proficiency across the current season. Optimized for high-G load endurance and strategic tire management.
                      </p>
                      <div className="p-4 bg-[var(--bg-panel)] border-l-2 border-[var(--rbr-yellow)]">
                         <div className="text-[10px] font-black uppercase mb-1 text-[var(--text-main)]">Career Status</div>
                         <div className="text-xs font-medium text-[var(--text-muted)]">Verified Grade-A FIA Super License Holder.</div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-1">
                        <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Season Points</div>
                        <div className="font-orbitron text-4xl font-black text-[var(--rbr-yellow)]">{selectedDriver.points}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">GP Wins</div>
                        <div className="font-orbitron text-4xl font-black text-[var(--rbr-red)]">{selectedDriver.wins}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Current Age</div>
                        <div className="font-orbitron text-3xl font-black text-[var(--text-main)]">{calculateAge(selectedDriver.Driver.dateOfBirth)}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Origin</div>
                        <div className="font-orbitron text-lg font-black truncate uppercase text-[var(--text-main)]">{selectedDriver.Driver.nationality}</div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex space-x-4 pt-4">
                    <button 
                      onClick={() => { setShowBio(!showBio); }}
                      className="flex-1 btn-industrial"
                    >{showBio ? 'View Core Stats' : 'View Full Bio'}</button>
                    <button 
                      onClick={() => { setSelectedDriver(null); }}
                      className="flex-1 btn-industrial !bg-transparent opacity-50 hover:opacity-100"
                    >Close Terminal</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drivers;