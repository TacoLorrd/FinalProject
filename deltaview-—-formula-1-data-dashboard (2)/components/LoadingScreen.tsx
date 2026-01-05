import React, { useState, useEffect } from 'react';
import { audioService } from '../services/audioService';

interface LoadingScreenProps {
  dataReady: boolean;
  onComplete: () => void;
  isFirstLoad: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ dataReady, onComplete, isFirstLoad }) => {
  const [loaderColor, setLoaderColor] = useState('#D31336'); // Default Red
  const [progress, setProgress] = useState(0);
  const [isReadyToStart, setIsReadyToStart] = useState(false);
  const [isStarted, setIsStarted] = useState(!isFirstLoad);

  const colors = ['#D31336', '#FFD700', '#22C55E']; // Red, Yellow, Green

  useEffect(() => {
    // Show the "Start" button after a short delay to ensure assets are ready
    const timer = setTimeout(() => {
      setIsReadyToStart(true);
    }, 1200);

    // Color rotation (every 2 seconds)
    let colorIdx = 0;
    const colorInterval = setInterval(() => {
      colorIdx = (colorIdx + 1) % colors.length;
      setLoaderColor(colors[colorIdx]);
    }, 2000);

    // Progress counter - 100 steps * 80ms = 8000ms (8 seconds)
    const progressInterval = setInterval(() => {
      if (isStarted) {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 1;
        });
      }
    }, 80);

    return () => {
      clearTimeout(timer);
      clearInterval(colorInterval);
      clearInterval(progressInterval);
    };
  }, [isStarted]);

  // Handle final transition when visual progress is 100% and technical data is ready
  useEffect(() => {
    if (progress === 100 && dataReady) {
      // Small additional delay so the user sees 100% for a moment
      const finishTimer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(finishTimer);
    }
  }, [progress, dataReady, onComplete]);

  const handleStart = () => {
    audioService.unlock();
    audioService.playStartup();
    setIsStarted(true);
  };

  // If it's the first load and we haven't clicked "Start", stay here forever
  if (isFirstLoad && !isStarted) {
    return (
      <div className="fixed inset-0 z-[110] bg-[#02060C] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className={`transition-all duration-700 transform ${isReadyToStart ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex flex-col items-center space-y-8">
            <div className="text-[10px] font-orbitron font-black text-white/40 uppercase tracking-[0.6em] animate-pulse">System Standby</div>
            <button 
              onClick={handleStart}
              onMouseEnter={() => audioService.playHover()}
              className="px-12 py-5 bg-[var(--rbr-red)] text-white font-titillium font-black text-xl italic uppercase tracking-widest rounded-none border border-white/20 shadow-[0_0_30px_rgba(211,19,54,0.3)] hover:scale-105 hover:bg-red-700 active:scale-95 transition-all"
            >
              Initiate Telemetry
            </button>
            <div className="text-[8px] font-orbitron font-black text-white/20 uppercase tracking-widest">Click to engage data uplink</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#02060C] flex flex-col items-center justify-center overflow-hidden">
      {/* Dynamic Background Tint */}
      <div 
        className="absolute inset-0 opacity-10 transition-colors duration-1000 pointer-events-none" 
        style={{ 
          background: `radial-gradient(circle at center, ${loaderColor} 0%, transparent 70%)` 
        }}
      />
      
      {/* Technical Grid Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="relative flex flex-col items-center justify-center">
        {/* F1 Rotating Tire Loader - Centered precisely */}
        <div 
          className="loader shadow-[0_0_80px_-20px_rgba(255,255,255,0.15)]" 
          style={{ '--loader-color': loaderColor } as React.CSSProperties}
        ></div>
      </div>
      
      {/* Centered Loading Text */}
      <div className="mt-16 w-full max-w-sm px-8 text-center">
        <div className="font-titillium text-3xl text-white font-black italic tracking-widest uppercase animate-pulse mb-8">
          SYNCING TELEMETRY...
        </div>

        <div className="flex justify-between items-end border-t border-white/5 pt-6">
          <div className="space-y-1 text-left">
             <div className="text-[10px] font-orbitron font-black text-white/40 uppercase tracking-widest">Signal Strength</div>
             <div className="flex space-x-1">
                <div className="w-1.5 h-3 bg-green-500/80"></div>
                <div className="w-1.5 h-3 bg-green-500/80"></div>
                <div className="w-1.5 h-3 bg-green-500/80"></div>
                <div className="w-1.5 h-3 bg-green-500/80 animate-pulse"></div>
                <div className="w-1.5 h-3 bg-white/10"></div>
             </div>
          </div>
          <div className="text-right">
             <div className="text-[10px] font-orbitron font-black text-white/40 uppercase tracking-widest">Data Buffer</div>
             <div className="font-orbitron text-xl font-black text-white">{progress}%</div>
          </div>
        </div>
      </div>

      {/* Frame Decorations */}
      <div className="absolute top-12 left-12 w-24 h-[1px] bg-gradient-to-r from-[var(--rbr-red)] to-transparent opacity-40"></div>
      <div className="absolute top-12 left-12 w-[1px] h-24 bg-gradient-to-b from-[var(--rbr-red)] to-transparent opacity-40"></div>
      
      <div className="absolute bottom-12 right-12 w-24 h-[1px] bg-gradient-to-l from-[var(--rbr-red)] to-transparent opacity-40"></div>
      <div className="absolute bottom-12 right-12 w-[1px] h-24 bg-gradient-to-t from-[var(--rbr-red)] to-transparent opacity-40"></div>
    </div>
  );
};

export default LoadingScreen;