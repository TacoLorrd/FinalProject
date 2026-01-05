import React, { useState } from 'react';
import { Race } from '../types';
import { f1Service } from '../services/f1Service';
import { audioService } from '../services/audioService';

interface RacesProps {
  races: Race[];
  year: string;
}

const Races: React.FC<RacesProps> = ({ races, year }) => {
  const [selectedRaceResults, setSelectedRaceResults] = useState<Race | null>(null);
  const [loadingResults, setLoadingResults] = useState(false);

  const isPast = (dateStr: string) => {
    return new Date(dateStr) < new Date();
  };

  const handleViewResults = async (race: Race) => {
    audioService.playClick();
    setLoadingResults(true);
    try {
      const results = await f1Service.getRaceResults(year, race.round);
      setSelectedRaceResults(results);
    } finally {
      setLoadingResults(false);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 animate-broadcast">
      <div>
        <h2 className="font-titillium text-4xl font-black italic uppercase tracking-tighter">
          SEASON <span className="text-[var(--rbr-red)]">CALENDAR</span>
        </h2>
        <p className="text-[var(--text-muted)] text-[10px] font-orbitron font-bold uppercase tracking-[0.2em] mt-2">Official FIA Session Schedule & Classification</p>
      </div>

      <div className="panel-3d overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left timing-monitor">
            <thead className="text-[10px] uppercase font-black text-[var(--text-muted)] bg-black/20">
              <tr>
                <th className="px-8 py-4">RD</th>
                <th className="px-8 py-4">Grand Prix Event</th>
                <th className="px-8 py-4">Circuit Data</th>
                <th className="px-8 py-4">Session Date</th>
                <th className="px-8 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {races.map((r) => (
                <tr key={r.round} className="group">
                  <td className="px-8 py-6 font-orbitron text-[var(--rbr-red)] font-black text-xl italic">#{r.round.padStart(2, '0')}</td>
                  <td className="px-8 py-6">
                    <div className="font-black text-lg uppercase italic tracking-tighter group-hover:text-[var(--rbr-yellow)] transition-colors leading-none">{r.raceName}</div>
                    <div className="text-[10px] font-bold text-[var(--text-muted)] uppercase mt-1">{r.Circuit.Location.locality}, {r.Circuit.Location.country}</div>
                  </td>
                  <td className="px-8 py-6 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest">{r.Circuit.circuitName}</td>
                  <td className="px-8 py-6 font-orbitron text-xs font-bold">{new Date(r.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td className="px-8 py-6 text-right">
                    {isPast(r.date) ? (
                      <button 
                        onMouseEnter={() => audioService.playHover()}
                        onClick={() => handleViewResults(r)}
                        className="btn-industrial !py-1.5 !px-4"
                      >Results</button>
                    ) : (
                      <span className="text-[10px] font-black uppercase text-[var(--accent-blue)] tracking-[0.2em] animate-pulse">Upcoming</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Race Results Modal */}
      {selectedRaceResults && (
        <div className="modal-overlay" onClick={() => { audioService.playClick(); setSelectedRaceResults(null); }}>
          <div className="panel-3d w-full max-w-6xl animate-broadcast" onClick={e => e.stopPropagation()}>
            <div className="px-10 py-8 border-b border-[var(--border-ui)] flex justify-between items-center bg-black/40">
              <div>
                <div className="text-[10px] font-orbitron font-bold text-[var(--rbr-yellow)] uppercase tracking-[0.5em] mb-1">Race Classification Protocol</div>
                <h3 className="text-5xl font-titillium font-black italic uppercase italic leading-none">{selectedRaceResults.raceName}</h3>
                <div className="text-[11px] font-bold text-[var(--text-muted)] uppercase mt-2">{selectedRaceResults.Circuit.circuitName} — {selectedRaceResults.date}</div>
              </div>
              <button onMouseEnter={() => audioService.playHover()} onClick={() => { audioService.playClick(); setSelectedRaceResults(null); }} className="text-4xl text-[var(--text-muted)] hover:text-white font-light">✕</button>
            </div>
            
            <div className="p-4 md:p-10 max-h-[60vh] overflow-y-auto">
              <table className="w-full timing-monitor">
                <thead className="text-[10px] font-orbitron font-bold text-[var(--text-muted)] uppercase sticky top-0 bg-[var(--bg-card)] z-20">
                  <tr className="!bg-transparent border-b border-[var(--border-ui)]">
                    <th className="w-20 text-center py-4">POS</th>
                    <th className="py-4">Pilot Identification</th>
                    <th className="py-4">Constructor Chassis</th>
                    <th className="text-right py-4">Final Time / Status</th>
                    <th className="text-right py-4 font-black text-[var(--rbr-red)]">PTS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {selectedRaceResults.Results?.map((res) => (
                    <tr key={res.number} className="group">
                      <td className="text-center font-orbitron text-2xl font-black italic group-hover:text-[var(--rbr-yellow)]">{res.position}</td>
                      <td>
                        <div className="font-black text-lg uppercase italic tracking-tighter leading-none">
                          {res.Driver.givenName} <span className="text-white group-hover:text-black">{res.Driver.familyName.toUpperCase()}</span>
                        </div>
                        <div className="text-[9px] font-black text-[var(--text-muted)] font-orbitron uppercase tracking-widest mt-1">NO. {res.number}</div>
                      </td>
                      <td className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest group-hover:text-white">{res.Constructor.name}</td>
                      <td className="text-right font-orbitron text-xs text-[var(--text-muted)] group-hover:text-white">{res.Time?.time || res.status}</td>
                      <td className="text-right font-orbitron text-[var(--rbr-red)] font-black text-2xl group-hover:text-white">{res.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-8 border-t border-[var(--border-ui)] flex justify-between items-center bg-black/40">
               <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                  <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Broadcast classification verified</span>
               </div>
               <button onMouseEnter={() => audioService.playHover()} onClick={() => { audioService.playClick(); setSelectedRaceResults(null); }} className="btn-industrial">Close Results</button>
            </div>
          </div>
        </div>
      )}
      
      {loadingResults && (
        <div className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-black/60 backdrop-blur-md">
           <div className="w-24 h-24 border-[6px] border-[var(--rbr-red)] border-t-transparent rounded-full animate-spin shadow-[0_0_30px_rgba(211,19,54,0.4)] mb-8"></div>
           <div className="text-xs font-orbitron font-black text-[var(--rbr-yellow)] tracking-[0.5em] uppercase animate-pulse">Decrypting Race Standings...</div>
        </div>
      )}
    </div>
  );
};

export default Races;