import React, { useState } from 'react';
import { ThemeContextProps } from '../types';
import { audioService } from '../services/audioService';

const ThemeToggle: React.FC<ThemeContextProps> = ({ isDarkMode, toggleTheme }) => {
  const [smokeParticles, setSmokeParticles] = useState<{ id: number; x: string; driftX: string; driftY: string; rot: string; scale: number }[]>([]);

  const handleToggle = () => {
    const duration = 500; 
    const particleCount = 20; 
    const interval = duration / particleCount;
    
    audioService.playClick();
    audioService.playScreech();
    toggleTheme();

    const movingToLight = isDarkMode;
    // Track is 84px. Knob is 36px. Left pos: 2px. Right pos: 44px.
    // X center left: 2 + 18 = 20. X center right: 44 + 18 = 62.
    const startX = movingToLight ? 20 : 62;
    const endX = movingToLight ? 62 : 20;
    const knobRadius = 18;

    // Sequence for thick burnout trail trailing the tire
    for (let i = 0; i < particleCount; i++) {
      setTimeout(() => {
        const progress = i / (particleCount - 1);
        const currentKnobX = startX + (endX - startX) * progress;
        
        // Spawn smoke from the trailing edge of the knob (opposite to motion direction)
        const spawnXOffset = movingToLight ? -knobRadius : knobRadius;
        const spawnX = currentKnobX + spawnXOffset;
        
        const pId = Date.now() + i;
        setSmokeParticles(prev => [...prev, {
          id: pId,
          x: `${spawnX - 42}px`, // Centered on track width
          // Drift heavily in the direction opposite of the knob's motion
          driftX: `${movingToLight ? -15 - Math.random() * 25 : 15 + Math.random() * 25}px`,
          driftY: `${-5 - Math.random() * 15}px`, // Slight upward billow
          rot: `${(Math.random() - 0.5) * 270}deg`,
          scale: 2.5 + Math.random() * 2.5
        }]);

        // Cleanup after animation
        setTimeout(() => {
          setSmokeParticles(prev => prev.filter(p => p.id !== pId));
        }, 1000);
      }, i * interval);
    }
  };

  return (
    <div className="flex items-center space-x-6">
      {/* Label Left: SOFTS (Red) */}
      <div className="flex flex-col items-center">
        <span className={`text-[9px] font-orbitron font-black uppercase tracking-[0.2em] transition-colors duration-300 ${isDarkMode ? 'text-[#D31336]' : 'text-gray-500 opacity-40'}`}>
          Softs
        </span>
        <div className={`w-4 h-0.5 mt-1 transition-all duration-300 ${isDarkMode ? 'bg-[#D31336] shadow-[0_0_8px_#D31336]' : 'bg-transparent'}`}></div>
      </div>

      <div className="f1-toggle-container group" onMouseEnter={() => audioService.playHover()}>
        <label className="cursor-pointer relative block">
          <input 
            type="checkbox" 
            checked={!isDarkMode} 
            onChange={handleToggle} 
          />
          <div className="f1-toggle-track overflow-visible">
            {/* Burnout smoke trail rendered behind the knob layer but within track context */}
            {smokeParticles.map(p => (
              <div 
                key={p.id}
                className="smoke-particle" 
                style={{ 
                  '--x': p.x, 
                  '--driftX': p.driftX,
                  '--driftY': p.driftY,
                  '--rot': p.rot,
                  '--scale': p.scale
                } as React.CSSProperties} 
              />
            ))}
            
            <div className="f1-tire-knob">
              <div className="absolute inset-[14px] rounded-full bg-[#1a1a1a] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#333]"></div>
              </div>
            </div>
          </div>
        </label>
      </div>

      {/* Label Right: MEDIUMS (Yellow) */}
      <div className="flex flex-col items-center">
        <span className={`text-[9px] font-orbitron font-black uppercase tracking-[0.2em] transition-colors duration-300 ${!isDarkMode ? 'text-[#FFD700]' : 'text-gray-500 opacity-40'}`}>
          Mediums
        </span>
        <div className={`w-4 h-0.5 mt-1 transition-all duration-300 ${!isDarkMode ? 'bg-[#FFD700] shadow-[0_0_8px_#FFD700]' : 'bg-transparent'}`}></div>
      </div>
    </div>
  );
};

export default ThemeToggle;