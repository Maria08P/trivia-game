import React, { useState, useEffect } from 'react';
import { elevatorSynth, ElevatorTrack, ELEVATOR_TRACKS } from './audio/elevatorSynth';
import { ElevatorNavbar } from './components/ElevatorNavbar';
import { ElevatorMusicBar } from './components/ElevatorMusicBar';
import { TriviaGame } from './components/TriviaGame';
import { SpeedRunGame } from './components/SpeedRunGame';
import { CreatureCompendium } from './components/CreatureCompendium';
import { ElevatorLoungeDJ } from './components/ElevatorLoungeDJ';
import { Music, BellRing, Sparkles, Shield, Compass } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'ascent' | 'express' | 'compendium' | 'lounge'>('ascent');
  const [coins, setCoins] = useState<number>(() => {
    return parseInt(localStorage.getItem('hairless_coins') || '250', 10);
  });

  const [audioState, setAudioState] = useState<{
    isPlaying: boolean;
    volume: number;
    isMuted: boolean;
    currentTrack: ElevatorTrack;
  }>({
    isPlaying: false,
    volume: 0.6,
    isMuted: false,
    currentTrack: ELEVATOR_TRACKS[0],
  });

  const [hasStartedAudioOnce, setHasStartedAudioOnce] = useState(false);

  // Sync with audio engine
  useEffect(() => {
    const unsubscribe = elevatorSynth.subscribe((state) => {
      setAudioState(state);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleAddCoins = (amount: number) => {
    setCoins((prev) => {
      const next = prev + amount;
      localStorage.setItem('hairless_coins', next.toString());
      return next;
    });
  };

  const handleToggleMusic = async () => {
    setHasStartedAudioOnce(true);
    await elevatorSynth.toggle();
  };

  const handleToggleMute = () => {
    elevatorSynth.setMuted(!audioState.isMuted);
  };

  const handleRingChime = () => {
    elevatorSynth.playElevatorChime('single');
  };

  // Optional: prompt user politely to start elevator music if not started
  const handleStartMusicPrompt = async () => {
    setHasStartedAudioOnce(true);
    await elevatorSynth.start();
  };

  return (
    <div className="min-h-screen bg-[#041A12] text-[#F3F4F6] flex flex-col font-sans selection:bg-amber-400/30 selection:text-amber-200">
      
      {/* Top Navigation Bar */}
      <ElevatorNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        coins={coins}
        isPlayingMusic={audioState.isPlaying}
        onToggleMusic={handleToggleMusic}
        isMuted={audioState.isMuted}
        onToggleMute={handleToggleMute}
        currentTrack={audioState.currentTrack}
      />

      {/* Elevator Music Player Bar */}
      <ElevatorMusicBar
        isPlaying={audioState.isPlaying}
        onTogglePlay={handleToggleMusic}
        currentTrack={audioState.currentTrack}
        isMuted={audioState.isMuted}
        onRingChime={handleRingChime}
      />

      {/* Welcome Boarding Banner (if music is not playing yet) */}
      {!audioState.isPlaying && !hasStartedAudioOnce && (
        <div className="bg-gradient-to-r from-amber-500/20 via-emerald-900/60 to-amber-500/20 border-b border-amber-500/30 px-4 py-2.5 text-center text-xs text-amber-200 animate-fadeIn">
          <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-3">
            <span className="flex items-center gap-1.5 font-medium">
              <Music className="w-3.5 h-3.5 text-amber-400" />
              <span>Step aboard the Velvet Lift: Start synthesized elevator bossa nova?</span>
            </span>
            <button
              onClick={handleStartMusicPrompt}
              className="px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 text-[#051A12] font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              Start Elevator Music 🛎️
            </button>
          </div>
        </div>
      )}

      {/* Main Tab Content */}
      <main className="flex-1 py-4 sm:py-8">
        {activeTab === 'ascent' && (
          <TriviaGame
            onAddCoins={handleAddCoins}
            coins={coins}
          />
        )}

        {activeTab === 'express' && (
          <SpeedRunGame
            onAddCoins={handleAddCoins}
          />
        )}

        {activeTab === 'compendium' && (
          <CreatureCompendium />
        )}

        {activeTab === 'lounge' && (
          <ElevatorLoungeDJ
            isPlaying={audioState.isPlaying}
            onTogglePlay={handleToggleMusic}
            currentTrack={audioState.currentTrack}
            isMuted={audioState.isMuted}
            onToggleMute={handleToggleMute}
          />
        )}
      </main>

      {/* Quiet Elevator Footer */}
      <footer className="bg-[#03140D] border-t border-amber-500/20 py-6 px-4 text-xs text-emerald-300/60">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 text-[10px] font-bold">
              🛎️
            </div>
            <span className="text-amber-200/80 font-medium font-display">
              The Hairless Menagerie · Velvet Elevator Trivia
            </span>
          </div>

          <div className="flex items-center gap-4 text-emerald-300/60">
            <span>Subterranean · Marine · Feline · Canine · Amphibia</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-amber-300/70">Floor Indicator: Nominal</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
