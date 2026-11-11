import React, { useEffect, useRef, useState } from 'react';
import { Music, Play, Pause, BellRing, Sliders, Sparkles, Volume2, VolumeX, Disc } from 'lucide-react';
import { elevatorSynth, ELEVATOR_TRACKS, ElevatorTrack } from '../audio/elevatorSynth';

interface ElevatorLoungeDJProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  currentTrack: ElevatorTrack;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const ElevatorLoungeDJ: React.FC<ElevatorLoungeDJProps> = ({
  isPlaying,
  onTogglePlay,
  currentTrack,
  isMuted,
  onToggleMute,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeBell, setActiveBell] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      if (!active) return;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Background velvet glow
      ctx.fillStyle = '#03170E';
      ctx.fillRect(0, 0, width, height);

      const data = elevatorSynth.getVisualizerData();
      const numBars = 32;
      const barWidth = (width - numBars * 2) / numBars;

      for (let i = 0; i < numBars; i++) {
        const raw = isPlaying && !isMuted ? (data[i] || 0) : 10;
        const barHeight = Math.max(6, (raw / 255) * (height - 12));
        const x = i * (barWidth + 2);
        const y = height - barHeight;

        // Gold to emerald gradient
        const gradient = ctx.createLinearGradient(0, height, 0, 0);
        gradient.addColorStop(0, '#047857');
        gradient.addColorStop(0.5, '#F59E0B');
        gradient.addColorStop(1, '#FEF08A');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [3, 3, 0, 0]);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      active = false;
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, isMuted]);

  const triggerChime = (type: 'single' | 'double' | 'correct' | 'wrong' | 'streak') => {
    setActiveBell(type);
    if (type === 'single') elevatorSynth.playElevatorChime('single');
    else if (type === 'double') elevatorSynth.playElevatorChime('double');
    else if (type === 'correct') elevatorSynth.playCorrectSound();
    else if (type === 'wrong') elevatorSynth.playWrongSound();
    else if (type === 'streak') elevatorSynth.playStreakSound();

    setTimeout(() => {
      setActiveBell(null);
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-[#093425] to-[#041A11] border border-amber-500/30 rounded-3xl p-6 sm:p-8 mb-6 shadow-2xl relative">
        <div className="flex items-center gap-2 mb-2">
          <Disc className={`w-4 h-4 text-amber-400 ${isPlaying ? 'animate-spin' : ''}`} />
          <span className="text-xs font-mono font-bold tracking-wider text-amber-300 uppercase">
            Synthesizer Control Room
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-display gold-gradient-text mb-3">
          The Velvet Elevator Lounge
        </h2>
        <p className="text-sm text-emerald-200/90 leading-relaxed max-w-2xl">
          Powered entirely by client-side Web Audio API synthesis! No external audio files or buffering required. Enjoy nostalgic electric piano jazz, walking double-bass lines, syncopated bossa nova shakers, and vintage brass bell chimes.
        </p>
      </div>

      {/* Visualizer & Turntable Deck */}
      <div className="bg-[#03150D] border border-amber-500/30 rounded-3xl p-6 mb-6 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 block">
              Audio Frequency Spectrum
            </span>
            <h3 className="text-lg font-bold font-display text-amber-100">
              {currentTrack.name} ({currentTrack.bpm} BPM)
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onTogglePlay}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-[#051A12] font-bold text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Pause Lounge Music' : 'Play Lounge Music'}</span>
            </button>

            <button
              onClick={onToggleMute}
              className="p-2.5 rounded-full bg-emerald-950 border border-amber-500/30 text-amber-300 hover:text-amber-100 active:scale-95 transition-transform"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Visualizer Canvas */}
        <div className="rounded-2xl overflow-hidden border border-amber-500/25 p-2 bg-black/60 mb-6">
          <canvas
            ref={canvasRef}
            width={640}
            height={110}
            className="w-full h-24 sm:h-28 block"
          />
        </div>

        {/* Track Selector Cards */}
        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 mb-3">
          Available Elevator Soundscapes
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-6">
          {ELEVATOR_TRACKS.map((track) => (
            <button
              key={track.id}
              onClick={() => elevatorSynth.setTrack(track.id)}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                currentTrack.id === track.id
                  ? 'bg-gradient-to-b from-[#0B3528] to-[#06251A] border-amber-400 ring-2 ring-amber-400/40 shadow-lg'
                  : 'bg-[#041B12] hover:bg-[#07281B] border-amber-500/20 text-emerald-200/80'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-bold text-sm text-amber-200 font-display">
                  {track.name}
                </span>
                <span className="text-[10px] font-mono text-amber-400/80">
                  {track.bpm} BPM
                </span>
              </div>
              <p className="text-xs text-emerald-200/70 leading-relaxed">
                {track.description}
              </p>
            </button>
          ))}
        </div>

        {/* Interactive Elevator Bell Soundboard */}
        <div className="pt-5 border-t border-amber-500/20">
          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
            <BellRing className="w-3.5 h-3.5" />
            <span>Elevator SFX Soundboard (Click to Test)</span>
          </h4>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => triggerChime('single')}
              className={`px-4 py-2 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                activeBell === 'single'
                  ? 'bg-amber-400 text-[#051A12] border-amber-300 scale-105'
                  : 'bg-emerald-950/80 hover:bg-emerald-900 text-amber-200 border-amber-500/30'
              }`}
            >
              🛎️ Single Floor Ding (E6)
            </button>

            <button
              onClick={() => triggerChime('double')}
              className={`px-4 py-2 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                activeBell === 'double'
                  ? 'bg-amber-400 text-[#051A12] border-amber-300 scale-105'
                  : 'bg-emerald-950/80 hover:bg-emerald-900 text-amber-200 border-amber-500/30'
              }`}
            >
              🔔 Penthouse Ding-Dong (E6-B5)
            </button>

            <button
              onClick={() => triggerChime('correct')}
              className={`px-4 py-2 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                activeBell === 'correct'
                  ? 'bg-emerald-400 text-[#051A12] border-emerald-300 scale-105'
                  : 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 border-emerald-500/30'
              }`}
            >
              ✨ Correct Answer Arpeggio
            </button>

            <button
              onClick={() => triggerChime('wrong')}
              className={`px-4 py-2 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                activeBell === 'wrong'
                  ? 'bg-red-400 text-[#051A12] border-red-300 scale-105'
                  : 'bg-emerald-950/80 hover:bg-emerald-900 text-red-300 border-red-500/30'
              }`}
            >
              🪵 Polite Stalled Clack
            </button>

            <button
              onClick={() => triggerChime('streak')}
              className={`px-4 py-2 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                activeBell === 'streak'
                  ? 'bg-amber-400 text-[#051A12] border-amber-300 scale-105'
                  : 'bg-emerald-950/80 hover:bg-emerald-900 text-amber-300 border-amber-500/30'
              }`}
            >
              🏆 Golden Multiplier Fanfare
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
