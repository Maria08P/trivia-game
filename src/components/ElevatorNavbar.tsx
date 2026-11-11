import React from 'react';
import { Volume2, VolumeX, Music, Sparkles } from 'lucide-react';
import { ElevatorTrack } from '../audio/elevatorSynth';

interface ElevatorNavbarProps {
  activeTab: 'ascent' | 'express' | 'compendium' | 'lounge';
  setActiveTab: (tab: 'ascent' | 'express' | 'compendium' | 'lounge') => void;
  coins: number;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  currentTrack: ElevatorTrack;
}

export const ElevatorNavbar: React.FC<ElevatorNavbarProps> = ({
  activeTab,
  setActiveTab,
  coins,
  isPlayingMusic,
  onToggleMusic,
  isMuted,
  onToggleMute,
  currentTrack,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#041910]/95 backdrop-blur-md border-b border-amber-500/20 px-4 md:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 md:gap-8">
        
        {/* Brand Zone - Single line text wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-900/30 ring-2 ring-amber-300/40">
            <span className="text-[#051A12] font-extrabold text-base tracking-tighter">HL</span>
          </div>
          <div>
            <a 
              href="#top" 
              onClick={(e) => { e.preventDefault(); setActiveTab('ascent'); }}
              className="text-lg md:text-xl font-bold tracking-tight font-display gold-gradient-text whitespace-nowrap block hover:opacity-90 transition-opacity"
            >
              The Hairless Menagerie
            </a>
            <span className="text-[11px] text-amber-200/60 font-medium tracking-wider uppercase block">
              Gilded Elevator Trivia
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-emerald-200/80">
          <button
            onClick={() => setActiveTab('ascent')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              activeTab === 'ascent' 
                ? 'text-amber-300 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-400' 
                : 'hover:text-amber-200'
            }`}
          >
            Penthouse Ascent
          </button>
          
          <button
            onClick={() => setActiveTab('express')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              activeTab === 'express' 
                ? 'text-amber-300 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-400' 
                : 'hover:text-amber-200'
            }`}
          >
            Express Lift (60s)
          </button>

          <button
            onClick={() => setActiveTab('compendium')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              activeTab === 'compendium' 
                ? 'text-amber-300 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-400' 
                : 'hover:text-amber-200'
            }`}
          >
            Hairless Hall of Fame
          </button>

          <button
            onClick={() => setActiveTab('lounge')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              activeTab === 'lounge' 
                ? 'text-amber-300 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-400' 
                : 'hover:text-amber-200'
            }`}
          >
            Elevator Lounge & DJ
          </button>
        </nav>

        {/* Zone 3: Coin Counter & Elevator Music Controller */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 shrink-0">
          
          {/* Gold Coin Purse */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="tabular-nums font-mono text-amber-200">{coins}</span>
            <span className="hidden sm:inline text-amber-300/80 font-normal">Gilded Coins</span>
          </div>

          {/* Mute button */}
          <button
            onClick={onToggleMute}
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-emerald-900/60 hover:bg-emerald-800 text-amber-300 border border-amber-500/20 transition-transform active:scale-95"
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-amber-400/60" /> : <Volume2 className="w-4 h-4 text-amber-300" />}
          </button>

          {/* Elevator Music Primary CTA Rounded Button */}
          <button
            onClick={onToggleMusic}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shadow-md active:scale-95 ${
              isPlayingMusic
                ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-[#051A12] ring-2 ring-amber-300/60 shadow-amber-500/20'
                : 'bg-emerald-900/80 hover:bg-emerald-800 text-amber-300 border border-amber-500/40'
            }`}
            title={isPlayingMusic ? `Playing: ${currentTrack.name}` : 'Play Elevator Music'}
          >
            <Music className={`w-3.5 h-3.5 ${isPlayingMusic ? 'animate-bounce' : ''}`} />
            <span className="whitespace-nowrap hidden sm:inline">
              {isPlayingMusic ? 'Elevator Music ON' : 'Elevator Music'}
            </span>
            <span className="sm:hidden">
              {isPlayingMusic ? 'ON' : 'Music'}
            </span>
          </button>
        </div>

      </div>

      {/* Mobile nav tabs */}
      <div className="flex md:hidden items-center justify-between gap-1 mt-2.5 pt-2 border-t border-amber-500/15 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('ascent')}
          className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
            activeTab === 'ascent' ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-400/40' : 'text-emerald-300/80'
          }`}
        >
          Ascent
        </button>
        <button
          onClick={() => setActiveTab('express')}
          className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
            activeTab === 'express' ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-400/40' : 'text-emerald-300/80'
          }`}
        >
          Express 60s
        </button>
        <button
          onClick={() => setActiveTab('compendium')}
          className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
            activeTab === 'compendium' ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-400/40' : 'text-emerald-300/80'
          }`}
        >
          Hall of Fame
        </button>
        <button
          onClick={() => setActiveTab('lounge')}
          className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
            activeTab === 'lounge' ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-400/40' : 'text-emerald-300/80'
          }`}
        >
          DJ Deck
        </button>
      </div>
    </header>
  );
};
