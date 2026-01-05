import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import LoadingScreen from './components/LoadingScreen';
import Dashboard from './pages/Dashboard';
import Drivers from './pages/Drivers';
import Teams from './pages/Teams';
import Races from './pages/Races';
import Compare from './pages/Compare';
import { f1Service } from './services/f1Service';
import { DriverStanding, ConstructorStanding, Race } from './types';
import { audioService } from './services/audioService';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const isFirstLoadRef = useRef(true);

  const [driverStandings, setDriverStandings] = useState<DriverStanding[]>([]);
  const [constructorStandings, setConstructorStandings] = useState<ConstructorStanding[]>([]);
  const [races, setRaces] = useState<Race[]>([]);
  
  const [preSelectedDrivers, setPreSelectedDrivers] = useState<[string, string] | null>(null);

  const tickerMessages = [
    "MAX VERSTAPPEN SECURES 100TH PODIUM...",
    "TECHNICAL DIRECTIVE TD039 UPDATED FOR SILVERSTONE...",
    "PIRELLI REVEAL C1-C3 COMPOUND ALLOCATION FOR NEXT GP...",
    "ADRIAN NEWEY ANNOUNCES TECHNICAL PARTNERSHIP SHIFT...",
    "FERRARI CHASSIS OPTIMIZATION GAINS 0.2S IN SLOW SECTORS...",
    "RECORD ATTENDANCE VERIFIED AT CIRCUIT OF THE AMERICAS...",
    "WEATHER PROTOCOL: 20% CHANCE OF RAIN FOR QUALIFYING..."
  ];

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
    document.body.classList.toggle('medium-mode');
  };

  const fetchData = useCallback(async (year: string) => {
    const isFirst = isFirstLoadRef.current;
    
    // Only show full screen loader if it's the first site load
    if (isFirst) {
      setLoading(true);
    } else {
      setIsRefreshing(true);
    }
    
    setDataLoaded(false);
    setError(null);
    
    try {
      const [ds, cs, sch] = await Promise.all([
        f1Service.getDriverStandings(year),
        f1Service.getConstructorStandings(year),
        f1Service.getSeasonSchedule(year)
      ]);
      
      if (ds.length === 0 && cs.length === 0) {
        throw new Error('Telemetry signal lost for the selected period.');
      }

      setDriverStandings(ds);
      setConstructorStandings(cs);
      setRaces(sch);
      setDataLoaded(true);
      
      // If it's not the first load, we finish the "refreshing" state immediately
      if (!isFirst) {
        setIsRefreshing(false);
      }
    } catch (err) {
      console.error(err);
      setError('Data link temporarily unavailable. Verify season active status.');
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData(selectedYear);
  }, [selectedYear, fetchData]);

  const handleLoadingComplete = () => {
    setLoading(false);
    isFirstLoadRef.current = false;
  };

  const handleTeamCompare = (teamId: string) => {
    const teamDrivers = driverStandings.filter(ds => ds.Constructors[0].constructorId === teamId);
    if (teamDrivers.length >= 2) {
      setPreSelectedDrivers([teamDrivers[0].Driver.driverId, teamDrivers[1].Driver.driverId]);
    } else {
      setPreSelectedDrivers([driverStandings[0].Driver.driverId, driverStandings[1].Driver.driverId]);
    }
    setActiveTab('Compare');
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
          <div className="w-20 h-20 bg-[#E10600]/10 rounded-full flex items-center justify-center text-4xl border border-[#E10600]/20 animate-pulse">⚠️</div>
          <div className="text-center">
            <div className="text-[#E10600] font-orbitron text-xl uppercase tracking-widest mb-2 italic">Signal Loss Detected</div>
            <p className="text-gray-500 text-sm max-w-md mx-auto uppercase tracking-tighter">The data bridge for {selectedYear} is unresponsive.</p>
          </div>
          <div className="flex space-x-4">
            <button 
              onMouseEnter={() => audioService.playHover()}
              onClick={() => { audioService.playClick(); fetchData(selectedYear); }}
              className="px-8 py-3 bg-[#E10600] text-white font-bold rounded-lg hover:bg-red-700 transition-all uppercase text-[10px] tracking-[0.2em]"
            >
              Retry Uplink
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className={`transition-opacity duration-500 ${isRefreshing ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
        {(() => {
          switch (activeTab) {
            case 'Dashboard': return <Dashboard driverStandings={driverStandings} constructorStandings={constructorStandings} races={races} selectedYear={selectedYear} />;
            case 'Drivers': return <Drivers standings={driverStandings} selectedYear={selectedYear} />;
            case 'Teams': return <Teams standings={constructorStandings} onCompare={handleTeamCompare} />;
            case 'Races': return <Races races={races} year={selectedYear} />;
            case 'Compare': return <Compare drivers={driverStandings} initialSelection={preSelectedDrivers} />;
            default: return <Dashboard driverStandings={driverStandings} constructorStandings={constructorStandings} races={races} selectedYear={selectedYear} />;
          }
        })()}
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-28 selection:bg-[#E10600] selection:text-white">
      {loading && (
        <LoadingScreen 
          dataReady={dataLoaded} 
          onComplete={handleLoadingComplete} 
          isFirstLoad={isFirstLoadRef.current}
        />
      )}
      
      <Header 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
        activeTab={activeTab}
        onTabChange={(tab) => { setActiveTab(tab); setPreSelectedDrivers(null); }}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
      />

      <main className="max-w-[1400px] mx-auto transition-all duration-300">
        {renderContent()}
      </main>

      <footer className="fixed bottom-0 left-0 right-0 border-t border-white/5 z-40 bg-[var(--bg-main)]">
        {/* Intelligence Ticker */}
        <div className="bg-black/80 py-2 border-b border-white/5 overflow-hidden whitespace-nowrap">
           <div className="inline-block animate-[ticker_60s_linear_infinite] px-4 space-x-12">
              {tickerMessages.map((msg, idx) => (
                <span key={idx} className="text-[9px] font-orbitron font-black text-white/50 uppercase tracking-[0.2em]">
                  <span className="text-[var(--rbr-red)] mr-2">/ /</span> {msg}
                </span>
              ))}
              {/* Duplicate for seamless loop */}
              {tickerMessages.map((msg, idx) => (
                <span key={`dup-${idx}`} className="text-[9px] font-orbitron font-black text-white/50 uppercase tracking-[0.2em]">
                  <span className="text-[var(--rbr-red)] mr-2">/ /</span> {msg}
                </span>
              ))}
           </div>
        </div>

        <div className="px-6 py-4 flex flex-col md:flex-row justify-between items-center text-[8px] uppercase font-bold text-gray-500">
          <div className="flex items-center space-x-6">
            <span className="flex items-center space-x-2">
               <span className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${ (loading || isRefreshing) ? 'bg-yellow-500 animate-pulse' : error ? 'bg-red-500' : 'bg-green-500'}`}></span>
               <span>
                {loading ? 'STATUS: ESTABLISHING INITIAL BOOT...' : isRefreshing ? `STATUS: SYNCING ${selectedYear} TELEMETRY...` : error ? 'STATUS: CONNECTION FAILED' : `STATUS: TELEMETRY LINK SECURED — ${selectedYear} FEED ACTIVE`}
               </span>
            </span>
          </div>
          <div className="flex items-center space-x-6 mt-2 md:mt-0">
            <span className="opacity-50 tracking-widest">Kayden — CP2 Motorsport Division</span>
            <div className="flex space-x-1.5">
              <div className="w-1 h-1 bg-[#FFD700] rounded-full"></div>
              <div className="w-1 h-1 bg-[#E10600] rounded-full"></div>
              <div className="w-1 h-1 bg-[#00A3E0] rounded-full"></div>
            </div>
          </div>
        </div>
      </footer>
      
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
};

export default App;