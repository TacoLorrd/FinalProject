import React, { useState, useEffect } from 'react';
import { DriverStanding } from '../types';

interface CompareProps {
  drivers: DriverStanding[];
  initialSelection?: [string, string] | null;
}

const Compare: React.FC<CompareProps> = ({ drivers, initialSelection }) => {
  const [driverA, setDriverA] = useState(initialSelection?.[0] || drivers[0]?.Driver.driverId || '');
  const [driverB, setDriverB] = useState(initialSelection?.[1] || drivers[1]?.Driver.driverId || '');

  useEffect(() => {
    if (initialSelection) {
      setDriverA(initialSelection[0]);
      setDriverB(initialSelection[1]);
    }
  }, [initialSelection]);

  const dataA = drivers.find(d => d.Driver.driverId === driverA);
  const dataB = drivers.find(d => d.Driver.driverId === driverB);

  const stats = [
    { label: 'Championship Position', key: 'position' },
    { label: 'Total Points Accumulated', key: 'points' },
    { label: 'Grand Prix Wins', key: 'wins' },
  ];

  const getWinner = (valA: string, valB: string, isInverse: boolean = false) => {
    const a = parseFloat(valA);
    const b = parseFloat(valB);
    if (a === b) return null;
    if (isInverse) return a < b ? 'A' : 'B';
    return a > b ? 'A' : 'B';
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
      <h2 className="font-titillium text-3xl font-bold italic uppercase tracking-tighter text-[var(--text-main)]">
        Technical <span className="text-[var(--rbr-red)]">Versus</span> Mode
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Selector A */}
        <div className="panel-3d p-6 space-y-4 border-l-4 border-[#D31336]">
          <label className="text-[10px] font-orbitron font-bold text-[var(--text-muted)] uppercase tracking-widest">Primary Candidate</label>
          <select 
            value={driverA}
            onChange={(e) => setDriverA(e.target.value)}
            className="w-full bg-[var(--bg-panel)] border border-[var(--border-ui)] rounded-lg p-3 font-bold text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[#D31336]"
          >
            {drivers.map(d => <option key={d.Driver.driverId} value={d.Driver.driverId}>{d.Driver.givenName} {d.Driver.familyName}</option>)}
          </select>
          {dataA && (
            <div className="pt-4 flex items-center space-x-4">
              <div className="w-14 h-14 rounded bg-[#D31336] flex items-center justify-center font-orbitron text-xl font-bold text-[#FFD700] shadow-[0_0_20px_rgba(211,19,54,0.2)] transform -skew-x-12">
                {dataA.Driver.code}
              </div>
              <div>
                <div className="font-titillium font-bold text-xl uppercase italic tracking-tighter leading-none text-[var(--text-main)]">{dataA.Driver.familyName}</div>
                <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mt-1">{dataA.Constructors[0]?.name}</div>
              </div>
            </div>
          )}
        </div>

        {/* Selector B */}
        <div className="panel-3d p-6 space-y-4 border-r-4 border-[var(--rbr-yellow)]">
          <label className="text-[10px] font-orbitron font-bold text-[var(--text-muted)] uppercase tracking-widest text-right block">Benchmark Candidate</label>
          <select 
            value={driverB}
            onChange={(e) => setDriverB(e.target.value)}
            className="w-full bg-[var(--bg-panel)] border border-[var(--border-ui)] rounded-lg p-3 font-bold text-[var(--text-main)] outline-none focus:ring-1 focus:ring-[var(--rbr-yellow)]"
          >
            {drivers.map(d => <option key={d.Driver.driverId} value={d.Driver.driverId}>{d.Driver.givenName} {d.Driver.familyName}</option>)}
          </select>
          {dataB && (
            <div className="pt-4 flex flex-row-reverse items-center space-x-reverse space-x-4">
              <div className="w-14 h-14 rounded bg-[var(--rbr-yellow)] flex items-center justify-center font-orbitron text-xl font-bold text-[var(--bg-card)] shadow-[0_0_20px_rgba(255,215,0,0.2)] transform skew-x-12">
                {dataB.Driver.code}
              </div>
              <div className="text-right">
                <div className="font-titillium font-bold text-xl uppercase italic tracking-tighter leading-none text-[var(--text-main)]">{dataB.Driver.familyName}</div>
                <div className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest mt-1">{dataB.Constructors[0]?.name}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {dataA && dataB && (
        <div className="panel-3d rounded-xl overflow-hidden">
          <div className="bg-[var(--bg-panel)]/40 px-6 py-4 border-b border-[var(--border-ui)] flex justify-center">
            <h3 className="text-[10px] font-orbitron font-bold text-[var(--rbr-yellow)] uppercase tracking-[0.5em]">Telemetry Delta Verification</h3>
          </div>
          <div className="divide-y divide-[var(--border-ui)]">
            {stats.map((stat) => {
              const valA = (dataA as any)[stat.key];
              const valB = (dataB as any)[stat.key];
              const winner = getWinner(valA, valB, stat.key === 'position');

              return (
                <div key={stat.key} className="flex items-center px-6 py-10 group hover:bg-[var(--text-main)]/5 transition-all">
                  <div className={`flex-1 text-center font-orbitron text-4xl font-bold transition-all ${winner === 'A' ? 'text-[#D31336] scale-110' : 'text-[var(--text-muted)] opacity-30'}`}>
                    {valA}
                    {winner === 'A' && <span className="block text-[8px] uppercase tracking-[0.3em] mt-2 text-[var(--rbr-yellow)]">Leading Stat</span>}
                  </div>
                  <div className="w-1/3 text-center px-4">
                    <div className="text-[10px] font-bold uppercase text-[var(--text-muted)] mb-2 tracking-tighter italic">{stat.label}</div>
                    <div className="h-1.5 bg-[var(--bg-panel)] rounded-full flex overflow-hidden border border-[var(--border-ui)]">
                      <div 
                        className={`h-full transition-all duration-1000 ${winner === 'A' ? 'bg-[#D31336]' : 'bg-[var(--bg-panel)]'}`} 
                        style={{ width: winner === 'A' ? '70%' : winner === 'B' ? '30%' : '50%' }}
                      />
                      <div 
                         className={`h-full transition-all duration-1000 ${winner === 'B' ? 'bg-[var(--rbr-yellow)]' : 'bg-[var(--bg-panel)]'}`} 
                         style={{ width: winner === 'B' ? '70%' : winner === 'A' ? '30%' : '50%' }}
                      />
                    </div>
                  </div>
                  <div className={`flex-1 text-center font-orbitron text-4xl font-bold transition-all ${winner === 'B' ? 'text-[var(--rbr-yellow)] scale-110' : 'text-[var(--text-muted)] opacity-30'}`}>
                    {valB}
                    {winner === 'B' && <span className="block text-[8px] uppercase tracking-[0.3em] mt-2 text-[#D31336]">Leading Stat</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Compare;