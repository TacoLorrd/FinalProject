import React, { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { ThemeContextProps } from '../types';
import Logo from './Logo';

interface HeaderProps extends ThemeContextProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  selectedYear: string;
  onYearChange: (year: string) => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleTheme, activeTab, onTabChange, selectedYear, onYearChange }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const tabs = ['Dashboard', 'Drivers', 'Teams', 'Races', 'Compare'];
  const years = Array.from({ length: 15 }, (_, i) => (2025 - i).toString());

  const handleTabClick = (tab: string) => {
    onTabChange(tab);
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 px-4 md:px-6 py-4 flex items-center justify-between bg-[var(--bg-main)] border-b border-[var(--border-ui)] shadow-sm transition-all duration-300">
      <div className="flex items-center space-x-4 md:space-x-12">
        {/* Hamburger Menu Button - Mobile/Tablet Only */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="xl:hidden p-2 text-[var(--text-main)] transition-transform active:scale-95"
          aria-label="Toggle Menu"
        >
          <div className="w-6 h-5 flex flex-col justify-between items-center relative">
            <span className={`w-full h-0.5 bg-current transition-all duration-300 transform ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-full h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-full h-0.5 bg-current transition-all duration-300 transform ${isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
          </div>
        </button>

        <div 
          className="relative flex items-center space-x-2 md:space-x-4 cursor-pointer group" 
          onClick={() => handleTabClick('Dashboard')}
        >
          <div className="relative shrink-0">
            <div className="absolute inset-0 bg-[var(--rbr-red)] transform -skew-x-12 translate-x-1 translate-y-1 opacity-20 blur-sm group-hover:translate-x-1.5 group-hover:translate-y-1.5 transition-transform" />
            <Logo 
              size={40} 
              color="var(--text-main)" 
              className="z-10 bg-[var(--bg-panel)] p-1 rounded-sm border border-[var(--border-ui)] shadow-lg md:size-[56px]" 
            />
          </div>
          <div className="flex flex-col">
            <span className="font-titillium text-xl md:text-3xl font-black italic leading-none tracking-tighter text-[var(--text-main)]">
              DELTA<span className="text-[var(--rbr-red)]">VIEW</span>
            </span>
            <span className="hidden sm:inline text-[8px] md:text-[9px] font-orbitron font-black tracking-[0.3em] md:tracking-[0.5em] text-[var(--text-muted)] uppercase opacity-80 mt-1">Technical Analytics</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}

              className={`relative px-8 py-3 text-[11px] font-black uppercase tracking-[0.3em] transition-all duration-300 ${
                activeTab === tab 
                  ? 'text-[var(--rbr-red)]' 
                  : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-[3px] bg-[var(--rbr-red)] shadow-[0_0_15px_rgba(225,6,0,0.3)]" />
              )}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center space-x-4 md:space-x-10">
        <div className="hidden sm:block">
          <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        </div>
        
        <div className="flex flex-col items-end">
          <span className="hidden sm:inline text-[9px] font-orbitron font-black text-[var(--text-muted)] uppercase tracking-widest mb-1 md:mb-2">Cycle Feed</span>
          <div className="relative">
            <select 
              value={selectedYear}
              onChange={(e) => onYearChange(e.target.value)}
              className="appearance-none bg-[var(--bg-panel)] border border-[var(--border-ui)] text-[10px] md:text-[12px] font-orbitron font-black rounded-none px-3 md:px-5 py-1.5 md:py-2 focus:outline-none focus:border-[var(--rbr-red)] text-[var(--text-main)] pr-8 md:pr-10 cursor-pointer shadow-sm"
            >
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
            <div className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[8px] md:text-[10px] text-[var(--text-muted)] opacity-60">▼</div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <div className={`fixed inset-0 z-[60] xl:hidden transition-all duration-500 ${isMenuOpen ? 'opacity-100 pointer-events-auto bg-black/90' : 'opacity-0 pointer-events-none bg-transparent'}`}>
        <div className={`absolute top-0 left-0 h-full w-[85%] max-sm bg-[var(--bg-main)] border-r border-[var(--border-ui)] p-8 flex flex-col shadow-2xl transition-transform duration-500 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center space-x-3">
              <Logo size={40} color="var(--rbr-red)" />
              <span className="font-titillium text-2xl font-black italic tracking-tighter text-[var(--text-main)] uppercase">DeltaView</span>
            </div>
            <button 
              onClick={() => { setIsMenuOpen(false); }} 
              className="w-10 h-10 flex items-center justify-center text-2xl font-light text-[var(--text-muted)] hover:text-white transition-colors"
            >✕</button>
          </div>

          <nav className="flex flex-col space-y-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`text-left py-3 px-4 text-2xl font-titillium font-black uppercase italic tracking-tighter transition-all border-l-4 ${
                  activeTab === tab 
                    ? 'text-[var(--rbr-red)] bg-white/5 border-[var(--rbr-red)] translate-x-2' 
                    : 'text-[var(--text-muted)] border-transparent hover:text-white hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-8 space-y-8 border-t border-[var(--border-ui)]">
            <div className="sm:hidden">
              <div className="text-[10px] font-orbitron font-black text-[var(--text-muted)] uppercase tracking-widest mb-6">Compound Selector</div>
              <ThemeToggle isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            </div>
            
            <div className="p-5 bg-black/20 border-l-4 border-[var(--rbr-red)]">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[9px] font-orbitron font-black text-white/40 uppercase tracking-widest">System Status</div>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              </div>
              <div className="text-[11px] font-bold text-[var(--rbr-yellow)] uppercase tracking-tighter">Telemetry Link Synchronized</div>
              <div className="text-[9px] text-white/20 mt-1 uppercase font-orbitron">200 OK — BROADCAST MODE</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;