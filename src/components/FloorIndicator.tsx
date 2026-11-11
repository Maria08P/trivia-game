import React from 'react';
import { ChevronUp, ShieldCheck, Heart } from 'lucide-react';

interface FloorIndicatorProps {
  currentFloor: number; // 1 to 10
  totalFloors: number;
  lives: number; // 0 to 3
  streak: number;
}

const FLOOR_NAMES: Record<number, string> = {
  1: 'Ground Floor · Lobby of the Bald',
  2: 'Floor 2 · Feline & Canine Curiosities',
  3: 'Floor 3 · Subterranean Burrow Secrets',
  4: 'Floor 4 · Hydrodynamic Ocean Floor',
  5: 'Floor 5 · The Mud Wallow Mezzanine',
  6: 'Floor 6 · Amphibian & Scaled Oddities',
  7: 'Floor 7 · Pachyderm Physics Suite',
  8: 'Floor 8 · Genetic Mutations Gallery',
  9: 'Floor 9 · Evolution & Thermoregulation',
  10: 'Penthouse · The Hairless Apex',
};

export const FloorIndicator: React.FC<FloorIndicatorProps> = ({
  currentFloor,
  totalFloors,
  lives,
  streak,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-6 bg-gradient-to-b from-[#093124] to-[#051A12] border border-amber-500/30 rounded-3xl p-4 sm:p-5 shadow-2xl relative overflow-hidden">
      
      {/* Decorative brass corner bolts */}
      <div className="absolute top-2.5 left-2.5 w-2 h-2 rounded-full bg-amber-400/60 shadow-sm shadow-amber-300 ring-1 ring-amber-600/50" />
      <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-amber-400/60 shadow-sm shadow-amber-300 ring-1 ring-amber-600/50" />
      <div className="absolute bottom-2.5 left-2.5 w-2 h-2 rounded-full bg-amber-400/60 shadow-sm shadow-amber-300 ring-1 ring-amber-600/50" />
      <div className="absolute bottom-2.5 right-2.5 w-2 h-2 rounded-full bg-amber-400/60 shadow-sm shadow-amber-300 ring-1 ring-amber-600/50" />

      {/* Main floor status display bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-amber-500/20">
        
        {/* Left: Direction & Current Floor Indicator */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex flex-col items-center justify-center text-[#051A12] font-black shadow-lg shadow-amber-950/50 ring-2 ring-amber-300/40">
            <ChevronUp className="w-4 h-4 stroke-[3] -mb-1 text-[#051A12] animate-bounce" />
            <span className="text-lg font-mono leading-none">
              {currentFloor >= 10 ? 'PH' : `0${currentFloor}`}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono tracking-widest text-amber-300 uppercase">
                Lift Status:
              </span>
              <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-900/80 border border-emerald-400/40 text-emerald-300">
                Ascending
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-amber-100 font-display">
              {FLOOR_NAMES[currentFloor] || `Floor ${currentFloor}`}
            </h2>
          </div>
        </div>

        {/* Right: Elevator Cables (Lives) & Streak Multiplier */}
        <div className="flex items-center gap-4 text-xs">
          {/* Streak Indicator */}
          <div className="px-3 py-1.5 rounded-full bg-[#04160E] border border-amber-500/30 text-amber-300 font-medium flex items-center gap-1.5 shadow-inner">
            <span className="text-[11px] text-amber-200/70">Streak:</span>
            <span className="font-mono font-bold text-amber-400 text-sm">{streak}x</span>
          </div>

          {/* Safety Cables (Lives) */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#04160E] border border-amber-500/30 shadow-inner">
            <span className="text-[11px] text-amber-200/70 mr-1 hidden sm:inline">Lift Cables:</span>
            {[1, 2, 3].map((heartIndex) => (
              <Heart
                key={heartIndex}
                className={`w-4 h-4 transition-all duration-300 ${
                  heartIndex <= lives
                    ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]'
                    : 'text-emerald-950/60 fill-emerald-950/40 stroke-emerald-900'
                }`}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Circular Elevator Floor Buttons Strip (Floors 1 to 10) */}
      <div className="mt-4 pt-1">
        <div className="flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto py-1">
          {Array.from({ length: totalFloors }, (_, i) => i + 1).map((floorNum) => {
            const isCurrent = floorNum === currentFloor;
            const isPassed = floorNum < currentFloor;
            return (
              <div
                key={floorNum}
                className="flex flex-col items-center gap-1 shrink-0"
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 ${
                    isCurrent
                      ? 'bg-gradient-to-b from-amber-300 to-amber-600 text-[#051A12] ring-2 ring-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.8)] scale-110'
                      : isPassed
                      ? 'bg-emerald-900/90 text-amber-300/90 border border-amber-500/40'
                      : 'bg-emerald-950/40 text-emerald-500/40 border border-emerald-900/40'
                  }`}
                >
                  {floorNum === 10 ? 'PH' : floorNum}
                </div>
                <span className="text-[9px] font-mono text-emerald-300/40 hidden md:block">
                  F{floorNum}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
